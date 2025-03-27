import { type CreateRepository, Inject, UseCase } from "framework-do-dede";
import { UserEntity } from "../../user.entity";

export namespace CreateUser {
    export type Input = {
        name: string,
        email: string,
        password: string,
        passwordConfirm: string
    }
    export type Output = void
}

export class CreateUser implements UseCase<CreateUser.Input, CreateUser.Output> {

    constructor(
        @Inject('UserRepository')
        private readonly userRepository: CreateRepository<UserEntity>
    ) { }

    async execute(input: CreateUser.Input): Promise<CreateUser.Output> {
        const user = UserEntity.create(input)
        await this.userRepository.create(user)
    }
}