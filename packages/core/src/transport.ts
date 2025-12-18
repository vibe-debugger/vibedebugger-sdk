import type { ErrorPayload, TransportOptions } from './types'

const DEFAULT_ENDPOINT = 'https://api.vibedebugger.ai/ingest/server'
const DEFAULT_TIMEOUT = 5000
const DEFAULT_MAX_RETRIES = 3

export class Transport {
    private options: Required<TransportOptions>

    constructor(options: TransportOptions) {
        this.options = {
            endpoint: options.endpoint || DEFAULT_ENDPOINT,
            maxRetries: options.maxRetries ?? DEFAULT_MAX_RETRIES,
            timeout: options.timeout ?? DEFAULT_TIMEOUT,
            apiKey: options.apiKey
        }
    }

    async send(payload: ErrorPayload): Promise<boolean> {
        let lastError: Error | null = null

        for (let attempt = 0; attempt < this.options.maxRetries; attempt++) {
            try {
                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), this.options.timeout)

                const response = await fetch(this.options.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-vibedebugger-api-key': this.options.apiKey,
                        'x-api-key': this.options.apiKey // Fallback header
                    },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                })

                clearTimeout(timeoutId)

                if (response.ok) {
                    return true
                }

                // Don't retry on 4xx errors (client errors)
                if (response.status >= 400 && response.status < 500) {
                    console.error(`[Vibe Debugger] Client error: ${response.status}`)
                    return false
                }

                // Retry on 5xx errors
                lastError = new Error(`Server error: ${response.status}`)
            } catch (error) {
                lastError = error as Error

                // Wait before retry (exponential backoff)
                if (attempt < this.options.maxRetries - 1) {
                    await this.sleep(Math.pow(2, attempt) * 1000)
                }
            }
        }

        console.error('[Vibe Debugger] Failed to send error after retries:', lastError)
        return false
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}
