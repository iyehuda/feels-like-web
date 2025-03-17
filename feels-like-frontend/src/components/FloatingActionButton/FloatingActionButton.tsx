import { Button } from "@mui/material";

interface FloatingActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const FloatingActionButton = ({ onClick, children }: FloatingActionButtonProps) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      sx={{
        position: "fixed",
        bottom: "3%",
        right: "3%",
        py: "1%",
        px: "2%",
        borderRadius: "0.5rem",
        boxShadow: 3,
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      {children}
    </Button>
  );
}; 