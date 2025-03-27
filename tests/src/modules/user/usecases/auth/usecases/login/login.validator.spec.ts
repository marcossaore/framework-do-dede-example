import { LoginValidator } from "@/modules/auth/usecases/login/login.validator";
import { test, expect } from "bun:test";
import { BadRequest } from "framework-do-dede";

// Test valid input
test("valid input returns parsed data", () => {
  const validator = new LoginValidator();
  const validInput = {
    email: "user@example.com",
    password: "securepassword123",
  };
  const result = validator.validate(validInput);
  expect(result).toEqual(validInput);
});

// Test missing email
test("missing email throws BadRequest with required error", () => {
  const validator = new LoginValidator();
  const invalidInput = { password: "pass" };

  try {
    validator.validate(invalidInput);
    expect(true).toBe(false); // Fail if no error
  } catch (error) {
    expect(error).toBeInstanceOf(BadRequest);
    expect((error as BadRequest).getStatusCode()).toBe(400);
    expect((error as BadRequest).message).toBe('O atributo "email" é obrigatório.');
  }
});

// Test missing password
test("missing password throws BadRequest with required error", () => {
  const validator = new LoginValidator();
  const invalidInput = { email: "test@example.com" };

  try {
    validator.validate(invalidInput);
    expect(true).toBe(false);
  } catch (error) {
    const badRequestError = error as BadRequest;
    expect(badRequestError).toBeInstanceOf(BadRequest);
    expect(badRequestError.getStatusCode()).toBe(400);
    expect(badRequestError.message).toBe('O atributo "password" é obrigatório.');
  }
});

// Test invalid email type
test("invalid email type throws BadRequest", () => {
  const validator = new LoginValidator();
  const invalidInput = { email: 123, password: "pass" };

  try {
    validator.validate(invalidInput);
    expect(true).toBe(false);
  } catch (error) {
    const badRequestError = error as BadRequest;
    expect(badRequestError).toBeInstanceOf(BadRequest);
    expect(badRequestError.getStatusCode()).toBe(400);
    expect(badRequestError.message).toBe('O atributo "email" deve ser uma "string".');
  }
});

// Test invalid password type
test("invalid password type throws BadRequest", () => {
  const validator = new LoginValidator();
  const invalidInput = { email: "test@example.com", password: 12345 };

  try {
    validator.validate(invalidInput);
    expect(true).toBe(false);
  } catch (error) {
    const badRequestError = error as BadRequest;
    expect(badRequestError).toBeInstanceOf(BadRequest);
    expect(badRequestError.getStatusCode()).toBe(400);
    expect(badRequestError.message).toBe('O atributo "password" deve ser uma "string".');
  }
});

// Test invalid email format
test("invalid email format throws BadRequest", () => {
  const validator = new LoginValidator();
  const invalidInput = { email: "invalid-email", password: "pass" };

  try {
    validator.validate(invalidInput);
    expect(true).toBe(false);
  } catch (error) {
    const badRequestError = error as BadRequest;
    expect(badRequestError).toBeInstanceOf(BadRequest);
    expect(badRequestError.getStatusCode()).toBe(400);
    expect(badRequestError.message).toBe('O atributo "email" está inválido.');
  }
});

// Test multiple errors (returns first error)
test("multiple errors throw first error message", () => {
  const validator = new LoginValidator();
  const invalidInput = {};

  try {
    validator.validate(invalidInput);
    expect(true).toBe(false);
  } catch (error) {
    const badRequestError = error as BadRequest;
    expect(badRequestError).toBeInstanceOf(BadRequest);
    expect(badRequestError.getStatusCode()).toBe(400);
    expect(badRequestError.message).toBe('O atributo "email" é obrigatório.');
  }
});

// Test extra fields are stripped
test("extra fields are removed from output", () => {
  const validator = new LoginValidator();
  const input = {
    email: "test@example.com",
    password: "pass",
    age: 30,
    name: "John",
  };

  const result = validator.validate(input);
  expect(result).toEqual({
    email: "test@example.com",
    password: "pass",
  });
});