import * as yup from "yup";
import { VALIDATION_LIMITS, VALIDATION_MESSAGES } from "@/src/shared/constants";

const LETTERS_ONLY_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

export const classSchema = yup.object().shape({
  name: yup.string().trim().required(VALIDATION_MESSAGES.REQUIRED_NAME),
  shift: yup
    .mixed<"morning" | "afternoon" | "evening" | "full">()
    .oneOf(
      ["morning", "afternoon", "evening", "full"],
      VALIDATION_MESSAGES.REQUIRED_SHIFT,
    )
    .required(VALIDATION_MESSAGES.REQUIRED_SHIFT),
  academicYear: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === undefined ? undefined : value,
    )
    .typeError(VALIDATION_MESSAGES.ACADEMIC_YEAR_ONLY_NUMBERS)
    .required(VALIDATION_MESSAGES.REQUIRED_ACADEMIC_YEAR)
    .integer(VALIDATION_MESSAGES.ACADEMIC_YEAR_ONLY_NUMBERS)
    .min(
      VALIDATION_LIMITS.ACADEMIC_YEAR_MIN,
      VALIDATION_MESSAGES.ACADEMIC_YEAR_RANGE,
    )
    .max(
      VALIDATION_LIMITS.ACADEMIC_YEAR_MAX,
      VALIDATION_MESSAGES.ACADEMIC_YEAR_RANGE,
    ),
  capacity: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === undefined ? undefined : value,
    )
    .optional()
    .integer(VALIDATION_MESSAGES.CAPACITY_ONLY_NUMBERS)
    .typeError(VALIDATION_MESSAGES.CAPACITY_ONLY_NUMBERS),
  teacherName: yup
    .string()
    .transform((value) => {
      const normalized = value?.trim();
      return normalized ? normalized : undefined;
    })
    .optional()
    .test(
      "teacher-name-only-letters",
      VALIDATION_MESSAGES.TEACHER_NAME_ONLY_LETTERS,
      (value) => !value || LETTERS_ONLY_REGEX.test(value),
    ),
});
