import useSWRInfinite from "swr/infinite";
import { AxiosError } from "axios";
import fetcher from "../services/fetcher";
import { Post } from "./usePost";
import { useCallback } from "react";

const PAGE_SIZE = 10;

export interface PostsResponse {
  posts: Post[];
  totalPages: number;
  currentPage: number;
}

interface UsePostsOptions {
  userId?: string;
  queryParams?: Record<string, string>;
}

export default function usePosts({ userId, queryParams = {} }: UsePostsOptions = {}) {
  const getKey = useCallback(
    (pageIndex: number, previousPageData: PostsResponse | null) => {
      if (previousPageData && previousPageData.posts.length === 0) return null;

      const params = new URLSearchParams({
        page: (pageIndex + 1).toString(),
        limit: PAGE_SIZE.toString(),
        ...(userId && { author: userId }),
        ...queryParams,
      });

      return `/posts?${params.toString()}`;
    },
    [userId, queryParams],
  );

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite<
    PostsResponse,
    AxiosError
  >(getKey, fetcher);

  const postPages = data || [];
  const posts = postPages.flatMap((page) => page.posts);
  const lastPage = postPages[postPages.length - 1];
  const currentPage = lastPage?.currentPage || 1;
  const totalPages = lastPage?.totalPages || 1;
  const hasMore = currentPage < totalPages;

  const loadMore = useCallback(() => setSize(size + 1), [setSize, size]);

  const deletePost = useCallback(
    (postId: string) => {
      mutate((currentData) => {
        if (!currentData) return currentData;

        const updatedData = currentData.map((page) => {
          const updatedPage = { ...page };
          updatedPage.posts = page.posts.filter((post) => post.id !== postId);
          return updatedPage;
        });

        return updatedData.filter((page) => page.posts.length > 0);
      }, false);
    },
    [mutate],
  );

  return {
    posts,
    error,
    isLoading: !data && !error,
    isValidating,
    hasMore,
    loadMore,
    deletePost,
  };
}
