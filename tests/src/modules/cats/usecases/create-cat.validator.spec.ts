import { CreateCatValidator } from "@/modules/cats/usecases/create-cat.validator";
import { describe, test, expect } from "bun:test";
import { BadRequest } from "framework-do-dede";

describe("CreateCatValidator", () => {
  const validator = new CreateCatValidator();

  test("validates correct input", () => {
    const validInput = { name: "Whiskers" };
    const result = validator.validate(validInput);
    expect(result).toEqual(validInput);
  });

  test("throws BadRequest when name is missing", () => {
    expect(() => validator.validate({}))
      .toThrow(new BadRequest('O atributo "name" é obrigatório.'));
  });

  test("throws BadRequest when name is not a string", () => {
    const invalidInputs = [
      { name: 123 },
      { name: true },
      { name: {} },
      { name: [] },
    ];

    invalidInputs.forEach(input => {
      expect(() => validator.validate(input))
        .toThrow(new BadRequest('O atributo "name" deve ser uma "string".'));
    });
  });

  test("allows empty string for name", () => {
    const input = { name: "" };
    expect(() => validator.validate(input)).not.toThrow();
    const result = validator.validate(input);
    expect(result).toEqual(input);
  });

  test("strips extra properties while keeping valid structure", () => {
    const input = { name: "Mittens", age: 3, color: "calico" };
    const result = validator.validate(input);
    expect(result).toEqual({ name: "Mittens" });
  });
});