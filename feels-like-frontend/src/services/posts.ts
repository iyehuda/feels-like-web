import { apiClient } from "./fetcher";

interface PostData {
  content: string;
  image?: File; // Accepts undefined instead of null
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