import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSnackbar } from "../hooks/useSnackbar";
import { useAuth } from "../hooks/useAuth";
import { signup } from "../services/auth";
import FormLayout from "../components/FormLayout";
import FormFooter from "../components/FormFooter";
import FormTextField from "../components/FormTextField";
import FormSubmitButton from "../components/FormSubmitButton";
import { Box, Typography, Avatar } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

type SignupInputs = {
  fullName: string;
  email: string;
  password: string;
  avatar: FileList;
};

function SignupPage() {
  const navigate = useNavigate();
  const { setAuthInfo } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<SignupInputs>();

  const avatarInput = watch("avatar");

  useEffect(() => {
    const file = avatarInput?.item(0);
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showSnackbar("Please upload an image file", "error");
      return;
    }

    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      showSnackbar("Image must be smaller than 5MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [avatarInput, showSnackbar]);

  const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    try {
      setIsLoading(true);

      const avatar = avatarInput?.item(0);
      if (!avatar) {
        showSnackbar("Please select an avatar image", "error");
        return;
      }

      const response = await signup({
        avatar: data.avatar[0],
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });
      setAuthInfo(response);
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
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            my: 1,
          }}
        >
          <Avatar
            src={avatarPreview || ""}
            sx={{ width: 100, height: 100, mb: 1, cursor: "pointer" }}
            onClick={() => avatarInputRef.current?.click()}
          >
            {!avatarPreview && <AddAPhotoIcon />}
          </Avatar>
          <Typography variant="caption" color={errors.avatar ? "error" : "text.secondary"}>
            {errors.avatar ? "Avatar is required" : "Click to upload profile picture"}
          </Typography>
          <Controller
            name="avatar"
            control={control}
            rules={{ required: "Avatar is required" }}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { ref, onChange, value, ...field } }) => (
              <input
                {...field}
                ref={(e) => {
                  ref(e);
                  avatarInputRef.current = e;
                }}
                type="file"
                accept="image/*"
                onChange={(e) => onChange(e.target.files)}
                style={{ display: "none" }}
              />
            )}
          />
        </Box>

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
