import { AxiosError } from "axios";
import { EntityID } from "../utils/api";
import fetcher from "../services/fetcher";
import useSWR from "swr";

export interface PostComment {
  id: EntityID;
  author: EntityID;
  post: EntityID;
  content: string;
}

export default function usePostComments(postId?: EntityID) {
  const {
    data: comments,
    error,
    isLoading,
    mutate,
  } = useSWR<PostComment[], AxiosError>(postId ? `/comments?post=${postId}` : null, fetcher);

  return {
    comments: comments || [],
    error,
    isLoading,
    mutate,
  };
}
