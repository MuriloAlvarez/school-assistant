import React from "react";
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
} from "@gluestack-ui/themed";
import { useLocalSearchParams } from "expo-router";
import { EMPTY_STATE_MESSAGES, SHIFT_LABELS } from "@/src/shared/constants";
import { useClasses } from "../useClasses";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { Loading } from "@/src/shared/components/Loading";

export default function ClassDetailsScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    schoolId?: string | string[];
  }>();
  const classId = typeof params.id === "string" ? params.id : undefined;
  const schoolId =
    typeof params.schoolId === "string" ? params.schoolId : undefined;

  const {
    selectedClass,
    isFetchingSelectedClass,
    isDeleteDialogOpen,
    isDeleting,
    navigateToUpsert,
    openDeleteDialog,
    closeDeleteDialog,
    deleteCurrentClass,
  } = useClasses({
    schoolId,
    classId,
    autoLoad: true,
  });

  if (!classId) {
    return (
      <EmptyState
        title={EMPTY_STATE_MESSAGES.CLASS.MISSING_ID_TITLE}
        description={EMPTY_STATE_MESSAGES.CLASS.MISSING_ID_DESCRIPTION}
      />
    );
  }

  if (isFetchingSelectedClass) {
    return <Loading />;
  }

  if (!selectedClass) {
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
              {selectedClass.name}
            </Heading>
            <Text color="$textLight500">
              Turno: {SHIFT_LABELS[selectedClass.shift]}
            </Text>
            <Text color="$textLight500">
              Ano letivo: {selectedClass.academicYear}
            </Text>
            <Text color="$textLight500">
              Capacidade: {selectedClass.capacity ?? "Nao informada"}
            </Text>
            <Text color="$textLight500">
              Professor(a): {selectedClass.teacherName ?? "Nao informado"}
            </Text>
          </VStack>
        </Box>

        <HStack space="sm">
          <Button
            flex={1}
            variant="outline"
            action="secondary"
            onPress={navigateToUpsert}
          >
            <ButtonText>Editar Turma</ButtonText>
          </Button>
          <Button flex={1} bg="$error500" onPress={openDeleteDialog}>
            <ButtonText>Excluir Turma</ButtonText>
          </Button>
        </HStack>
      </VStack>

      <AlertDialog isOpen={isDeleteDialogOpen} onClose={closeDeleteDialog}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="md">Excluir turma?</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>Esta acao nao pode ser desfeita.</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <HStack space="sm">
              <Button
                variant="outline"
                action="secondary"
                onPress={closeDeleteDialog}
              >
                <ButtonText>Cancelar</ButtonText>
              </Button>
              <Button
                bg="$error500"
                isDisabled={isDeleting}
                onPress={deleteCurrentClass}
              >
                <ButtonText>
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </ButtonText>
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
