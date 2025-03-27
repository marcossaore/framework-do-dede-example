import { Inject, Unauthorized, UseCase } from "framework-do-dede";
import type { RestoreByEmailRepository } from "@/domain/repository";
import { UserEntity } from "../../../users/user.entity";
import type { TokenGenerator } from "@/domain/infra/TokenGenerator";

export namespace Login {
    export type Input = {
        email: string,
        password: string
    }
    export type Output = {
        token: string
    }
}

export class Login implements UseCase<Login.Input, Login.Output> {

    constructor(
        @Inject('UserRepository')
        private readonly userRepository: RestoreByEmailRepository<UserEntity>,
        @Inject('TokenGenerator')
        private readonly tokenGenerator: TokenGenerator
    ) { }

    async execute(input: Login.Input): Promise<Login.Output> {
        const user = await this.userRepository.restoreByEmail(input.email)
        if (!user) throw new Unauthorized('Email or password invalid')
        if (!user.validatePassword(input.password)) throw new Unauthorized('Email or password invalid')
        const token = this.tokenGenerator.generate({
            id: user.getId()
        })
        return { token }
    }
}