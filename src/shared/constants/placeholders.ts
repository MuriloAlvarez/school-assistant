import { getCurrentAcademicYear } from "./validation";

export const PLACEHOLDERS = {
  SEARCH_SCHOOL: "Buscar por escola ou endereço...",
  SCHOOL_NAME: "Ex: Escola Municipal...",
  SCHOOL_ADDRESS: "Rua, Número, Bairro",
  SCHOOL_PHONE: "Ex: 11999999999",
  SCHOOL_PRINCIPAL: "Nome completo",
  CLASS_NAME: "Ex: 3º Ano A",
  CLASS_SHIFT: "Selecione o turno",
  CLASS_ACADEMIC_YEAR: `Ex: ${getCurrentAcademicYear()}`,
  CLASS_CAPACITY: "Ex: 30",
  CLASS_TEACHER: "Nome do professor",
} as const;
