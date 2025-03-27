import { JwtTokenGenerator } from "@/application/infra/JwtTokenGenerator";
import { test, expect, describe, beforeEach } from "bun:test";
import { sign, verify } from 'jsonwebtoken';

describe("JwtTokenGenerator", () => {
  const secret = "test-secret";
  let generator: JwtTokenGenerator;

  beforeEach(() => {
    generator = new JwtTokenGenerator(secret);
  });

  test("generate should create a valid JWT token", () => {
    const payload = { id: "123", name: "John Doe" };
    const expires = "1h";
    const token = generator.generate(payload, expires);
    
    // Verify using the same secret
    const decoded = verify(token, secret);
    expect(decoded).toMatchObject(payload);
  });

  test("decode should return payload for valid token", () => {
    const payload = { id: "456", role: "admin" };
    const token = sign(payload, secret);
    
    const result = generator.decode(token);
    expect(result).toMatchObject(payload);
  });

  test("decode should return null for invalid token", () => {
    const invalidToken = sign({ id: "789" }, "wrong-secret");
    
    const result = generator.decode(invalidToken);
    expect(result).toBeNull();
  });

  test("decode should return null for expired token", () => {
    const payload = { id: "expired" };
    const expiredToken = sign(payload, secret, { expiresIn: "-1s" });
    
    const result = generator.decode(expiredToken);
    expect(result).toBeNull();
  });

  test("decode should return null for malformed token", () => {
    const result = generator.decode("garbage-invalid-token");
    expect(result).toBeNull();
  });

  test("decode should return null for empty string", () => {
    const result = generator.decode("");
    expect(result).toBeNull();
  });
});