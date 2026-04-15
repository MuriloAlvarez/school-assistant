import React, { useEffect, useState } from "react";
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
import { ClassCard, useClasses } from "@/features/classes";
import { Loading } from "@/core/components/Loading";
import { EmptyState } from "@/core/components/EmptyState";
import { MapPin, Phone, User, GraduationCap } from "lucide-react-native";
import { schoolRepository, useSchools } from "@/features/schools";
import type { School } from "@/features/schools";

export default function SchoolDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const schoolId = typeof params.id === "string" ? params.id : undefined;
  const router = useRouter();
  const toast = useToast();
  const { deleteSchool } = useSchools();
  const [school, setSchool] = useState<School | null>(null);
  const {
    classes,
    isLoading: classesLoading,
    fetchClasses,
  } = useClasses(schoolId);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingSchool, setIsDeletingSchool] = useState(false);

  const handleDeleteSchool = async () => {
    if (!schoolId) {
      return;
    }

    setIsDeletingSchool(true);
    try {
      await deleteSchool(schoolId);
      toast.show({
        placement: "top",
        render: ({ id: toastId }) => (
          <Toast nativeID={toastId} action="success" variant="solid">
            <VStack space="xs">
              <ToastTitle>{TOAST_TITLES.SUCCESS}</ToastTitle>
              <ToastDescription>
                {TOAST_MESSAGES.SCHOOL.DELETED}
              </ToastDescription>
            </VStack>
          </Toast>
        ),
      });
      setIsDeleteDialogOpen(false);
      router.replace(ROUTES.HOME);
    } catch {
      toast.show({
        placement: "top",
        render: ({ id: toastId }) => (
          <Toast nativeID={toastId} action="error" variant="solid">
            <VStack space="xs">
              <ToastTitle>{TOAST_TITLES.ERROR}</ToastTitle>
              <ToastDescription>
                {TOAST_MESSAGES.SCHOOL.DELETE_ERROR}
              </ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    } finally {
      setIsDeletingSchool(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      if (!schoolId) {
        setSchool(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await schoolRepository.findById(schoolId);
        setSchool(data);
        await fetchClasses();
      } catch {
        setSchool(null);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [schoolId, fetchClasses]);

  if (!schoolId) {
    return (
      <EmptyState
        title={EMPTY_STATE_MESSAGES.SCHOOL.MISSING_ID_TITLE}
        description={EMPTY_STATE_MESSAGES.SCHOOL.MISSING_ID_DESCRIPTION}
      />
    );
  }

  if (loading) return <Loading />;
  if (!school)
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
              {school.name}
            </Heading>
            <VStack space="xs">
              <HStack space="xs" alignItems="center">
                <Icon as={MapPin} size="xs" color="$textLight500" />
                <Text color="$textLight500" size="sm">
                  {school.address}
                </Text>
              </HStack>
              {school.phone && (
                <HStack space="xs" alignItems="center">
                  <Icon as={Phone} size="xs" color="$textLight500" />
                  <Text color="$textLight500" size="sm">
                    {school.phone}
                  </Text>
                </HStack>
              )}
              {school.principalName && (
                <HStack space="xs" alignItems="center">
                  <Icon as={User} size="xs" color="$textLight500" />
                  <Text color="$textLight500" size="sm">
                    Diretor(a): {school.principalName}
                  </Text>
                </HStack>
              )}
            </VStack>

            <HStack space="sm" pt="$2">
              <Button
                size="sm"
                variant="outline"
                action="secondary"
                onPress={() => router.push(ROUTES.SCHOOLS.edit(schoolId))}
              >
                <ButtonText>Editar Escola</ButtonText>
              </Button>
              <Button
                size="sm"
                bg="$error500"
                onPress={() => setIsDeleteDialogOpen(true)}
              >
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

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="md">Excluir escola?</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>
              Esta ação não pode ser desfeita e remove também as turmas
              vinculadas.
            </Text>
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
                isDisabled={isDeletingSchool}
                onPress={handleDeleteSchool}
              >
                <ButtonText>
                  {isDeletingSchool ? "Excluindo..." : "Excluir"}
                </ButtonText>
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
