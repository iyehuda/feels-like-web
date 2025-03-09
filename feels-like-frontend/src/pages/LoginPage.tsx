import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSnackbar } from "../hooks/useSnackbar";
import { useState } from "react";
import FormFooter from "../components/FormFooter";
import FormSubmitButton from "../components/FormSubmitButton";
import FormTextField from "../components/FormTextField";
import FormLayout from "../components/FormLayout";
import { login } from "../services/auth";

type LoginInputs = {
  email: string;
  password: string;
};

function LoginPage() {
  const { setAuthInfo } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginInputs>();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      setIsLoading(true);
      const response = await login(data.email, data.password);
      setAuthInfo(response);
      showSnackbar("Welcome!", "success");
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      showSnackbar(
        error instanceof Error ? error.message : "Login failed. Please check your credentials.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout title="Login" subtitle="Login to access your Feels Like account">
      <form onSubmit={handleSubmit(onSubmit)}>
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
            <FormTextField
              {...field}
              label="Email"
              type="email"
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
          }}
          render={({ field }) => (
            <FormTextField
              {...field}
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
            />
          )}
        />
        <FormSubmitButton content="Login" isLoading={isLoading} />
        <FormFooter>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </FormFooter>
      </form>
    </FormLayout>
  );
}

export default LoginPage;
