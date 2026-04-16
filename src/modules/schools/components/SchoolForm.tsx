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
import { useForm, Controller, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { CreateSchoolDTO } from "../types";
import { sanitizeDigits } from "@/src/shared/utils/formValidation";
import { PLACEHOLDERS, VALIDATION_LIMITS } from "@/src/shared/constants";
import { schoolSchema } from "../schemas";

interface SchoolFormProps {
  onSubmit: (data: CreateSchoolDTO) => void;
  isLoading?: boolean;
  initialData?: Partial<CreateSchoolDTO>;
  submitLabel?: string;
}

export const SchoolForm: React.FC<SchoolFormProps> = ({
  onSubmit,
  isLoading,
  initialData,
  submitLabel,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSchoolDTO>({
    resolver: yupResolver(schoolSchema) as Resolver<CreateSchoolDTO>,
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
        <ButtonText>
          {isLoading ? "Salvando..." : (submitLabel ?? "Salvar Escola")}
        </ButtonText>
      </Button>
    </VStack>
  );
};
