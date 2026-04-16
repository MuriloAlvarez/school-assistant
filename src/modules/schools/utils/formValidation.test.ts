import { describe, expect, it } from "vitest";
import {
  hasOnlyLetters,
  isOptionalLettersOnly,
  sanitizeDigits,
} from "./formValidation";

describe("formValidation", () => {
  it("sanitizeDigits keeps only digits and respects max length", () => {
    expect(sanitizeDigits("(11) 99999-8888", 11)).toBe("11999998888");
    expect(sanitizeDigits("abc123def456", 4)).toBe("1234");
  });

  it("hasOnlyLetters accepts letters with accents and spaces", () => {
    expect(hasOnlyLetters("Escola Municipal")).toBe(true);
    expect(hasOnlyLetters("João da Silva")).toBe(true);
  });

  it("hasOnlyLetters rejects empty and alphanumeric values", () => {
    expect(hasOnlyLetters("   ")).toBe(false);
    expect(hasOnlyLetters("Escola 123")).toBe(false);
  });

  it("isOptionalLettersOnly accepts empty values and rejects numbers", () => {
    expect(isOptionalLettersOnly()).toBe(true);
    expect(isOptionalLettersOnly("   ")).toBe(true);
    expect(isOptionalLettersOnly("Maria Souza")).toBe(true);
    expect(isOptionalLettersOnly("Maria 2")).toBe(false);
  });
});
