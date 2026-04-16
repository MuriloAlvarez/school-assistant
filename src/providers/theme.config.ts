import { createConfig } from "@gluestack-ui/themed";
import { config as defaultConfig } from "@gluestack-ui/config";

const APP_THEME_COLORS = {
  primary500: "#1B6B3A",
  secondary500: "#1351B4",
  backgroundLight50: "#F8FAFC",
  textLight900: "#1E293B",
  textLight500: "#64748B",
  borderLight200: "#E2E8F0",
  white: "#FFFFFF",
  infoLight: "#E0F2FE",
} as const;

export const appThemeColors = APP_THEME_COLORS;

export const config = createConfig({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      ...defaultConfig.tokens.colors,
      ...APP_THEME_COLORS,
    },
  },
});
