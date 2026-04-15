import React, { useEffect, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Box,
  Button,
  ButtonText,
  HStack,
  Heading,
  Text,
  VStack,
  useToast,
  Toast,
  ToastDescription,
  ToastTitle,
} from "@gluestack-ui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  EMPTY_STATE_MESSAGES,
  ROUTES,
  SHIFT_LABELS,
  TOAST_MESSAGES,
  TOAST_TITLES,
} from "@/core/constants";
import { useClasses } from "@/features/classes";
import { EmptyState } from "@/core/components/EmptyState";
import { Loading } from "@/core/components/Loading";

export default function ClassDetailsScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    schoolId?: string | string[];
  }>();
  const classId = typeof params.id === "string" ? params.id : undefined;
  const routeSchoolId =
    typeof params.schoolId === "string" ? params.schoolId : undefined;
  const router = useRouter();
  const toast = useToast();
  const { classes, isLoading, fetchClasses, deleteClass } =
    useClasses(routeSchoolId);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingClass, setIsDeletingClass] = useState(false);

  useEffect(() => {
    if (routeSchoolId) {
      fetchClasses();
    }
  }, [routeSchoolId, fetchClasses]);

  const schoolClass = useMemo(
    () => classes.find((currentClass) => currentClass.id === classId),
    [classes, classId],
  );
  const effectiveSchoolId = routeSchoolId ?? schoolClass?.schoolId;

  const handleDeleteClass = async () => {
    if (!classId) {
      return;
    }

    setIsDeletingClass(true);
    try {
      await deleteClass(classId, effectiveSchoolId);
      toast.show({
        placement: "top",
        render: ({ id: toastId }) => (
          <Toast nativeID={toastId} action="success" variant="solid">
            <VStack space="xs">
              <ToastTitle>{TOAST_TITLES.SUCCESS}</ToastTitle>
              <ToastDescription>
                {TOAST_MESSAGES.CLASS.DELETED}
              </ToastDescription>
            </VStack>
          </Toast>
        ),
      });
      setIsDeleteDialogOpen(false);

      if (effectiveSchoolId) {
        router.replace({
          pathname: ROUTES.SCHOOLS.DETAIL_PATHNAME,
          params: { id: effectiveSchoolId },
        });
      } else {
        router.back();
      }
    } catch {
      toast.show({
        placement: "top",
        render: ({ id: toastId }) => (
          <Toast nativeID={toastId} action="error" variant="solid">
            <VStack space="xs">
              <ToastTitle>{TOAST_TITLES.ERROR}</ToastTitle>
              <ToastDescription>
                {TOAST_MESSAGES.CLASS.DELETE_ERROR}
              </ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    } finally {
      setIsDeletingClass(false);
    }
  };

  if (!classId) {
    return (
      <EmptyState
        title={EMPTY_STATE_MESSAGES.CLASS.MISSING_ID_TITLE}
        description={EMPTY_STATE_MESSAGES.CLASS.MISSING_ID_DESCRIPTION}
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
        description={EMPTY_STATE_MESSAGES.CLASS.NOT_FOUND_DESCRIPTION}
      />
    );
  }

  return (
    <Box flex={1} bg="$backgroundLight50" p="$4">
      <VStack space="md">
        <Box
          bg="$white"
          p="$5"
          rounded="$2xl"
          borderWidth={1}
          borderColor="$borderLight200"
        >
          <VStack space="sm">
            <Heading size="lg" color="$secondary500">
              {schoolClass.name}
            </Heading>
            <Text color="$textLight500">
              Turno: {SHIFT_LABELS[schoolClass.shift]}
            </Text>
            <Text color="$textLight500">
              Ano letivo: {schoolClass.academicYear}
            </Text>
            <Text color="$textLight500">
              Capacidade: {schoolClass.capacity ?? "Não informada"}
            </Text>
            <Text color="$textLight500">
              Professor(a): {schoolClass.teacherName ?? "Não informado"}
            </Text>
          </VStack>
        </Box>

        <HStack space="sm">
          <Button
            flex={1}
            variant="outline"
            action="secondary"
            onPress={() => {
              const editParams = effectiveSchoolId
                ? { id: classId, schoolId: effectiveSchoolId }
                : { id: classId };

              router.push({
                pathname: ROUTES.CLASSES.EDIT_PATHNAME,
                params: editParams,
              });
            }}
          >
            <ButtonText>Editar Turma</ButtonText>
          </Button>
          <Button
            flex={1}
            bg="$error500"
            onPress={() => setIsDeleteDialogOpen(true)}
          >
            <ButtonText>Excluir Turma</ButtonText>
          </Button>
        </HStack>
      </VStack>

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="md">Excluir turma?</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>Esta ação não pode ser desfeita.</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <HStack space="sm">
              <Button
                variant="outline"
                action="secondary"
                onPress={() => setIsDeleteDialogOpen(false)}
              >
                <ButtonText>Cancelar</ButtonText>
              </Button>
              <Button
                bg="$error500"
                isDisabled={isDeletingClass}
                onPress={handleDeleteClass}
              >
                <ButtonText>
                  {isDeletingClass ? "Excluindo..." : "Excluir"}
                </ButtonText>
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
