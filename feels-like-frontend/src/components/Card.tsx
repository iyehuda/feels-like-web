import { Box, Paper, Typography, Button } from "@mui/material";
import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function Card({ title, children, action }: CardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        {action && (
          <Button
            variant="outlined"
            size="small"
            onClick={action.onClick}
            sx={{ textTransform: "none" }}
          >
            {action.label}
          </Button>
        )}
      </Box>
      {children}
    </Paper>
  );
} 