import { usersTable, catsTable } from "@/db/schema";
import { test, expect, describe } from "bun:test";
import { integer, varchar, text } from "drizzle-orm/pg-core";

describe("Database Schema", () => {
  describe("usersTable", () => {
    test("should have correct table name", () => {
      // @ts-ignore
      expect(usersTable[Symbol.for("drizzle:Name")]).toBe("users");
    });

    test("should have correct columns", () => {
      // @ts-ignore
      const columns = usersTable[Symbol.for("drizzle:Columns")];
      
      // Test ID column
      expect(columns.id.config).toMatchObject({
        dataType: "number",
        primaryKey: true,
        default: undefined,
        generatedIdentity: {
          type: "always"
        }
      });

      // Test Name column
      expect(columns.name.config).toMatchObject({
        dataType: "string",
        notNull: true,
        enumValues: undefined
      });
      expect(columns.name.config.length).toBe(255);

      // Test Email column
      expect(columns.email.config).toMatchObject({
        dataType: "string",
        notNull: true,
        isUnique: true
      });
      expect(columns.email.config.length).toBe(255);

      // // Test Password column
      expect(columns.password.config).toMatchObject({
        dataType: "string",
        notNull: false
      });
    });
  });

  describe("catsTable", () => {
    test("should have correct table name", () => {
      // @ts-ignore
      expect(catsTable[Symbol.for("drizzle:Name")]).toBe("cats");
    });

    test("should have correct columns", () => {
      // @ts-ignore
      const columns = catsTable[Symbol.for("drizzle:Columns")];
      
      // Test ID column
      expect(columns.id.config).toMatchObject({
        dataType: "number",
        primaryKey: true,
        default: undefined
      });

      // Test Name column
      expect(columns.name.config).toMatchObject({
        dataType: "string",
        notNull: true,
        enumValues: undefined
      });
      expect(columns.name.config.length).toBe(255);
    });
  });
});