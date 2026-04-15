import { Tabs } from "expo-router";
import { Icon } from "@gluestack-ui/themed";
import { School, Settings } from "lucide-react-native";
import { appThemeColors } from "@/core/theme/config";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: appThemeColors.secondary500,
        tabBarInactiveTintColor: appThemeColors.textLight500,
        headerStyle: { backgroundColor: appThemeColors.white },
        headerTintColor: appThemeColors.secondary500,
        headerTitleStyle: { fontWeight: "700" },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: appThemeColors.white,
          borderTopWidth: 1,
          borderTopColor: appThemeColors.borderLight200,
          height: 72,
          paddingBottom: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Escolas",
          tabBarIcon: ({ color }) => <Icon as={School} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Configurações",
          tabBarIcon: ({ color }) => <Icon as={Settings} color={color} />,
        }}
      />
    </Tabs>
  );
}
