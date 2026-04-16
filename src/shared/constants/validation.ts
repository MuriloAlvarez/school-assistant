export const VALIDATION_LIMITS = {
  SEARCH_DEBOUNCE_MS: 300,
  SCHOOL_NAME_MIN_LENGTH: 3,
  PHONE_MAX_DIGITS: 11,
  ACADEMIC_YEAR_MIN: 1980,
  ACADEMIC_YEAR_MAX: 2030,
  ACADEMIC_YEAR_DIGITS: 4,
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED_NAME: "Nome é obrigatório",
  REQUIRED_ADDRESS: "Endereço é obrigatório",
  REQUIRED_SHIFT: "Turno é obrigatório",
  REQUIRED_ACADEMIC_YEAR: "Ano letivo é obrigatório",
  MIN_SCHOOL_NAME: `Mínimo ${VALIDATION_LIMITS.SCHOOL_NAME_MIN_LENGTH} caracteres`,
  SCHOOL_NAME_ONLY_LETTERS: "Nome da escola deve conter apenas letras",
  PRINCIPAL_NAME_ONLY_LETTERS: "Nome do diretor(a) deve conter apenas letras",
  TEACHER_NAME_ONLY_LETTERS: "Professor responsável deve conter apenas letras",
  PHONE_ONLY_NUMBERS: "Telefone deve conter apenas números",
  PHONE_MAX_DIGITS: `Telefone deve ter no máximo ${VALIDATION_LIMITS.PHONE_MAX_DIGITS} números`,
  ACADEMIC_YEAR_ONLY_NUMBERS: "Ano letivo deve conter apenas números",
  ACADEMIC_YEAR_RANGE: `Ano letivo deve estar entre ${VALIDATION_LIMITS.ACADEMIC_YEAR_MIN} e ${VALIDATION_LIMITS.ACADEMIC_YEAR_MAX}`,
  CAPACITY_ONLY_NUMBERS: "Capacidade deve conter apenas números",
} as const;

export const getCurrentAcademicYear = () => new Date().getFullYear();
