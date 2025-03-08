import { Button, CircularProgress } from "@mui/material";

export default function FormSubmitButton({
  content,
  isLoading,
}: {
  content: string;
  isLoading: boolean;
}) {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="primary"
      disabled={isLoading}
      sx={{ mt: 3, p: 1.5 }}
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : content}
    </Button>
  );
}
