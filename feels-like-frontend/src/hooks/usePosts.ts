import useSWR from "swr";
import { AxiosError } from "axios";
import fetcher from "../services/fetcher";
import { Post } from "./usePost";

export default function usePosts() {
  const {
    data: posts,
    error,
    isLoading,
  } = useSWR<Post[], AxiosError>("/posts", fetcher);

  return {
    posts,
    error,
    isLoading,
  };
}