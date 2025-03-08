import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Container,
  TextField as MUITextField,
  Button,
  Typography,
  Box,
  TextFieldProps,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import Logo from "../components/Logo";
import { useSnackbar } from "../hooks/useSnackbar";
import { useAuth } from "../hooks/useAuth";
import { signup } from "../services/auth";

function TextField(props: TextFieldProps) {
  return <MUITextField variant="outlined" margin="normal" required fullWidth {...props} />;
}

type Inputs = {
  fullName: string;
  email: string;
  password: string;
};

function SignupPage() {
  const navigate = useNavigate();
  const { setTokens } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true);
      const response = await signup(data);
      setTokens(response.accessToken, response.refreshToken);
      showSnackbar("Account created successfully!", "success");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      showSnackbar(
        error instanceof Error ? error.message : "Failed to sign up. Please try again.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Logo />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={5}
        sx={{ alignItems: "start" }}
      >
        <Typography variant="h3" gutterBottom>
          Sign Up
        </Typography>
        <Typography gutterBottom mb={4} color="textSecondary">
          Let's get you all set up so you can access your personal account
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="fullName"
            control={control}
            defaultValue=""
            rules={{ required: "Full Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Full Name"
                error={!!errors.fullName}
                helperText={errors.fullName ? errors.fullName.message : ""}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2, p: 1.5 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default SignupPage;
