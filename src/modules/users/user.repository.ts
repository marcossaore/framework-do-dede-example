import { eq } from "drizzle-orm";
import { type CreateRepository, Entity, Inject, type RestoreRepository } from "framework-do-dede";
import { UserEntity } from "./user.entity";
import { RestoreByEmailRepository } from "@/domain/repository";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { usersTable } from "@/db/schema";

export class UserRepository implements CreateRepository<UserEntity>, RestoreRepository<UserEntity>, RestoreByEmailRepository<UserEntity> {
    
    constructor(
        @Inject('Orm')
        private readonly orm: NodePgDatabase
      ) { }

    async create(input: Entity): Promise<void> {
        await this.orm.insert(usersTable).values(input.toSave() as typeof usersTable.$inferInsert)
    }

    async restore(id: string | number): Promise<UserEntity | undefined> {
        const user = await this.orm.select().from(usersTable).where(eq(usersTable.id, id as number))
        return user[0] ? UserEntity.restore(user[0] as UserEntity.Input) : undefined
    }

    async restoreByEmail(email: string): Promise<UserEntity | undefined> {
        const user = await this.orm.select().from(usersTable).where(eq(usersTable.email, email))
        return user[0] ? UserEntity.restore(user[0] as UserEntity.Input) : undefined
    }
}