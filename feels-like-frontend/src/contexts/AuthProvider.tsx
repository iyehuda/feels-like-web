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

  const isAuthenticated = !!accessToken;

  const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };

  const logout = async () => {
    await authService.logout(refreshToken!);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        setTokens,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
