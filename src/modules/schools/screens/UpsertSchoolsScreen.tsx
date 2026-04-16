import React from "react";
import { Box, Heading, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import { useLocalSearchParams } from "expo-router";
import { EMPTY_STATE_MESSAGES } from "@/src/shared/constants";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { Loading } from "@/src/shared/components/Loading";
import { SchoolForm } from "../components";
import { useSchools } from "../useSchools";

export default function UpsertSchoolsScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const schoolId = typeof params.id === "string" ? params.id : undefined;

  const {
    initialFormData,
    isLoading,
    isFetchingSelectedSchool,
    submitUpsert,
    hookForm,
  } = useSchools({
    schoolId,
    loadList: false,
    loadDetails: Boolean(schoolId),
  });

  const isEditMode = Boolean(schoolId);

  if (isEditMode && isFetchingSelectedSchool) {
    return <Loading />;
  }

  if (isEditMode && !initialFormData) {
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
          <Heading size="xl">
            {isEditMode ? "Editar Escola" : "Cadastrar Nova Escola"}
          </Heading>
          <Text color="$textLight500">
            {isEditMode
              ? "Atualize os dados da escola selecionada."
              : "Preencha as informacoes para adicionar uma nova unidade escolar ao sistema."}
          </Text>
          <SchoolForm
            onSubmit={submitUpsert}
            isLoading={isLoading}
            submitLabel={isEditMode ? "Salvar Alteracoes" : "Salvar Escola"}
            hookForm={hookForm}
          />
        </VStack>
      </ScrollView>
    </Box>
  );
}
