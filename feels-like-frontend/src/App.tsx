import { CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import HelloWorldPage from "./pages/HelloWorldPage";
import { theme } from "./styles/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <HelloWorldPage />
    </ThemeProvider>
  );
}

export default App;
