import React from "react";
import { Box, Heading, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import { useLocalSearchParams } from "expo-router";
import { EMPTY_STATE_MESSAGES } from "@/src/shared/constants";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { Loading } from "@/src/shared/components/Loading";
import { ClassForm } from "../components";
import { useClasses } from "../useClasses";

export default function UpsertClassesScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    schoolId?: string | string[];
  }>();

  const classId = typeof params.id === "string" ? params.id : undefined;
  const schoolId =
    typeof params.schoolId === "string" ? params.schoolId : undefined;

  const {
    isEditMode,
    initialFormData,
    isLoading,
    isFetchingSelectedClass,
    submitUpsert,
  } = useClasses({
    schoolId,
    classId,
    autoLoad: Boolean(classId),
  });

  if (!isEditMode && !schoolId) {
    return (
      <EmptyState
        title={EMPTY_STATE_MESSAGES.CLASS.MISSING_SCHOOL_TITLE}
        description={EMPTY_STATE_MESSAGES.CLASS.MISSING_SCHOOL_DESCRIPTION}
      />
    );
  }

  if (isEditMode && isFetchingSelectedClass) {
    return <Loading />;
  }

  if (isEditMode && !initialFormData) {
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
          <Heading size="xl">
            {isEditMode ? "Editar Turma" : "Nova Turma"}
          </Heading>
          <Text color="$textLight500">
            {isEditMode
              ? "Atualize os dados da turma selecionada."
              : "Adicione uma nova turma para esta unidade escolar."}
          </Text>
          <ClassForm
            onSubmit={submitUpsert}
            isLoading={isLoading}
            initialData={initialFormData ?? undefined}
            submitLabel={isEditMode ? "Salvar Alteracoes" : "Criar Turma"}
          />
        </VStack>
      </ScrollView>
    </Box>
  );
}
