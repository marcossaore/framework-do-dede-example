import { GetUser } from "@/modules/users/usecases/get/get-user.usecase";
import { UserEntity } from "@/modules/users/user.entity";
import { test, expect, describe, mock, beforeEach } from "bun:test";
import { NotFound } from "framework-do-dede";
import type { RestoreRepository } from "framework-do-dede";

describe("GetUser UseCase", () => {
    const mockUser: UserEntity = {
        id: 1,
        attributes: mock(() => ({ id: 1, name: "John Doe", email: "john@example.com" }))
    } as unknown as UserEntity;

    const mockUserRepository: RestoreRepository<UserEntity> = {
        restore: mock(async (id: number) => mockUser)
    };

    beforeEach(() => {
        // @ts-ignore
        mockUserRepository.restore.mockClear();
        // @ts-ignore
        mockUser.attributes.mockClear();
    });

    test("should return user attributes when user exists", async () => {
        const useCase = new GetUser(mockUserRepository);
        const result = await useCase.execute({ id: 1 });

        expect(mockUserRepository.restore).toHaveBeenCalledWith(1);
        expect(mockUser.attributes).toHaveBeenCalled();
        expect(result).toEqual({
            id: 1,
            name: "John Doe",
            email: "john@example.com"
        });
    });

    test("should throw NotFound when user doesn't exist", async () => {
        const erroringRepository: RestoreRepository<UserEntity> = {
            // @ts-ignore
            restore: mock(async () => null)
        };
        const useCase = new GetUser(erroringRepository);

        expect(useCase.execute({ id: 999 })).rejects.toThrow(new NotFound("User not found"));
        expect(erroringRepository.restore).toHaveBeenCalledWith(999);
    });

    test("should propagate repository errors", async () => {
        const error = new Error("Database connection failed");
        const erroringRepository: RestoreRepository<UserEntity> = {
            restore: mock(async () => { throw error; })
        };
        const useCase = new GetUser(erroringRepository);

        await expect(useCase.execute({ id: 1 })).rejects.toThrow(error);
    });
});