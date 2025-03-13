import { Box, Container } from "@mui/material";
import Logo from "../components/Logo";

export default function StandalonePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Logo size="large" />
      </Box>
      {children}
    </Container>
  );
}
