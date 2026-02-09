import { createSystem, defaultConfig } from "@chakra-ui/react";
import { fonts } from "./fonts";

export const customTheme = createSystem({
  ...defaultConfig,
  theme: {
    ...defaultConfig.theme,
    tokens: {
      ...defaultConfig.theme?.tokens,
      fonts: {
        ...defaultConfig.theme?.tokens?.fonts,
        madeOuterSans: {
          value: fonts.madeOuterSans,
        },
      },
    },
  },
});
