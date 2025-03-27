import { Entity } from "framework-do-dede";

export interface RestoreByEmailRepository<T extends Entity> {
    restoreByEmail(email: string): Promise<T | undefined>
}