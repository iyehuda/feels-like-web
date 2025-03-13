import { Outlet } from "react-router";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./styles/theme";
import SnackbarProvider from "./contexts/SnackbarProvider";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import type { Branding, Navigation } from "@toolpad/core";
import Logo from "./components/Logo";
import AuthProvider from "./contexts/AuthProvider";

const NAVIGATION: Navigation = [
  {
    title: "Home",
    icon: <HomeIcon />,
  },
  {
    segment: "profile",
    title: "My Profile",
    icon: <AccountCircle />,
  },
];

const BRANDING: Branding = {
  title: "",
  logo: <Logo />,
};

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <AuthProvider>
        <SnackbarProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <Outlet />
          </ThemeProvider>
        </SnackbarProvider>
      </AuthProvider>
    </ReactRouterAppProvider>
  );
}
