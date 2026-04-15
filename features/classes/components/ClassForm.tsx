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
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  ChevronDownIcon,
} from "@gluestack-ui/themed";
import { useForm, Controller } from "react-hook-form";
import {
  PLACEHOLDERS,
  SHIFT_LABELS,
  SHIFT_OPTIONS,
  VALIDATION_LIMITS,
  VALIDATION_MESSAGES,
  getCurrentAcademicYear,
} from "@/core/constants";
import type { CreateClassDTO, SchoolShift } from "@/features/classes/types";
import {
  isOptionalLettersOnly,
  sanitizeDigits,
} from "@/features/schools/utils/formValidation";

interface ClassFormProps {
  onSubmit: (data: CreateClassDTO) => void;
  isLoading?: boolean;
  initialData?: Partial<CreateClassDTO>;
}

export const ClassForm: React.FC<ClassFormProps> = ({
  onSubmit,
  isLoading,
  initialData,
}) => {
  const currentYear = getCurrentAcademicYear();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClassDTO>({
    defaultValues: {
      name: initialData?.name || "",
      shift: initialData?.shift || "morning",
      academicYear: initialData?.academicYear ?? currentYear,
      capacity: initialData?.capacity,
      teacherName: initialData?.teacherName || "",
    },
  });

  return (
    <VStack space="xl">
      <FormControl isInvalid={!!errors.name}>
        <FormControlLabel>
          <FormControlLabelText>Nome da Turma *</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="name"
          rules={{ required: VALIDATION_MESSAGES.REQUIRED_NAME }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder={PLACEHOLDERS.CLASS_NAME}
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

      <FormControl isInvalid={!!errors.shift}>
        <FormControlLabel>
          <FormControlLabelText>Turno *</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="shift"
          rules={{ required: VALIDATION_MESSAGES.REQUIRED_SHIFT }}
          render={({ field: { onChange, value } }) => (
            <Select
              onValueChange={(selected) => onChange(selected as SchoolShift)}
              selectedValue={value}
            >
              <SelectTrigger variant="outline" size="md">
                <SelectInput
                  placeholder={PLACEHOLDERS.CLASS_SHIFT}
                  value={value ? SHIFT_LABELS[value as SchoolShift] : ""}
                />
                <SelectIcon mr="$3">
                  <ChevronDownIcon />
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {SHIFT_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          )}
        />
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{errors.shift?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={!!errors.academicYear}>
        <FormControlLabel>
          <FormControlLabelText>Ano Letivo *</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="academicYear"
          rules={{
            required: VALIDATION_MESSAGES.REQUIRED_ACADEMIC_YEAR,
            validate: {
              isNumeric: (value) =>
                Number.isInteger(value) ||
                VALIDATION_MESSAGES.ACADEMIC_YEAR_ONLY_NUMBERS,
              inRange: (value) => {
                if (!Number.isInteger(value)) {
                  return true;
                }

                return (
                  (value >= VALIDATION_LIMITS.ACADEMIC_YEAR_MIN &&
                    value <= VALIDATION_LIMITS.ACADEMIC_YEAR_MAX) ||
                  VALIDATION_MESSAGES.ACADEMIC_YEAR_RANGE
                );
              },
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder={PLACEHOLDERS.CLASS_ACADEMIC_YEAR}
                onBlur={onBlur}
                onChangeText={(text) => {
                  const digits = sanitizeDigits(
                    text,
                    VALIDATION_LIMITS.ACADEMIC_YEAR_DIGITS,
                  );
                  onChange(digits ? Number(digits) : Number.NaN);
                }}
                value={Number.isNaN(value) ? "" : value?.toString()}
                keyboardType="numeric"
                maxLength={VALIDATION_LIMITS.ACADEMIC_YEAR_DIGITS}
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>
            {errors.academicYear?.message}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={!!errors.capacity}>
        <FormControlLabel>
          <FormControlLabelText>Capacidade (Alunos)</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="capacity"
          rules={{
            validate: (value) =>
              value === undefined ||
              Number.isInteger(value) ||
              VALIDATION_MESSAGES.CAPACITY_ONLY_NUMBERS,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder={PLACEHOLDERS.CLASS_CAPACITY}
                onBlur={onBlur}
                onChangeText={(text) => {
                  const digits = sanitizeDigits(text);
                  onChange(digits ? Number(digits) : undefined);
                }}
                value={value?.toString()}
                keyboardType="numeric"
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>
            {errors.capacity?.message}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={!!errors.teacherName}>
        <FormControlLabel>
          <FormControlLabelText>Professor Responsável</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="teacherName"
          rules={{
            validate: (value) =>
              isOptionalLettersOnly(value) ||
              VALIDATION_MESSAGES.TEACHER_NAME_ONLY_LETTERS,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder={PLACEHOLDERS.CLASS_TEACHER}
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
            {errors.teacherName?.message}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <Button onPress={handleSubmit(onSubmit)} isDisabled={isLoading} mt="$4">
        <ButtonText>{isLoading ? "Salvando..." : "Salvar Turma"}</ButtonText>
      </Button>
    </VStack>
  );
};
