import React from 'react';
import { GluestackUIProvider, Box } from '@gluestack-ui/themed';
import { config } from './core/theme/config';
import SchoolsScreen from './app/(tabs)/index';

// Mocking the router for the preview environment
export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <Box flex={1}>
        <SchoolsScreen />
      </Box>
    </GluestackUIProvider>
  );
}
