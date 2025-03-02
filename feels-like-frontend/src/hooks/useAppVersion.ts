import useSWR from "swr";
import fetcher from "../services/fetcher";
import { AxiosError } from "axios";

function useVersion() {
  const { data: version, error, isLoading } = useSWR<string, AxiosError>("/hello/version", fetcher);

  return {
    version,
    error,
    isLoading,
  };
}

export default useVersion;
