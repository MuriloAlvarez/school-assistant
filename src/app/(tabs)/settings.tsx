import React from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  ButtonText,
  Center,
  Icon,
  HStack,
} from "@gluestack-ui/themed";
import { Info } from "lucide-react-native";
import Constants from "expo-constants";

export default function SettingsScreen() {
  const appVersion = Constants.expoConfig?.version ?? "N/A";

  return (
    <Box flex={1} bg="$backgroundLight50" p="$4">
      <VStack space="xl">
        <Box bg="$white" p="$4" rounded="$lg">
          <VStack space="md">
            <HStack space="md" alignItems="center">
              <Icon as={Info} color="$primary500" />
              <Heading size="sm">Sobre o App</Heading>
            </HStack>
            <Text size="sm">EduGestor Público v{appVersion}</Text>
            <Text size="xs" color="$textLight500">
              Sistema desenvolvido para facilitar a gestão das escolas
              municipais e turmas, substituindo planilhas manuais.
            </Text>
          </VStack>
        </Box>

        <Button action="negative" variant="outline">
          <ButtonText>Sair do Sistema</ButtonText>
        </Button>
      </VStack>

      <Center mt="auto" pb="$8">
        <Text size="xs" color="$textLight400">
          Prefeitura Municipal - Secretaria de Educação
        </Text>
      </Center>
    </Box>
  );
}
