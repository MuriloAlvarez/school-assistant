import { Stack } from "expo-router";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { appThemeColors, config } from "@/core/theme/config";
import { useEffect } from "react";
import { worker } from "@/core/mock/browser";

export default function RootLayout() {
  useEffect(() => {
    // Start MSW in development
    if (process.env.NODE_ENV === "development") {
      worker.start({
        onUnhandledRequest: "bypass",
      });
    }
  }, []);

  return (
    <GluestackUIProvider config={config}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: appThemeColors.white },
          headerTintColor: appThemeColors.secondary500,
          headerTitleStyle: { fontWeight: "700", fontSize: 18 },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="schools/new" options={{ title: "Nova Escola" }} />
        <Stack.Screen
          name="schools/edit/[id]"
          options={{ title: "Editar Escola" }}
        />
        <Stack.Screen
          name="schools/[id]"
          options={{ title: "Detalhes da Escola" }}
        />
        <Stack.Screen name="classes/new" options={{ title: "Nova Turma" }} />
        <Stack.Screen
          name="classes/[id]"
          options={{ title: "Detalhes da Turma" }}
        />
        <Stack.Screen
          name="classes/edit/[id]"
          options={{ title: "Editar Turma" }}
        />
      </Stack>
    </GluestackUIProvider>
  );
}
