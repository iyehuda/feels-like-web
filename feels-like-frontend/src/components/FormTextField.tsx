import { TextField, TextFieldProps } from "@mui/material";

export default function FormTextField(props: TextFieldProps) {
  return <TextField variant="outlined" margin="normal" required fullWidth {...props} />;
}
