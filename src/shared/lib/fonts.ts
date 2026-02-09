export const fonts = {
  madeOuterSans: "var(--font-made-outer-sans)",
  geistSans: "var(--font-geist-sans)",
  geistMono: "var(--font-geist-mono)",
} as const;

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

// Helper function to get font family with fallbacks
export const getFontFamily = (font: keyof typeof fonts) => fonts[font];
