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
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  EMPTY_STATE_MESSAGES,
  ROUTES,
  TOAST_MESSAGES,
  TOAST_TITLES,
} from "@/core/constants";
import { EmptyState } from "@/core/components/EmptyState";
import { ClassForm, useClasses } from "@/features/classes";
import type { CreateClassDTO } from "@/features/classes";

export default function NewClassScreen() {
  const params = useLocalSearchParams<{ schoolId?: string | string[] }>();
  const schoolId =
    typeof params.schoolId === "string" ? params.schoolId : undefined;
  const router = useRouter();
  const { createClass, isLoading } = useClasses(schoolId);
  const toast = useToast();

  const handleSubmit = async (data: CreateClassDTO) => {
    if (!schoolId) {
      return;
    }

    try {
      await createClass(data);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action="success" variant="solid">
            <VStack space="xs">
              <ToastTitle>{TOAST_TITLES.SUCCESS}</ToastTitle>
              <ToastDescription>
                {TOAST_MESSAGES.CLASS.CREATED}
              </ToastDescription>
            </VStack>
          </Toast>
        ),
      });
      router.replace({
        pathname: ROUTES.SCHOOLS.DETAIL_PATHNAME,
        params: { id: schoolId },
      });
    } catch {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action="error" variant="solid">
            <VStack space="xs">
              <ToastTitle>{TOAST_TITLES.ERROR}</ToastTitle>
              <ToastDescription>
                {TOAST_MESSAGES.CLASS.CREATE_ERROR}
              </ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    }
  };

  if (!schoolId) {
    return (
      <EmptyState
        title={EMPTY_STATE_MESSAGES.CLASS.MISSING_SCHOOL_TITLE}
        description={EMPTY_STATE_MESSAGES.CLASS.MISSING_SCHOOL_DESCRIPTION}
      />
    );
  }

  return (
    <Box flex={1} bg="$white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <VStack space="lg">
          <Heading size="xl">Nova Turma</Heading>
          <Text color="$textLight500">
            Adicione uma nova turma para esta unidade escolar.
          </Text>
          <ClassForm onSubmit={handleSubmit} isLoading={isLoading} />
        </VStack>
      </ScrollView>
    </Box>
  );
}
