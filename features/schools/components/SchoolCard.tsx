import React from "react";
import { Box, Text, VStack, Pressable, Heading } from "@gluestack-ui/themed";
import type { School } from "../types";

interface SchoolCardProps {
  school: School;
  onPress: () => void;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ school, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <Box
        p="$4"
        bg="$white"
        rounded="$2xl"
        borderWidth={1}
        borderColor="$borderLight200"
        mb="$3"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <VStack space="xs" flex={1} mr="$2">
          <Heading size="sm" color="$textLight900">
            {school.name}
          </Heading>
          <Text size="xs" color="$textLight500" numberOfLines={1}>
            {school.address}
          </Text>
        </VStack>

        <Box bg="$infoLight" px="$3" py="$1" rounded="$full">
          <Text size="xs" fontWeight="$bold" color="$secondary500">
            {school.classCount.toString().padStart(2, "0")} Turmas
          </Text>
        </Box>
      </Box>
    </Pressable>
  );
};
