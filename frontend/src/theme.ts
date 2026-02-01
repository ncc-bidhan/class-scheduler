import { createTheme, type ThemeOptions } from "@mui/material/styles";

export const getThemeOptions = (mode: "light" | "dark"): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: mode === "dark" ? "#90caf9" : "#1976d2",
    },
    secondary: {
      main: mode === "dark" ? "#f48fb1" : "#9c27b0",
    },
    background: {
      default: mode === "dark" ? "#121212" : "#f5f5f5",
      paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === "dark" ? "#1e1e1e" : "#1976d2",
        },
      },
    },
  },
});

const theme = createTheme(getThemeOptions("dark"));

export default theme;
