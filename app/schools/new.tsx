import React from "react";
import {
  Box,
  ScrollView,
  VStack,
  Heading,
  Text,
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { ROUTES, TOAST_MESSAGES, TOAST_TITLES } from "@/core/constants";
import { SchoolForm, useSchools } from "@/features/schools";
import type { CreateSchoolDTO } from "@/features/schools";

export default function NewSchoolScreen() {
  const router = useRouter();
  const { createSchool, isLoading } = useSchools();
  const toast = useToast();

  const handleSubmit = async (data: CreateSchoolDTO) => {
    try {
      await createSchool(data);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action="success" variant="solid">
            <VStack space="xs">
              <ToastTitle>{TOAST_TITLES.SUCCESS}</ToastTitle>
              <ToastDescription>
                {TOAST_MESSAGES.SCHOOL.CREATED}
              </ToastDescription>
            </VStack>
          </Toast>
        ),
      });
      router.replace(ROUTES.HOME);
    } catch {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action="error" variant="solid">
            <VStack space="xs">
              <ToastTitle>{TOAST_TITLES.ERROR}</ToastTitle>
              <ToastDescription>
                {TOAST_MESSAGES.SCHOOL.CREATE_ERROR}
              </ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    }
  };

  return (
    <Box flex={1} bg="$white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <VStack space="lg">
          <Heading size="xl">Cadastrar Nova Escola</Heading>
          <Text color="$textLight500">
            Preencha as informações abaixo para adicionar uma nova unidade
            escolar ao sistema.
          </Text>
          <SchoolForm onSubmit={handleSubmit} isLoading={isLoading} />
        </VStack>
      </ScrollView>
    </Box>
  );
}
