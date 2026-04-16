const LETTERS_ONLY_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

export const sanitizeDigits = (value: string, maxLength?: number): string => {
  const digits = value.replace(/\D/g, "");

  if (maxLength === undefined) {
    return digits;
  }

  return digits.slice(0, maxLength);
};

export const hasOnlyLetters = (value: string): boolean => {
  const normalized = value.trim();
  return normalized.length > 0 && LETTERS_ONLY_REGEX.test(normalized);
};

export const isOptionalLettersOnly = (value?: string): boolean => {
  if (!value || value.trim().length === 0) {
    return true;
  }

  return LETTERS_ONLY_REGEX.test(value.trim());
};
