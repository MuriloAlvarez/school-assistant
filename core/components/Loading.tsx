import React from 'react';
import { Spinner, Center } from '@gluestack-ui/themed';

export const Loading: React.FC = () => {
  return (
    <Center flex={1}>
      <Spinner size="large" color="$primary500" />
    </Center>
  );
};
