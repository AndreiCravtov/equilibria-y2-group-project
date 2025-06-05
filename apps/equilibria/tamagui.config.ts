import { defaultConfig } from "@tamagui/config/v4";
import { defaultThemes } from "@tamagui/themes/v4";
import { createTamagui } from "tamagui";
import { tokens } from "@/constants/tokens";
import { themes } from "@/constants/themes";

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  defaultTheme: "light",
  tokens,
  themes,
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
