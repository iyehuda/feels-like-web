import { createContext } from "react";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export default createContext<AuthContextType | undefined>(undefined);
