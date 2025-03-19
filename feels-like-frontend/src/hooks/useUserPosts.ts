import usePostsBase from "./usePostsBase";

export default function useUserPosts(userId: string) {
  return usePostsBase({ author: userId });
} 