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

  const { data } = await apiClient.post("/auth/signup", form);

  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post("/auth/login", {
    email,
    password,
  });

  return data;
}

export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post("/auth/logout", {
    refreshToken,
  });
}
