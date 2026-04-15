import React from "react";
import {
  VStack,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Button,
  ButtonText,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  AlertCircleIcon,
} from "@gluestack-ui/themed";
import { useForm, Controller } from "react-hook-form";
import type { CreateSchoolDTO } from "../types";
import {
  hasOnlyLetters,
  isOptionalLettersOnly,
  sanitizeDigits,
} from "../utils/formValidation";
import {
  PLACEHOLDERS,
  VALIDATION_LIMITS,
  VALIDATION_MESSAGES,
} from "@/core/constants";

interface SchoolFormProps {
  onSubmit: (data: CreateSchoolDTO) => void;
  isLoading?: boolean;
  initialData?: Partial<CreateSchoolDTO>;
}

export const SchoolForm: React.FC<SchoolFormProps> = ({
  onSubmit,
  isLoading,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSchoolDTO>({
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || "",
      phone: initialData?.phone || "",
      principalName: initialData?.principalName || "",
    },
  });

  return (
    <VStack space="xl">
      <FormControl isInvalid={!!errors.name}>
        <FormControlLabel>
          <FormControlLabelText>Nome da Escola *</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="name"
          rules={{
            required: VALIDATION_MESSAGES.REQUIRED_NAME,
            minLength: {
              value: VALIDATION_LIMITS.SCHOOL_NAME_MIN_LENGTH,
              message: VALIDATION_MESSAGES.MIN_SCHOOL_NAME,
            },
            validate: (value) =>
              hasOnlyLetters(value) ||
              VALIDATION_MESSAGES.SCHOOL_NAME_ONLY_LETTERS,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder={PLACEHOLDERS.SCHOOL_NAME}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{errors.name?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={!!errors.address}>
        <FormControlLabel>
          <FormControlLabelText>Endereço *</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="address"
          rules={{ required: VALIDATION_MESSAGES.REQUIRED_ADDRESS }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder={PLACEHOLDERS.SCHOOL_ADDRESS}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{errors.address?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={!!errors.phone}>
        <FormControlLabel>
          <FormControlLabelText>Telefone</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="phone"
          rules={{
            validate: (value) => {
              if (!value) {
                return true;
              }

              if (!/^\d+$/.test(value)) {
                return VALIDATION_MESSAGES.PHONE_ONLY_NUMBERS;
              }

              if (value.length > VALIDATION_LIMITS.PHONE_MAX_DIGITS) {
                return VALIDATION_MESSAGES.PHONE_MAX_DIGITS;
              }

              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder={PLACEHOLDERS.SCHOOL_PHONE}
                onBlur={onBlur}
                onChangeText={(text) =>
                  onChange(
                    sanitizeDigits(text, VALIDATION_LIMITS.PHONE_MAX_DIGITS),
                  )
                }
                value={value}
                keyboardType="phone-pad"
                maxLength={VALIDATION_LIMITS.PHONE_MAX_DIGITS}
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{errors.phone?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={!!errors.principalName}>
        <FormControlLabel>
          <FormControlLabelText>Nome do Diretor(a)</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="principalName"
          rules={{
            validate: (value) =>
              isOptionalLettersOnly(value) ||
              VALIDATION_MESSAGES.PRINCIPAL_NAME_ONLY_LETTERS,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder={PLACEHOLDERS.SCHOOL_PRINCIPAL}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>
            {errors.principalName?.message}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <Button onPress={handleSubmit(onSubmit)} isDisabled={isLoading} mt="$4">
        <ButtonText>{isLoading ? "Salvando..." : "Salvar Escola"}</ButtonText>
      </Button>
    </VStack>
  );
};
