import useSWR from "swr";
import fetcher from "../services/fetcher";
import { AxiosError } from "axios";

export interface UserData {
  avatar: string;
  email: string;
  fullName: string;
  id: string;
}

function useUser(userId: string | undefined) {
  const {
    data: user,
    error,
    isLoading,
  } = useSWR<UserData, AxiosError>(userId ? `/users/${userId}` : null, fetcher);

  return {
    user,
    error,
    isLoading,
  };
}

export default useUser;
