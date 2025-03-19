import { EntityID } from "../utils/api";
import { apiClient } from "./fetcher";

export async function likePost(postId: EntityID) {
  const response = await apiClient.post(`/posts/${postId}/like`);
  return response.data;
}

export async function unlikePost(postId: EntityID) {
  const response = await apiClient.delete(`/posts/${postId}/unlike`);
  return response.data;
}

export async function getPostLikes(postId: EntityID) {
  const response = await apiClient.get(`/posts/${postId}/likes`);
  return response.data;
} 