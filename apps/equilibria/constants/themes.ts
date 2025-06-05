import { tokens } from "./tokens";
import { defaultThemes } from "@tamagui/themes/v4";

export type MyTheme = typeof light;
export type MyThemes = typeof themes;

const lightColors = Object.fromEntries(
  Object.entries(tokens.color).filter(([k]) => !k.endsWith("Dark"))
);
const darkColors = Object.fromEntries(
  Object.entries(tokens.color)
    .filter(([k]) => k.endsWith("Dark"))
    .map(([k, v]) => [k.replace("Dark", ""), v])
);

const light = {
  // provide light colors
  ...lightColors,

  // override with default colors if exist
  ...defaultThemes.light,
};

const dark = {
  // provide light colors
  ...darkColors,

  // override with default colors if exist
  ...defaultThemes.dark,
};

export const themes = {
  // Use default colors as base
  ...defaultThemes,

  // Provide override with extended colors
  light,
  dark,
} as const;
