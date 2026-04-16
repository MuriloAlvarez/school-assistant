import React from "react";
import { Box, Text, VStack, Icon } from "@gluestack-ui/themed";
import { AlertCircle } from "lucide-react-native";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: IconComponent,
}) => {
  return (
    <Box flex={1} justifyContent="center" alignItems="center" p="$8">
      <VStack space="md" alignItems="center">
        <Icon
          as={IconComponent || AlertCircle}
          size="xl"
          color="$textLight400"
        />
        <Text size="xl" fontWeight="$bold" textAlign="center">
          {title}
        </Text>
        <Text size="md" color="$textLight500" textAlign="center">
          {description}
        </Text>
      </VStack>
    </Box>
  );
};
