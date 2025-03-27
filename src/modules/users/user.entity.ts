import { Entity, Restrict } from "framework-do-dede";

export namespace UserEntity {
    export type Input = {
        id?: number
        name: string
        email: string
        password: string
    }
}

export class UserEntity extends Entity {
    private readonly id?: number;
    private readonly name: string;
    private readonly email: string;
    @Restrict()
    private password?: string;

    private constructor(input: UserEntity.Input) {
        super()
        if (input.id) this.id = input.id
        if (input.password) this.password = input.password
        this.name = input.name
        this.email = input.email
    }

    static create(input: UserEntity.Input): UserEntity {
        const user = new UserEntity(input)
        user.encryptPassword(input.password)
        return user
    }

    static restore(input: UserEntity.Input): UserEntity {
        return new UserEntity(input)
    }

    private encryptPassword(rawPassword: string) {
        this.password = Bun.password.hashSync(rawPassword)
    }

    validatePassword(rawPassword: string) {
        return Bun.password.verifySync(rawPassword, this.password!)
    }

    getId() {
        return this.id
    }

    getName() {
        return this.name
    }
}