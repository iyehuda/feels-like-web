import { EntityID } from "../utils/api";
import { apiClient } from "./fetcher";
import { PostComment } from "../hooks/usePostComments";

interface CommentData {
  content: string;
  post: EntityID;
}

interface CommentResponse {
  _id: EntityID;
  author: EntityID;
  post: EntityID;
  content: string;
}

export async function commentPost(comment: CommentData): Promise<PostComment> {
  const { data } = await apiClient.post<CommentResponse>("/comments", comment);
  return {
    id: data._id,
    author: data.author,
    post: data.post,
    content: data.content,
  };
}
