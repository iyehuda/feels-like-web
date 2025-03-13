import { createContext } from "react";
import { AuthInfo } from "../storage/auth";

interface AuthContextType {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  userId: string | undefined;
  setAuthInfo: (authInfo: AuthInfo) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
