import { apiClient } from "./fetcher";
import { clearStoredAuthInfo, getStoredAuthInfo, setStoredAuthInfo } from "../storage/auth";

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  avatar: File;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export async function signup(userData: SignupData): Promise<AuthResponse> {
  const form = new FormData();

  form.append("fullName", userData.fullName);
  form.append("email", userData.email);
  form.append("password", userData.password);
  form.append("avatar", userData.avatar);

  const { data } = await apiClient.post<AuthResponse>("/auth/signup", form);

  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  return data;
}

export async function continueWithGoogle(credential: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/google", {
    credential,
  });

  return data;
}

export async function logout(): Promise<void> {
  const { refreshToken } = getStoredAuthInfo();
  clearStoredAuthInfo();

  if (refreshToken) {
    await apiClient.post("/auth/logout", {
      refreshToken,
    });
  }
}

export async function refreshToken(): Promise<boolean> {
  try {
    const { refreshToken } = getStoredAuthInfo();

    if (!refreshToken) {
      return false;
    }

    const { data: auth } = await apiClient.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });

    if (auth) {
      setStoredAuthInfo(auth);
      return true;
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
  }

  return false;
}
