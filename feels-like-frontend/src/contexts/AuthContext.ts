import { createContext } from "react";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  setAuthInfo: (accessToken: string, refreshToken: string, userId: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export default createContext<AuthContextType | undefined>(undefined);
