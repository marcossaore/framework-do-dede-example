import { type CreateRepository, Entity, Inject } from "framework-do-dede";
import { CatEntity } from "./cat.entity";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { catsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export interface ExistsByNameAndTutorIdRepository {
    existsByNameAndTutorId(tutorId: number, name: string): Promise<boolean>
}

export class CatRepository implements CreateRepository<CatEntity>, ExistsByNameAndTutorIdRepository {

    constructor(
        @Inject('Orm')
        private readonly orm: NodePgDatabase
    ) { }

    async existsByNameAndTutorId(tutorId: number, name: string): Promise<boolean> {
        const cat = await this.orm.select().from(catsTable).where(and(eq(catsTable.name, name), eq(catsTable.tutorId, tutorId)))
        return cat.length > 0
    }

    async create(input: Entity): Promise<void> {
        await this.orm.insert(catsTable).values(input.toSave() as typeof catsTable.$inferInsert)
    }
}