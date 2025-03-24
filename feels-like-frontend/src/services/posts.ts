import { apiClient } from "./fetcher";
import { EntityID } from "../utils/api";

interface PostData {
  content: string;
  image?: File;
}

export async function createPost(post: PostData): Promise<void> {
  const formData = new FormData();
  formData.append("content", post.content);
  if (post.image) {
    formData.append("image", post.image);
  }

  await apiClient.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function updatePost(postId: EntityID, post: PostData): Promise<void> {
  const formData = new FormData();
  formData.append("content", post.content);
  if (post.image) {
    formData.append("image", post.image);
  }

  await apiClient.put(`/posts/${postId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deletePost(postId: EntityID): Promise<void> {
  await apiClient.delete(`/posts/${postId}`);
}
