import { ReactNode, useState } from "react";
import AuthContext from "./AuthContext";
import * as authService from "../services/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken"),
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken"),
  );
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId"));

  const isAuthenticated = !!accessToken;

  const setAuthInfo = (accessToken: string, refreshToken: string, userId: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userId", userId);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUserId(userId);
  };

  const logout = async () => {
    await authService.logout(refreshToken!);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setAccessToken(null);
    setRefreshToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        userId,
        setAuthInfo,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
