import { createContext } from "react";
import { AlertColor } from "@mui/material";

interface SnackbarContextType {
  showSnackbar: (message: string, severity: AlertColor) => void;
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);
