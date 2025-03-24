import { AlertColor, Snackbar, Alert } from "@mui/material";
import { ReactNode, useCallback, useState } from "react";
import { SnackbarContext } from "./SnackbarContext";

interface SnackbarProviderProps {
  children: ReactNode;
}

export default function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("info");

  const showSnackbar = useCallback(
    (message: string, severity: AlertColor) => {
      setMessage(message);
      setSeverity(severity);
      setOpen(true);
    },
    [setMessage, setSeverity, setOpen],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
