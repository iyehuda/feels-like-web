export interface AuthInfo {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  userId: string | undefined;
}

const AUTH_STORAGE_KEY = "auth_info";

function notifyChange() {
  window.dispatchEvent(new Event("storage"));
}

function emptyAuthState() {
  return {
    accessToken: undefined,
    refreshToken: undefined,
    userId: undefined,
  };
}

export function getStoredAuthInfo(): AuthInfo {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) {
    return emptyAuthState();
  }

  try {
    return JSON.parse(stored) as AuthInfo;
  } catch (error) {
    console.error("Failed to parse auth info from local storage", error);
    return emptyAuthState();
  }
}

export function setStoredAuthInfo(authInfo: AuthInfo) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authInfo));
  notifyChange();
}

export function clearStoredAuthInfo() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  notifyChange();
}

export function isAuthenticated(): boolean {
  const { accessToken } = getStoredAuthInfo();
  return !!accessToken;
}
