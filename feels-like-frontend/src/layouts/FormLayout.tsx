import { Typography, Box, Container } from "@mui/material";

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
