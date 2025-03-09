export interface AuthInfo {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  userId: string | undefined;
}

const LOCAL_STORAGE_AUTH_KEY = "auth_info";

export function emptyAuthState() {
  return {
    accessToken: undefined,
    refreshToken: undefined,
    userId: undefined,
  };
}

export function getStoredAuthInfo(): AuthInfo {
  const savedAuth = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
  if (savedAuth) {
    try {
      return JSON.parse(savedAuth);
    } catch (error) {
      console.error("Failed to parse auth info from local storage", error);
    }
  }
  return emptyAuthState();
}

export function saveAuthInfo(authInfo: AuthInfo) {
  localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(authInfo));
}

export function clearAuthInfo() {
  localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
}
