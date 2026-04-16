import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  VStack,
  Box,
  Input,
  InputField,
  InputSlot,
  InputIcon,
  SearchIcon,
  Fab,
  FabIcon,
  AddIcon,
  Heading,
  Text,
  HStack,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { EmptyState } from "@/src/shared/components/EmptyState";
import {
  EMPTY_STATE_MESSAGES,
  PLACEHOLDERS,
  ROUTES,
  VALIDATION_LIMITS,
} from "@/src/shared/constants";
import { useDebounce } from "@/src/shared/hooks/useDebounce";
import { SchoolCard } from "../components/SchoolCard";
import { useSchools } from "../useSchools";
import type { School } from "../types";

export default function SchoolsScreen() {
  const router = useRouter();
  const { schools, isLoading, fetchSchools, filters, setFilters } =
    useSchools();
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const debouncedSearch = useDebounce(
    searchTerm,
    VALIDATION_LIMITS.SEARCH_DEBOUNCE_MS,
  );

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  const totalClasses = schools.reduce((acc, s) => acc + s.classCount, 0);

  return (
    <Box flex={1} bg="$backgroundLight50">
      <VStack
        space="md"
        bg="$white"
        p="$6"
        borderBottomWidth={1}
        borderBottomColor="$borderLight200"
      >
        <Heading size="xl" color="$secondary500">
          Escolas Municipais
        </Heading>
        <Text size="sm" color="$textLight500">
          Gestão Centralizada de Ensino
        </Text>
      </VStack>

      <VStack p="$4" space="md">
        <Input
          size="md"
          variant="outline"
          bg="$white"
          borderColor="$borderLight200"
          rounded="$xl"
        >
          <InputSlot pl="$3">
            <InputIcon as={SearchIcon} color="$textLight500" />
          </InputSlot>
          <InputField
            placeholder={PLACEHOLDERS.SEARCH_SCHOOL}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="$textLight500"
          />
        </Input>

        <HStack space="md">
          <Box flex={1} bg="$secondary500" p="$4" rounded="$2xl">
            <Text size="xs" color="$white" opacity={0.8} fontWeight="$bold">
              ESCOLAS
            </Text>
            <Text size="xl" color="$white" fontWeight="$bold" mt="$1">
              {schools.length}
            </Text>
          </Box>
          <Box flex={1} bg="$primary500" p="$4" rounded="$2xl">
            <Text size="xs" color="$white" opacity={0.8} fontWeight="$bold">
              TOTAL TURMAS
            </Text>
            <Text size="xl" color="$white" fontWeight="$bold" mt="$1">
              {totalClasses}
            </Text>
          </Box>
        </HStack>

        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt="$2"
          px="$1"
        >
          <Text size="xs" fontWeight="$bold" color="$textLight500">
            LISTA DE ESCOLAS
          </Text>
          <Text size="xs" fontWeight="$bold" color="$secondary500">
            VER TODAS
          </Text>
        </HStack>
      </VStack>

      <FlatList
        data={schools as School[]}
        keyExtractor={(item) => (item as School).id}
        contentContainerStyle={{
          padding: 16,
          paddingTop: 0,
          paddingBottom: 100,
        }}
        renderItem={({ item }) => {
          const school = item as School;

          return (
            <SchoolCard
              school={school}
              onPress={() =>
                router.push({
                  pathname: ROUTES.SCHOOLS.DETAIL_PATHNAME,
                  params: { id: school.id },
                })
              }
            />
          );
        }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchSchools} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              title={EMPTY_STATE_MESSAGES.HOME_NO_SCHOOLS.TITLE}
              description={EMPTY_STATE_MESSAGES.HOME_NO_SCHOOLS.DESCRIPTION}
            />
          ) : null
        }
      />

      <Fab
        size="lg"
        placement="bottom right"
        onPress={() => router.push(ROUTES.SCHOOLS.UPSERT_PATHNAME)}
        bg="$primary500"
        shadowColor="$primary500"
        shadowOffset={{ width: 0, height: 8 }}
        shadowOpacity={0.3}
        shadowRadius={24}
        elevation={8}
        mr="$4"
      >
        <FabIcon as={AddIcon} />
      </Fab>
    </Box>
  );
}
