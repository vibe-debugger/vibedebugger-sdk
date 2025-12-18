import { Transport, sanitize, getServerContext } from '@vibedebugger/core'
import type { VibeConfig, ErrorPayload } from '@vibedebugger/core'

let globalConfig: VibeConfig | null = null
let transport: Transport | null = null

export function init(config: VibeConfig): void {
    if (!config.apiKey) {
        console.warn('[Vibe Debugger] No API key provided. SDK will not send errors.')
        return
    }

    if (config.enabled === false) {
        console.log('[Vibe Debugger] SDK is disabled.')
        return
    }

    globalConfig = {
        endpoint: 'https://api.vibedebugger.ai/ingest/server',
        environment: process.env.NODE_ENV || 'development',
        sanitizeKeys: [],
        enabled: true,
        ...config
    }

    transport = new Transport({
        apiKey: globalConfig.apiKey,
        endpoint: globalConfig.endpoint!
    })

    // Register global error handlers
    process.on('uncaughtException', (error) => {
        captureError(error, { fatal: true })
        // Don't exit immediately, give time to send
        setTimeout(() => process.exit(1), 1000)
    })

    process.on('unhandledRejection', (reason) => {
        const error = reason instanceof Error ? reason : new Error(String(reason))
        captureError(error, { unhandled: true })
    })

    console.log('[Vibe Debugger] SDK initialized successfully')
}

export async function captureError(
    error: Error,
    context?: Record<string, any>
): Promise<void> {
    if (!transport || !globalConfig) {
        console.warn('[Vibe Debugger] SDK not initialized. Call init() first.')
        return
    }

    try {
        const serverContext = getServerContext()
        const sanitizedContext = sanitize(
            { ...context, ...serverContext },
            globalConfig.sanitizeKeys
        )

        const payload: ErrorPayload = {
            errorMessage: error.message,
            errorStack: error.stack,
            framework: 'nodejs',
            serverName: serverContext.hostname,
            context: sanitizedContext
        }

        await transport.send(payload)
    } catch (err) {
        console.error('[Vibe Debugger] Failed to capture error:', err)
    }
}

export function errorHandler(
    err: Error,
    req: any,
    res: any,
    next: any
): void {
    captureError(err, {
        url: req.url,
        method: req.method,
        headers: req.headers,
        query: req.query,
        body: req.body
    })

    // Pass to next error handler
    next(err)
}
