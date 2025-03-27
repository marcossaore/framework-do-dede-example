import { describe, expect, test, jest } from "bun:test";
import { Unauthorized } from "framework-do-dede";
import type { RestoreByEmailRepository } from "@/domain/repository";
import { UserEntity } from "@/modules/users/user.entity";
import { TokenGenerator } from "@/domain/infra/TokenGenerator";
import { Login } from "@/modules/auth/usecases/login/login-usecase";

describe("Login UseCase", () => {
    const mockUserId = "test-user-id";
    const mockToken = "generated-token";

    test("throws Unauthorized if user is not found", async () => {
        // Mock UserRepository that returns null
        const mockUserRepo: RestoreByEmailRepository<UserEntity> = {
            restoreByEmail: () => Promise.resolve(undefined),
        };

        const mockTokenGenerator: TokenGenerator = {
            generate: jest.fn(),
            decode: jest.fn(),
        };

        const loginUseCase = new Login(mockUserRepo, mockTokenGenerator);
        expect(
            loginUseCase.execute({ email: "nonexistent@test.com", password: "any" })
        ).rejects.toThrow(Unauthorized);
    });

    test("throws Unauthorized if password is invalid", async () => {
        // Mock User with invalid password
        const mockUser: UserEntity = {
            validatePassword: () => false,
            getId: () => mockUserId,
        } as unknown as UserEntity;

        const mockUserRepo: RestoreByEmailRepository<UserEntity> = {
            restoreByEmail: () => Promise.resolve(mockUser),
        };

        const mockTokenGenerator: TokenGenerator = {
            generate: jest.fn(),
            decode: jest.fn(),
        };

        const loginUseCase = new Login(mockUserRepo, mockTokenGenerator);
        expect(
            loginUseCase.execute({ email: "user@test.com", password: "wrong" })
        ).rejects.toThrow(Unauthorized);
    });

    test("returns token when credentials are valid", async () => {
        // Mock valid User
        const mockUser: UserEntity = {
            validatePassword: () => true,
            getId: () => mockUserId,
        } as unknown as UserEntity;

        const generateSpy = jest.fn(() => mockToken);
        const mockUserRepo: RestoreByEmailRepository<UserEntity> = {
            restoreByEmail: () => Promise.resolve(mockUser),
        };

        const mockTokenGenerator: TokenGenerator = {
            generate: generateSpy,
            decode: jest.fn(),
        };

        const loginUseCase = new Login(mockUserRepo, mockTokenGenerator);
        const result = await loginUseCase.execute({
            email: "valid@test.com",
            password: "correct",
        });

        expect(result.token).toBe(mockToken);
        expect(generateSpy).toHaveBeenCalledWith({ id: mockUserId });
    });
});