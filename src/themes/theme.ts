import { Button, defineStyle, defineStyleConfig } from "@chakra-ui/react";
// 1. Import the extendTheme function
import { extendTheme } from "@chakra-ui/react";

const brandPrimary = defineStyle({
  background: "orange.500",
  color: "white",
  fontFamily: "serif",
  fontWeight: "normal",

  // let's also provide dark mode alternatives
  _dark: {
    background: "orange.300",
    color: "orange.800",
  },
});

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: "#24cccd",
    800: "#24cccd",
    700: "#24cccd",
  },
  gray: {
    900: "rgba(255,255,255,1)",
    700: "#372f47",
    600: "#b8add2",
  },
  green: {
    900: "#24cccd",
    800: "#e8f9fa",
  },
  orange: {
    900: "linear-gradient(90deg,#fafaea,#fbffdf)",
  },
};

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({ config, colors });
