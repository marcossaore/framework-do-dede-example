import { Inject, NotFound, type RestoreRepository, UseCase } from "framework-do-dede";
import { UserEntity } from "../../user.entity";

export namespace GetUser {
    export type Input = {
        id: number
    }
    export type Output = Record<string, any>
}

export class GetUser implements UseCase<GetUser.Input, GetUser.Output> {

    constructor(
        @Inject('UserRepository')
        private readonly userRepository: RestoreRepository<UserEntity>
    ) { }

    async execute(input: GetUser.Input): Promise<GetUser.Output> {
        const user = await this.userRepository.restore(input.id)
        if (!user) throw new NotFound('User not found');
        return user.attributes()
    }
}