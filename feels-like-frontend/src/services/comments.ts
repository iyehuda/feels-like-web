import { EntityID } from "../utils/api";
import { apiClient } from "./fetcher";

interface CommentData {
  content: string;
  post: EntityID;
}

export async function commentPost(comment: CommentData): Promise<void> {
  await apiClient.post("/comments", comment);
}
