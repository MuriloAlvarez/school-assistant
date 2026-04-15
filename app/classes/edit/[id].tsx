import React, { useEffect, useMemo } from "react";
import {
  Box,
  ScrollView,
  VStack,
  Heading,
  Text,
  useToast,
  Toast,
  ToastDescription,
  ToastTitle,
} from "@gluestack-ui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  EMPTY_STATE_MESSAGES,
  ROUTES,
  TOAST_MESSAGES,
  TOAST_TITLES,
} from "@/core/constants";
import { Loading } from "@/core/components/Loading";
import { EmptyState } from "@/core/components/EmptyState";
import { ClassForm, useClasses } from "@/features/classes";
import type { UpdateClassDTO } from "@/features/classes";

export default function EditClassScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    schoolId?: string | string[];
  }>();
  const classId = typeof params.id === "string" ? params.id : undefined;
  const routeSchoolId =
    typeof params.schoolId === "string" ? params.schoolId : undefined;
  const router = useRouter();
  const toast = useToast();
  const { classes, isLoading, fetchClasses, updateClass } =
    useClasses(routeSchoolId);

  useEffect(() => {
    if (routeSchoolId) {
      fetchClasses();
    }
  }, [routeSchoolId, fetchClasses]);

  const schoolClass = useMemo(
    () => classes.find((currentClass) => currentClass.id === classId),
    [classes, classId],
  );

  const redirectSchoolId = routeSchoolId ?? schoolClass?.schoolId;

  const handleSubmit = async (data: UpdateClassDTO) => {
    if (!classId) {
      return;
    }

    try {
      await updateClass(classId, data);
      toast.show({
        placement: "top",
        render: ({ id: toastId }) => (
          <Toast nativeID={toastId} action="success" variant="solid">
            <VStack space="xs">
              <ToastTitle>{TOAST_TITLES.SUCCESS}</ToastTitle>
              <ToastDescription>
                {TOAST_MESSAGES.CLASS.UPDATED}
              </ToastDescription>
            </VStack>
          </Toast>
        ),
      });

      router.replace({
        pathname: ROUTES.CLASSES.DETAIL_PATHNAME,
        params: redirectSchoolId
          ? { id: classId, schoolId: redirectSchoolId }
          : { id: classId },
      });
    } catch {
      toast.show({
        placement: "top",
        render: ({ id: toastId }) => (
          <Toast nativeID={toastId} action="error" variant="solid">
            <VStack space="xs">
              <ToastTitle>{TOAST_TITLES.ERROR}</ToastTitle>
              <ToastDescription>
                {TOAST_MESSAGES.CLASS.UPDATE_ERROR}
              </ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    }
  };

  if (!classId) {
    return (
      <EmptyState
        title={EMPTY_STATE_MESSAGES.CLASS.MISSING_ID_TITLE}
        description={EMPTY_STATE_MESSAGES.CLASS.EDIT_MISSING_ID_DESCRIPTION}
      />
    );
  }

  if (routeSchoolId && isLoading && classes.length === 0) {
    return <Loading />;
  }

  if (!schoolClass) {
    return (
      <EmptyState
        title={EMPTY_STATE_MESSAGES.CLASS.NOT_FOUND_TITLE}
        description={EMPTY_STATE_MESSAGES.CLASS.EDIT_NOT_FOUND_DESCRIPTION}
      />
    );
  }

  return (
    <Box flex={1} bg="$white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <VStack space="lg">
          <Heading size="xl">Editar Turma</Heading>
          <Text color="$textLight500">
            Atualize os dados da turma selecionada.
          </Text>
          <ClassForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            initialData={schoolClass}
          />
        </VStack>
      </ScrollView>
    </Box>
  );
}
