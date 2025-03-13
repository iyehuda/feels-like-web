import { ReactNode, useState } from "react";
import { AuthContext } from "./AuthContext";
import * as authService from "../services/auth";
import {
  AuthInfo,
  getStoredAuthInfo,
  emptyAuthState,
  saveAuthInfo,
  clearAuthInfo,
} from "../storage/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthInfo>(getStoredAuthInfo);
  const isAuthenticated = !!authState.accessToken;

  const setAuthInfo = (authInfo: AuthInfo) => {
    setAuthState(authInfo);
    saveAuthInfo(authInfo);
  };

  const logout = async () => {
    try {
      if (authState.refreshToken) {
        await authService.logout(authState.refreshToken!);
      }
    } catch (error) {
      console.error("Failed to logout", error);
    } finally {
      setAuthState(emptyAuthState);
      clearAuthInfo();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken: authState.accessToken,
        refreshToken: authState.refreshToken,
        userId: authState.userId,
        setAuthInfo,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
