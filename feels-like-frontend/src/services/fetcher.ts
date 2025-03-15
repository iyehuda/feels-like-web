import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getStoredAuthInfo } from "../storage/auth";
import { API_CONFIG } from "../config/api";
import { refreshToken } from "./auth";

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
});

const fetcher = async (url: string) => apiClient.get(url).then((res) => res.data);

// Store pending requests that will be retried after token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
  config: AxiosRequestConfig;
}> = [];

// Process the queue of failed requests
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else if (token) {
      request.config.headers = {
        ...request.config.headers,
        Authorization: `Bearer ${token}`,
      };
      request.resolve(apiClient(request.config));
    }
  });

  failedQueue = [];
};

apiClient.interceptors.request.use((config) => {
  const authInfo = getStoredAuthInfo();
  if (authInfo.accessToken) {
    config.headers.Authorization = `Bearer ${authInfo.accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is unauthorized and not an auth request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth")
    ) {
      if (isRefreshing) {
        // If refreshing is in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const refreshed = await refreshToken();

        if (refreshed) {
          const { accessToken: newToken } = getStoredAuthInfo();

          // Process the queue with the new token
          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Retry the original request
          return apiClient(originalRequest);
        } else {
          // If refresh failed, process queue with error
          processQueue(new Error("Token refresh failed"));

          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError as Error);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error instanceof AxiosError && error.response) {
      const errorMessage =
        error.response.data.validation?.body?.message ?? error.response.data.message;

      if (errorMessage) {
        return Promise.reject(new Error(errorMessage));
      }
    }

    return Promise.reject(error);
  },
);

export default fetcher;
