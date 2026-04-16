import * as yup from "yup";
import { VALIDATION_LIMITS, VALIDATION_MESSAGES } from "@/src/shared/constants";

const LETTERS_ONLY_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

const optionalTrimmedString = () =>
  yup
    .string()
    .transform((value) => {
      const normalized = value?.trim();
      return normalized ? normalized : undefined;
    })
    .optional();

export const schoolSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required(VALIDATION_MESSAGES.REQUIRED_NAME)
    .min(
      VALIDATION_LIMITS.SCHOOL_NAME_MIN_LENGTH,
      VALIDATION_MESSAGES.MIN_SCHOOL_NAME,
    )
    .matches(LETTERS_ONLY_REGEX, VALIDATION_MESSAGES.SCHOOL_NAME_ONLY_LETTERS),
  address: yup.string().trim().required(VALIDATION_MESSAGES.REQUIRED_ADDRESS),
  phone: optionalTrimmedString()
    .test(
      "school-phone-validation",
      VALIDATION_MESSAGES.PHONE_ONLY_NUMBERS,
      (value) => {
        if (!value) {
          return true;
        }

        return /^\d+$/.test(value);
      },
    )
    .test(
      "school-phone-max-length",
      VALIDATION_MESSAGES.PHONE_MAX_DIGITS,
      (value) => !value || value.length <= VALIDATION_LIMITS.PHONE_MAX_DIGITS,
    ),
  principalName: optionalTrimmedString().test(
    "principal-name-only-letters",
    VALIDATION_MESSAGES.PRINCIPAL_NAME_ONLY_LETTERS,
    (value) => !value || LETTERS_ONLY_REGEX.test(value),
  ),
});
