import { CreateUser } from "@/modules/users/usecases/create/create-user.usecase";
import { UserEntity } from "@/modules/users/user.entity";
import { test, expect, describe, mock, beforeEach } from "bun:test";
import type { CreateRepository } from "framework-do-dede";

describe("CreateUser UseCase", () => {

    const mockUser = mock(async (user: UserEntity) => { })

    const mockUserRepository: CreateRepository<UserEntity> = {
        create: mockUser
    };

    const validInput = {
        name: "John Doe",
        email: "john@example.com",
        password: "securePassword123",
        passwordConfirm: "securePassword123"
    };

    beforeEach(() => {
        mockUser.mockClear();
    });

    test("should create user with valid input", async () => {
        const useCase = new CreateUser(mockUserRepository);

        await useCase.execute(validInput);

        expect(mockUserRepository.create).toHaveBeenCalled();
        // @ts-ignore
        const createdUser = mockUserRepository.create.mock.calls[0][0];
        expect(createdUser).toBeInstanceOf(UserEntity);
        expect(createdUser.name).toBe(validInput.name);
        expect(createdUser.email).toBe(validInput.email);
    });

    test("should propagate repository errors", async () => {
        const erroringRepository: CreateRepository<UserEntity> = {
            create: mock(async () => { throw new Error("DB connection failed") })
        };
        const useCase = new CreateUser(erroringRepository);

        expect(useCase.execute(validInput)).rejects.toThrow();
    });
});