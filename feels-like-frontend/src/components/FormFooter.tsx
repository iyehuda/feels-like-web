import { Typography } from "@mui/material";

export default function FormFooter({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="body2" mt={2} textAlign={"center"} alignSelf={"center"}>
      {children}
    </Typography>
  );
}
