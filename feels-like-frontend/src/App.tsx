import { BrowserRouter } from "react-router";
import AppRoutes from "./routes";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import { theme } from "./styles/theme";
import { AuthProvider } from "./contexts/AuthProvider";
import { SnackbarProvider } from "./contexts/SnackbarProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SnackbarProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <AppRoutes />
          </ThemeProvider>
        </SnackbarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
