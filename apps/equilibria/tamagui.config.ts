import { createTamagui } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";
import { themes } from "@tamagui/themes";

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  theme: {
    ...defaultConfig.theme,
    color: {
      ...defaultConfig.theme.color,
      ...indigoColors, // merge indigo colors here
    },
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
