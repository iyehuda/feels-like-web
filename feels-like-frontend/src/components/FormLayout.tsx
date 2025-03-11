import { Typography, Box, Container } from "@mui/material";
import Logo from "./Logo";

function FormLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Container maxWidth="sm">
      <Logo />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={1}
        sx={{ alignItems: "start" }}
      >
        <Typography variant="h3" gutterBottom>
          {title}
        </Typography>

        <Typography gutterBottom mb={1} color="textSecondary">
          {subtitle}
        </Typography>
        {children}
      </Box>
    </Container>
  );
}

export default FormLayout;
