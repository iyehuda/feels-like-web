import { AxiosError } from "axios";
import { apiClient } from "./fetcher";

interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export async function signup(userData: SignupData): Promise<AuthResponse> {
  const form = new FormData();

  form.append("fullName", userData.fullName);
  form.append("email", userData.email);
  form.append("password", userData.password);

  try {
    const { data, status } = await apiClient.post("/auth/signup", form);

    if (status !== 201) {
      throw new Error(data.message || "Failed to sign up");
    }

    return data;
  } catch (error) {
    let errorMessage = (error as Error)?.message ?? "Failed to sign up";

    if (error instanceof AxiosError && error.response) {
      errorMessage =
        error.response.data.validation?.body?.message ??
        error.response.data.message ??
        errorMessage;
    }

    throw new Error(errorMessage);
  }
}

export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post("/auth/logout", {
    refreshToken,
  });
}
