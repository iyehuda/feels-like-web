import useSWR from "swr";
import fetcher from "../services/fetcher";
import { AxiosError } from "axios";

export interface User {
  avatar: string;
  email: string;
  fullName: string;
  id: string;
}

export default function useUser(userId: string | undefined) {
  const {
    data: user,
    error,
    isLoading,
  } = useSWR<User, AxiosError>(userId ? `/users/${userId}` : null, fetcher);

  return {
    user,
    error,
    isLoading,
  };
}
