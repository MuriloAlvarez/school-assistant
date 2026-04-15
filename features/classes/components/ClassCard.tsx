import React from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  BadgeText,
  Icon,
  Heading,
  Pressable,
} from "@gluestack-ui/themed";
import { SHIFT_LABELS } from "@/core/constants";
import { Clock, Users, User } from "lucide-react-native";
import type { SchoolClass } from "@/features/classes/types";

interface ClassCardProps {
  schoolClass: SchoolClass;
  onPress?: () => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  schoolClass,
  onPress,
}) => {
  const cardContent = (
    <Box
      p="$4"
      bg="$white"
      rounded="$lg"
      borderWidth={1}
      borderColor="$borderLight200"
      mb="$3"
    >
      <VStack space="sm">
        <HStack justifyContent="space-between" alignItems="center">
          <Heading size="sm" color="$secondary500">
            {schoolClass.name}
          </Heading>
          <Badge size="sm" variant="outline" action="muted">
            <BadgeText>{schoolClass.academicYear}</BadgeText>
          </Badge>
        </HStack>

        <HStack space="md">
          <HStack space="xs" alignItems="center">
            <Icon as={Clock} size="xs" color="$textLight500" />
            <Text size="xs" color="$textLight500">
              {SHIFT_LABELS[schoolClass.shift]}
            </Text>
          </HStack>

          {schoolClass.capacity && (
            <HStack space="xs" alignItems="center">
              <Icon as={Users} size="xs" color="$textLight500" />
              <Text size="xs" color="$textLight500">
                {schoolClass.capacity} alunos
              </Text>
            </HStack>
          )}
        </HStack>

        {schoolClass.teacherName && (
          <HStack space="xs" alignItems="center">
            <Icon as={User} size="xs" color="$textLight500" />
            <Text size="xs" color="$textLight500">
              Prof: {schoolClass.teacherName}
            </Text>
          </HStack>
        )}
      </VStack>
    </Box>
  );

  if (!onPress) {
    return cardContent;
  }

  return <Pressable onPress={onPress}>{cardContent}</Pressable>;
};
