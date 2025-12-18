import os from 'os'

export interface ServerContext {
    hostname: string
    platform: string
    nodeVersion: string
    environment: string
    pid: number
}

export function getServerContext(): ServerContext {
    return {
        hostname: os.hostname(),
        platform: os.platform(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        pid: process.pid
    }
}
