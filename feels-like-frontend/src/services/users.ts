import { apiClient } from "./fetcher";
import { EntityID } from "../utils/api";
import { User } from "../hooks/useUser";

export async function updateUser(userId: EntityID, formData: FormData): Promise<User> {
  const response = await apiClient.put<User>(`/users/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
} 