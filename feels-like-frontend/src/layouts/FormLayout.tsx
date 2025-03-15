import { Typography, Container } from "@mui/material";

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
      <Typography variant="h3" gutterBottom>
        {title}
      </Typography>

      <Typography gutterBottom mb={1} color="textSecondary">
        {subtitle}
      </Typography>
      {children}
    </Container>
  );
}

export default FormLayout;
