export  interface TokenGenerator {
    generate(key: any, expires: string): string
    decode<T>(token: string): T & { expiresAt: Date } | null
}