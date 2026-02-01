import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider } from "@mui/material/styles";
import { store } from "./store";
import { ThemeModeProvider } from "./contexts/ThemeContext";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeModeProvider>
          <CssBaseline />
          <App />
        </ThemeModeProvider>
      </StyledEngineProvider>
    </Provider>
  </StrictMode>,
);
