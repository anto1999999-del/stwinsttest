"use client";

import { IconButton } from "@chakra-ui/react";
import { LuMoon, LuSun } from "react-icons/lu";

interface ColorModeToggleProps {
  colorMode: "light" | "dark";
  toggleColorMode: () => void;
}

export function ColorModeToggle({
  colorMode,
  toggleColorMode,
}: ColorModeToggleProps) {
  return (
    <IconButton
      aria-label="Toggle color mode"
      onClick={toggleColorMode}
      variant="ghost"
      size="sm"
    >
      {colorMode === "light" ? <LuMoon /> : <LuSun />}
    </IconButton>
  );
}
