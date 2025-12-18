import { init as nodeInit, captureError } from '@vibedebugger/node'
import type { VibeConfig } from '@vibedebugger/core'

export { captureError } from '@vibedebugger/node'

export function init(config: VibeConfig): void {
    nodeInit(config)
}

export function register(): void {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const config: VibeConfig = {
            apiKey: process.env.VIBE_API_KEY || process.env.VIBEDEBUGGER_API_KEY || '',
            projectId: process.env.VIBE_PROJECT_ID || process.env.VIBEDEBUGGER_PROJECT_ID,
            environment: process.env.NODE_ENV || 'development'
        }

        if (!config.apiKey) {
            console.warn('[Vibe Debugger] VIBE_API_KEY environment variable not set')
            return
        }

        init(config)
    }
}

export function withVibeDebugger<T extends (...args: any[]) => any>(
    handler: T
): T {
    return (async (...args: any[]) => {
        try {
            return await handler(...args)
        } catch (error) {
            if (error instanceof Error) {
                const req = args[0]
                await captureError(error, {
                    url: req?.url,
                    method: req?.method,
                    headers: req?.headers
                })
            }
            throw error
        }
    }) as T
}
