import { Auth, Conflict, type CreateRepository, Inject, UseCase } from "framework-do-dede";
import { CatEntity } from "../cat.entity";
import { Authentication } from "@/application/middlewares/Authentication";
import { type ExistsByNameAndTutorIdRepository } from "../cat.repository";

export namespace CreateCat {
    export type Input = {
        name: string,
    }
    export type Output = void
}

export class CreateCat implements UseCase<CreateCat.Input, CreateCat.Output> {

    @Auth()
    private readonly auth!: Authentication.Output

    constructor(
        @Inject('CatRepository')
        private readonly catRepository: CreateRepository<CatEntity> & ExistsByNameAndTutorIdRepository
    ) { }

    async execute(input: CreateCat.Input): Promise<CreateCat.Output> {
        const cat = CatEntity.create({
            name: input.name,
            tutorId: this.auth.id
        });
        const catExists = await this.catRepository.existsByNameAndTutorId(this.auth.id, input.name);
        if (catExists) throw new Conflict('Cat already exists')
        await this.catRepository.create(cat)
    }
}