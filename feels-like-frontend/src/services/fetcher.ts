import axios, { AxiosError } from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3000",
});
const fetcher = async (url: string) => apiClient.get(url).then((res) => res.data);

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
