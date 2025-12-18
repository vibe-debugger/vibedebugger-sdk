export interface VibeConfig {
    apiKey: string
    projectId?: string
    endpoint?: string
    environment?: string
    sanitizeKeys?: string[]
    enabled?: boolean
}

export interface ErrorPayload {
    errorMessage: string
    errorStack?: string
    url?: string
    framework?: string
    serverName?: string
    traceId?: string
    context?: Record<string, any>
}

export interface TransportOptions {
    apiKey: string
    endpoint: string
    maxRetries?: number
    timeout?: number
}
