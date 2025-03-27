import { CreateUserValidator } from "@/modules/users/usecases/create/create-user.validator";
import { test, expect, describe } from "bun:test";
import { BadRequest } from "framework-do-dede";

describe("CreateUserValidator", () => {
  const validator = new CreateUserValidator();
  const baseValidInput = {
    name: "John Doe",
    email: "john@example.com",
    password: "ValidPass123!",
    passwordConfirm: "ValidPass123!"
  };

  test("valid input should pass", () => {
    expect(() => validator.validate(baseValidInput)).not.toThrow();
  });

  describe("Required fields", () => {
    test("missing name", () => {
      const input = { ...baseValidInput, name: undefined };
      expect(() => validator.validate(input)).toThrow(new BadRequest('O atributo "name" é obrigatório.'));
    });

    test("missing email", () => {
      const input = { ...baseValidInput, email: undefined };
      expect(() => validator.validate(input)).toThrow(new BadRequest('O atributo "email" é obrigatório.'));
    });

    test("missing password", () => {
      const input = { ...baseValidInput, password: undefined };
      expect(() => validator.validate(input)).toThrow(new BadRequest('O atributo "password" é obrigatório.'));
    });

    test("missing passwordConfirm", () => {
      const input = { ...baseValidInput, passwordConfirm: undefined };
      expect(() => validator.validate(input)).toThrow(new BadRequest('O atributo "passwordConfirm" é obrigatório.'));
    });
  });

  describe("Email validation", () => {
    test("invalid email format", () => {
      const input = { ...baseValidInput, email: "invalid-email" };
      expect(() => validator.validate(input)).toThrow(new BadRequest('O atributo "email" está inválido.'));
    });
  });

  describe("Password validation", () => {
    test("password too short", () => {
      const input = { ...baseValidInput, password: "Short1!", passwordConfirm: "Short1!" };
      expect(() => validator.validate(input)).toThrow(new BadRequest("A senha deve ter no mínimo 8 caracters."));
    });

    test("password missing complexity", () => {
      const input = { 
        ...baseValidInput, 
        password: "missingcomplexity1",
        passwordConfirm: "missingcomplexity1"
      };
      expect(() => validator.validate(input)).toThrow(
        new BadRequest("A senha deve ter no mínimo 8 caracteres: pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caracter especial.")
      );
    });

    test("password mismatch", () => {
      const input = { ...baseValidInput, passwordConfirm: "Different123!" };
      expect(() => validator.validate(input)).toThrow(new BadRequest("As senhas não conferem."));
    });
  });

  describe("Type validation", () => {
    test("invalid name type", () => {
      const input = { ...baseValidInput, name: 123 };
      expect(() => validator.validate(input)).toThrow(new BadRequest('O atributo "name" deve ser uma "string".'));
    });

    test("invalid email type", () => {
      const input = { ...baseValidInput, email: 123 };
      expect(() => validator.validate(input)).toThrow(new BadRequest('O atributo "email" deve ser uma "string".'));
    });

    test("invalid password type", () => {
      const input = { ...baseValidInput, password: 123 };
      expect(() => validator.validate(input)).toThrow(new BadRequest('O atributo "password" deve ser uma "string".'));
    });

    test("invalid passwordConfirm type", () => {
      const input = { ...baseValidInput, passwordConfirm: 123 };
      expect(() => validator.validate(input)).toThrow(new BadRequest('O atributo "passwordConfirm" deve ser uma "string".'));
    });
  });
});