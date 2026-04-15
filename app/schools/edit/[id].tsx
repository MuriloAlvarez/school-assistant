import React, { useEffect, useState } from "react";
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
import { Loading } from "@/core/components/Loading";
import { EmptyState } from "@/core/components/EmptyState";
import {
  EMPTY_STATE_MESSAGES,
  ROUTES,
  TOAST_MESSAGES,
  TOAST_TITLES,
} from "@/core/constants";
import { SchoolForm, schoolRepository, useSchools } from "@/features/schools";
import type { CreateSchoolDTO, UpdateSchoolDTO } from "@/features/schools";

export default function EditSchoolScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const schoolId = typeof params.id === "string" ? params.id : undefined;
  const router = useRouter();
  const toast = useToast();
  const { updateSchool, isLoading } = useSchools();
  const [initialData, setInitialData] =
    useState<Partial<CreateSchoolDTO> | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function loadSchool() {
      if (!schoolId) {
        setIsFetching(false);
        return;
      }

      setIsFetching(true);
      try {
        const school = await schoolRepository.findById(schoolId);
        if (!school) {
          setInitialData(null);
          return;
        }

        setInitialData({
          name: school.name,
          address: school.address,
          phone: school.phone,
          principalName: school.principalName,
        });
      } finally {
        setIsFetching(false);
      }
    }

    loadSchool();
  }, [schoolId]);

  const handleSubmit = async (data: UpdateSchoolDTO) => {
    if (!schoolId) {
      return;
    }

    try {
      await updateSchool(schoolId, data);
      toast.show({
        placement: "top",
        render: ({ id: toastId }) => (
          <Toast nativeID={toastId} action="success" variant="solid">
            <VStack space="xs">
              <ToastTitle>{TOAST_TITLES.SUCCESS}</ToastTitle>
              <ToastDescription>
                {TOAST_MESSAGES.SCHOOL.UPDATED}
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
        render: ({ id: toastId }) => (
          <Toast nativeID={toastId} action="error" variant="solid">
            <VStack space="xs">
              <ToastTitle>{TOAST_TITLES.ERROR}</ToastTitle>
              <ToastDescription>
                {TOAST_MESSAGES.SCHOOL.UPDATE_ERROR}
              </ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    }
  };

  if (isFetching) {
    return <Loading />;
  }

  if (!schoolId) {
    return (
      <EmptyState
        title={EMPTY_STATE_MESSAGES.SCHOOL.MISSING_ID_TITLE}
        description={EMPTY_STATE_MESSAGES.SCHOOL.MISSING_ID_DESCRIPTION}
      />
    );
  }

  if (!initialData) {
    return (
      <EmptyState
        title={EMPTY_STATE_MESSAGES.SCHOOL.NOT_FOUND_TITLE}
        description={EMPTY_STATE_MESSAGES.SCHOOL.EDIT_NOT_FOUND_DESCRIPTION}
      />
    );
  }

  return (
    <Box flex={1} bg="$white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <VStack space="lg">
          <Heading size="xl">Editar Escola</Heading>
          <Text color="$textLight500">
            Atualize os dados da escola selecionada.
          </Text>
          <SchoolForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            initialData={initialData}
          />
        </VStack>
      </ScrollView>
    </Box>
  );
}
