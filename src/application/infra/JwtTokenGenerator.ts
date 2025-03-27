import type { TokenGenerator } from "@/domain/infra/TokenGenerator";
import { sign, SignOptions, verify } from 'jsonwebtoken'

export class JwtTokenGenerator implements TokenGenerator {
    
    constructor(private readonly secret: string) {}
    decode(token: string) {
        try {
            return verify(token, this.secret)
        } catch (error) {
            return null
        }
    }
    generate(key: any, expires: string): string {
        return sign(key, this.secret, { expiresIn: expires as SignOptions['expiresIn'] })
    }
}