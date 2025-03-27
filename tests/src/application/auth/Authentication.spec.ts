import { test, expect, mock, describe, beforeEach } from "bun:test";
import { Entity, Unauthorized } from "framework-do-dede";
import type { RestoreRepository } from "framework-do-dede";
import type { TokenGenerator } from "@/domain/infra/TokenGenerator";
import { Authentication } from "@/application/middlewares/Authentication";
import { UserEntity } from "@/modules/users/user.entity";

class MockUserEntity extends Entity {

}

const mockTokenGenerator = {
    decode: mock((token: string) => {
        if (token === "valid") return { id: "123" };
        return null;
    })
};

const mockRestore = mock(async (id: string) => {
    if (id === "123") return new MockUserEntity();
    return null;
});

const mockUserRepository: RestoreRepository<MockUserEntity> = {
    // @ts-ignore
    restore: mockRestore
};

describe("Authentication Middleware", () => {
    let middleware: Authentication;

    beforeEach(() => {
        mockTokenGenerator.decode.mockClear();
        mockRestore.mockClear();

        middleware = new Authentication(
            mockUserRepository as unknown as RestoreRepository<UserEntity>,
            mockTokenGenerator as unknown as TokenGenerator
        );
    });

    test("missing token throws Unauthorized", async () => {
        const input = { headers: {} } as any;
        expect(middleware.execute(input)).rejects.toThrow(Unauthorized);
        expect(middleware.execute(input)).rejects.toThrow("Invalid token");
    });

    test("invalid token throws Unauthorized", async () => {
        const input = { headers: { "x-api-token": "invalid" } };
        expect(middleware.execute(input)).rejects.toThrow(Unauthorized);
        expect(mockTokenGenerator.decode).toHaveBeenCalledWith("invalid");
    });

    test("valid token with non-existent user throws Unauthorized", async () => {
        mockTokenGenerator.decode.mockImplementationOnce(() => ({ id: "456" }));
        const input = { headers: { "x-api-token": "valid" } };
        expect(middleware.execute(input)).rejects.toThrow(Unauthorized);
        expect(mockUserRepository.restore).toHaveBeenCalledWith("456");
    });

    test("valid token with existing user returns auth object", async () => {
        const input = { headers: { "x-api-token": "valid" } };
        const result = await middleware.execute(input);
        expect(result).toEqual({ auth: new MockUserEntity() });
        expect(mockTokenGenerator.decode).toHaveBeenCalledWith("valid");
        expect(mockUserRepository.restore).toHaveBeenCalledWith("123");
    });

    test("token with missing user ID throws Unauthorized", async () => {
        mockTokenGenerator.decode.mockImplementationOnce(() => ({} as any));
        const input = { headers: { "x-api-token": "valid" } };
        expect(middleware.execute(input)).rejects.toThrow(Unauthorized);
        expect(mockUserRepository.restore).toHaveBeenCalledWith(undefined);
    });
});