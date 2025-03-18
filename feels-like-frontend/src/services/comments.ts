import { EntityID } from "../utils/api";
import { apiClient } from "./fetcher";
import { PostComment } from "../hooks/usePostComments";

interface CommentData {
  content: string;
  post: EntityID;
}

interface CommentResponse {
  id: EntityID;
  author: EntityID;
  post: EntityID;
  content: string;
}

export async function commentPost(comment: CommentData): Promise<PostComment> {
  const { data } = await apiClient.post<CommentResponse>("/comments", comment);
  return {
    id: data.id,
    author: data.author,
    post: data.post,
    content: data.content,
  };
}

export async function deleteComment(commentId: EntityID): Promise<void> {
  await apiClient.delete(`/comments/${commentId}`);
}
