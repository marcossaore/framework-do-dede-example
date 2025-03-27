export  interface TokenGenerator {
    generate(key: any, expires: string): string
    decode(token: string): any
}