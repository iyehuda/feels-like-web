import { ReactNode, useCallback, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import * as authService from "../services/auth";
import {
  AuthInfo,
  clearStoredAuthInfo,
  getStoredAuthInfo,
  isAuthenticated,
  setStoredAuthInfo,
} from "../storage/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthInfo>(getStoredAuthInfo);

  const reloadAuthInfo = useCallback(() => {
    setAuthState(getStoredAuthInfo());
  }, [setAuthState]);

  useEffect(() => {
    window.addEventListener("storage", reloadAuthInfo);

    return () => {
      window.removeEventListener("storage", reloadAuthInfo);
    };
  }, [reloadAuthInfo]);

  const setAuthInfo = (authInfo: AuthInfo) => {
    setStoredAuthInfo(authInfo);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Failed to logout", error);
    } finally {
      clearStoredAuthInfo();
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
        isAuthenticated: isAuthenticated(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
