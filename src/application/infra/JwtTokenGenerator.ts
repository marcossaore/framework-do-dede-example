import type { TokenGenerator } from "@/domain/infra/TokenGenerator";
import { sign, SignOptions, verify } from 'jsonwebtoken'

export class JwtTokenGenerator implements TokenGenerator {

    constructor(private readonly secret: string) { }
    decode<T>(token: string): T & { expiresAt: Date } | null {
        try {
            const verified = verify(token, this.secret);
            (verified as any).expiresAt = new Date((verified as any).exp * 1000);
            return verified as T & { expiresAt: Date }
        } catch (error) {
            return null
        }
    }
    generate(key: any, expires: string): string {
        return sign(key, this.secret, { expiresIn: expires as SignOptions['expiresIn'] })
    }
}