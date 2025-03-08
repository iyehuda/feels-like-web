import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSnackbar } from "../hooks/useSnackbar";
import { useAuth } from "../hooks/useAuth";
import { signup } from "../services/auth";
import FormLayout from "../components/FormLayout";
import FormFooter from "../components/FormFooter";
import FormTextField from "../components/FormTextField";
import FormSubmitButton from "../components/FormSubmitButton";

type SignupInputs = {
  fullName: string;
  email: string;
  password: string;
};

function SignupPage() {
  const navigate = useNavigate();
  const { setAuthInfo } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupInputs>();

  const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    try {
      setIsLoading(true);
      const response = await signup(data);
      setAuthInfo(response.accessToken, response.refreshToken, response.userId);
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
    <FormLayout
      title="Sign Up"
      subtitle="Let's get you all set up so you can access your personal account"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="fullName"
          control={control}
          defaultValue=""
          rules={{ required: "Full Name is required" }}
          render={({ field }) => (
            <FormTextField
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
            <FormTextField
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
            <FormTextField
              {...field}
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
            />
          )}
        />
        <FormSubmitButton content="Create Account" isLoading={isLoading} />
      </form>
      <FormFooter>
        Already have an account? <Link to="/login">Sign up</Link>{" "}
      </FormFooter>
    </FormLayout>
  );
}

export default SignupPage;
