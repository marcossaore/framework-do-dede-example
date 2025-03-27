import { Entity } from "framework-do-dede";

type Input = {
    id?: number
    tutorId: number,
    name: string
}

export class CatEntity extends Entity {
    private readonly id?: number;
    private readonly tutorId: number;
    private readonly name: string;

    private constructor(input: Input) {
        super()
        if (input.id) this.id = input.id
        this.name = input.name
        this.tutorId = input.tutorId
    }

    static create(input: Input): CatEntity {
        return new CatEntity(input)
    }

    static restore(input: Input): CatEntity {
        return new CatEntity(input)
    }
}