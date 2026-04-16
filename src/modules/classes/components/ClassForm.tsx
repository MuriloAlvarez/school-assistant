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
import { useForm, Controller, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  PLACEHOLDERS,
  SHIFT_LABELS,
  SHIFT_OPTIONS,
  VALIDATION_LIMITS,
  getCurrentAcademicYear,
} from "@/src/shared/constants";
import type { CreateClassDTO, SchoolShift } from "@/src/modules/classes/types";
import { sanitizeDigits } from "@/src/shared/utils/formValidation";
import { classSchema } from "../schemas";

interface ClassFormProps {
  onSubmit: (data: CreateClassDTO) => void;
  isLoading?: boolean;
  initialData?: Partial<CreateClassDTO>;
  submitLabel?: string;
}

export const ClassForm: React.FC<ClassFormProps> = ({
  onSubmit,
  isLoading,
  initialData,
  submitLabel,
}) => {
  const currentYear = getCurrentAcademicYear();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClassDTO>({
    resolver: yupResolver(classSchema) as Resolver<CreateClassDTO>,
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
                <SelectIcon as={ChevronDownIcon} mr="$3" />
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
                  onChange(digits ? Number(digits) : undefined);
                }}
                value={value?.toString() ?? ""}
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
        <ButtonText>
          {isLoading ? "Salvando..." : (submitLabel ?? "Salvar Turma")}
        </ButtonText>
      </Button>
    </VStack>
  );
};
