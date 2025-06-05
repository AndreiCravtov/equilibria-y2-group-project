import { createFont, createTokens } from "tamagui";
import { defaultConfig, tokens as defaultTokens } from "@tamagui/config/v4";

import { darkColorsPostfixed, light } from "./colors";

export const tokens = createTokens({
  ...defaultTokens,
  color: {
    ...light,
    ...darkColorsPostfixed,
  },
});
