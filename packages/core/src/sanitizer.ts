const DEFAULT_SENSITIVE_KEYS = [
    'password',
    'passwd',
    'pwd',
    'secret',
    'token',
    'apiKey',
    'api_key',
    'accessToken',
    'access_token',
    'refreshToken',
    'refresh_token',
    'authorization',
    'auth',
    'cookie',
    'session',
    'private',
    'privateKey',
    'private_key'
]

export function sanitize(
    data: any,
    customKeys: string[] = []
): any {
    const sensitiveKeys = [...DEFAULT_SENSITIVE_KEYS, ...customKeys]

    if (data === null || data === undefined) {
        return data
    }

    if (typeof data !== 'object') {
        return data
    }

    if (Array.isArray(data)) {
        return data.map(item => sanitize(item, customKeys))
    }

    const sanitized: Record<string, any> = {}

    for (const [key, value] of Object.entries(data)) {
        const lowerKey = key.toLowerCase()
        const isSensitive = sensitiveKeys.some(sk =>
            lowerKey.includes(sk.toLowerCase())
        )

        if (isSensitive) {
            sanitized[key] = '[REDACTED]'
        } else if (typeof value === 'object') {
            sanitized[key] = sanitize(value, customKeys)
        } else {
            sanitized[key] = value
        }
    }

    return sanitized
}
