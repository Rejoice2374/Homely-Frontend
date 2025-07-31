// color design tokens export
export const colorTokens = {
  grey: {
    0: "#FFFFFF",
    10: "#F6F6F6",
    50: "#F0F0F0",
    100: "#E0E0E0",
    200: "#C2C2C2",
    300: "#A3A3A3",
    400: "#858585",
    500: "#666666",
    600: "#4D4D4D",
    700: "#333333",
    800: "#1A1A1A",
    900: "#0A0A0A",
    1000: "#000000",
  },
  primary: {
    100: "#D0E8FF",
    200: "#A1D1FF",
    300: "#72BAFF",
    400: "#43A3FF",
    500: "#149CFF",
    600: "#0F7EBF",
    700: "#0A6180",
    800: "#054340",
    900: "#021B00",
  },
  darkBlue: {
    100: "#D0E8FF",
    200: "#A1D1FF",
    300: "#72BAFF",
    400: "#43A3FF",
    500: "#149CFF",
    600: "#0F7EBF",
    700: "#0A6180",
    800: "#054340",
    900: "#021B00",
  },
};

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colorTokens.primary[500],
            },
            secondary: {
              main: colorTokens.grey[100],
              text: colorTokens.darkBlue[300],
            },
            neutral: {
              dark: colorTokens.grey[700],
              main: colorTokens.grey[500],
              light: colorTokens.grey[100],
              text: colorTokens.darkBlue[800],
            },
            background: {
              default: colorTokens.grey[900],
              alt: colorTokens.grey[800],
            },
          }
        : {
            primary: {
              main: colorTokens.primary[500],
            },
            secondary: {
              main: colorTokens.grey[100],
              text: colorTokens.darkBlue[500],
            },
            neutral: {
              dark: colorTokens.grey[700],
              main: colorTokens.grey[500],
              light: colorTokens.grey[100],
              text: colorTokens.darkBlue[200],
            },
            background: {
              default: colorTokens.grey[0],
              alt: colorTokens.grey[10],
            },
          }),
    },
    typography: {
      fontFamily: ["Rubik", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
