import React from "react";
import {
  Box,
  ScrollView,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  ButtonText,
  ButtonIcon,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AddIcon,
  Divider,
  Icon,
} from "@gluestack-ui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { EMPTY_STATE_MESSAGES, ROUTES } from "@/src/shared/constants";
import { ClassCard } from "../../classes/components/ClassCard";
import { useClasses } from "../../classes/useClasses";
import { Loading } from "@/src/shared/components/Loading";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { MapPin, Phone, User, GraduationCap } from "lucide-react-native";
import { useSchools } from "../useSchools";

export default function SchoolDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const schoolId = typeof params.id === "string" ? params.id : undefined;
  const router = useRouter();

  const {
    selectedSchool,
    isFetchingSelectedSchool,
    isDeleteDialogOpen,
    isDeleting,
    navigateToUpsert,
    openDeleteDialog,
    closeDeleteDialog,
    deleteSelectedSchool,
  } = useSchools({
    schoolId,
    loadList: false,
    loadDetails: true,
  });

  const { classes, isLoading: classesLoading } = useClasses({ schoolId });

  if (!schoolId) {
    return (
      <EmptyState
        title={EMPTY_STATE_MESSAGES.SCHOOL.MISSING_ID_TITLE}
        description={EMPTY_STATE_MESSAGES.SCHOOL.MISSING_ID_DESCRIPTION}
      />
    );
  }

  if (isFetchingSelectedSchool) {
    return <Loading />;
  }

  if (!selectedSchool)
    return (
      <EmptyState
        title={EMPTY_STATE_MESSAGES.SCHOOL.NOT_FOUND_TITLE}
        description={EMPTY_STATE_MESSAGES.SCHOOL.NOT_FOUND_DESCRIPTION}
      />
    );

  return (
    <Box flex={1} bg="$backgroundLight50">
      <ScrollView>
        <Box
          bg="$white"
          p="$6"
          borderBottomWidth={1}
          borderBottomColor="$borderLight200"
        >
          <VStack space="md">
            <Heading color="$secondary500" size="xl">
              {selectedSchool.name}
            </Heading>
            <VStack space="xs">
              <HStack space="xs" alignItems="center">
                <Icon as={MapPin} size="xs" color="$textLight500" />
                <Text color="$textLight500" size="sm">
                  {selectedSchool.address}
                </Text>
              </HStack>
              {selectedSchool.phone && (
                <HStack space="xs" alignItems="center">
                  <Icon as={Phone} size="xs" color="$textLight500" />
                  <Text color="$textLight500" size="sm">
                    {selectedSchool.phone}
                  </Text>
                </HStack>
              )}
              {selectedSchool.principalName && (
                <HStack space="xs" alignItems="center">
                  <Icon as={User} size="xs" color="$textLight500" />
                  <Text color="$textLight500" size="sm">
                    Diretor(a): {selectedSchool.principalName}
                  </Text>
                </HStack>
              )}
            </VStack>

            <HStack space="sm" pt="$2">
              <Button
                size="sm"
                variant="outline"
                action="secondary"
                onPress={navigateToUpsert}
              >
                <ButtonText>Editar Escola</ButtonText>
              </Button>
              <Button size="sm" bg="$error500" onPress={openDeleteDialog}>
                <ButtonText>Excluir Escola</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Box>

        <Box
          mt="$4"
          mx="$4"
          bg="$white"
          p="$4"
          rounded="$2xl"
          borderWidth={1}
          borderColor="$borderLight200"
        >
          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Heading size="sm" color="$textLight900">
                Turmas
              </Heading>
              <Text size="xs" color="$textLight500">
                {classes.length} turmas cadastradas
              </Text>
            </VStack>
            <Button
              size="sm"
              action="primary"
              bg="$primary500"
              rounded="$lg"
              onPress={() =>
                router.push({
                  pathname: ROUTES.CLASSES.NEW,
                  params: { schoolId },
                })
              }
            >
              <ButtonIcon as={AddIcon} mr="$2" />
              <ButtonText>Nova Turma</ButtonText>
            </Button>
          </HStack>

          <Divider my="$4" bg="$borderLight200" />

          {classesLoading ? (
            <Loading />
          ) : classes.length > 0 ? (
            <VStack space="sm">
              {classes.map((c) => (
                <ClassCard
                  key={c.id}
                  schoolClass={c}
                  onPress={() =>
                    router.push({
                      pathname: ROUTES.CLASSES.DETAIL_PATHNAME,
                      params: { id: c.id, schoolId },
                    })
                  }
                />
              ))}
            </VStack>
          ) : (
            <EmptyState
              title={EMPTY_STATE_MESSAGES.SCHOOL_CLASSES.EMPTY_TITLE}
              description={
                EMPTY_STATE_MESSAGES.SCHOOL_CLASSES.EMPTY_DESCRIPTION
              }
              icon={GraduationCap}
            />
          )}
        </Box>
      </ScrollView>

      <AlertDialog isOpen={isDeleteDialogOpen} onClose={closeDeleteDialog}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="md">Excluir escola?</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>
              Esta acao nao pode ser desfeita e remove tambem as turmas
              vinculadas.
            </Text>
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
                onPress={deleteSelectedSchool}
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
