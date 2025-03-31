import type { TokenGenerator } from "@/domain/infra/TokenGenerator";
import { UserEntity } from "@/modules/users/user.entity";
import { HttpMiddleware, Inject, type RestoreRepository, Unauthorized } from "framework-do-dede";

type Input = {
    headers: {
        "x-api-token": string
    }
}

export namespace Authentication {
    export type Output = {
        id: number
        name: string
    }
}

export class Authentication implements HttpMiddleware {

    constructor(
        @Inject('UserRepository')
        private readonly userRepository: RestoreRepository<UserEntity>,
        @Inject('TokenGenerator')
        private readonly tokenGenerator: TokenGenerator
    ) { }
    async execute(input: Input): Promise<any> {
        const token = input.headers['x-api-token']
        if (!token) throw new Unauthorized('Invalid token')
        const decoded = this.tokenGenerator.decode<{ id: number }>(token)
        if (!decoded) throw new Unauthorized('Invalid token')
        const now  = Date.now()
        const diff = decoded.expiresAt.getTime() - now;
        if (diff < 0) throw new Unauthorized('Token expired')
        const user = await this.userRepository.restore(decoded.id)
        if (!user) throw new Unauthorized('Invalid token')
        return { auth: user }
    }
}
