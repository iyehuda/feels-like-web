import useSWR from "swr";
import fetcher from "../services/fetcher";
import { AxiosError } from "axios";

function useGreeting() {
  const { data: greeting, error, isLoading } = useSWR<string, AxiosError>("/hello/world", fetcher);

  return {
    greeting,
    error,
    isLoading,
  };
}

export default useGreeting;
