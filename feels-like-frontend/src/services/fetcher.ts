import axios, { AxiosError } from "axios";
import { getStoredAuthInfo } from "../storage/auth";
import { API_CONFIG } from "../config/api";

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
});
const fetcher = async (url: string) => apiClient.get(url).then((res) => res.data);

apiClient.interceptors.request.use((config) => {
  const authInfo = getStoredAuthInfo();
  if (authInfo.accessToken) {
    config.headers.Authorization = `Bearer ${authInfo.accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
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
