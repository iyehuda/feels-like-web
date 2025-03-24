import useSWR from "swr";
import { EntityID, RelativePath } from "../utils/api";
import { AxiosError } from "axios";
import fetcher from "../services/fetcher";

export interface Post {
  id: EntityID;
  author: EntityID;
  content: string;
  image: RelativePath;
  likes: number;
  createdAt: string;
}

export default function usePost(postId?: EntityID) {
  const {
    data: post,
    error,
    isLoading,
  } = useSWR<Post, AxiosError>(postId ? `/posts/${postId}` : null, fetcher);

  return {
    post,
    error,
    isLoading,
  };
}
