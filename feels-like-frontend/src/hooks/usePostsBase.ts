import useSWRInfinite from "swr/infinite";
import { AxiosError } from "axios";
import fetcher from "../services/fetcher";
import { Post } from "./usePost";

const PAGE_SIZE = 10;

export interface PostsResponse {
  posts: Post[];
  totalPages: number;
  currentPage: number;
}

export default function usePostsBase(queryParams: Record<string, string> = {}) {
  const getKey = (pageIndex: number, previousPageData: PostsResponse | null) => {
    if (previousPageData && previousPageData.posts.length === 0) return null;
    
    const params = new URLSearchParams({
      page: (pageIndex + 1).toString(),
      limit: PAGE_SIZE.toString(),
      ...queryParams
    });
    
    return `/posts?${params.toString()}`;
  };

  const {
    data,
    error,
    size,
    setSize,
    isValidating,
    mutate,
  } = useSWRInfinite<PostsResponse, AxiosError>(getKey, fetcher);

  // Flatten posts array (combine all pages)
  const posts = data ? data.flatMap((page) => page.posts) : [];

  // Extract pagination details from the last fetched page
  const lastPage = data ? data[data.length - 1] : null;
  const currentPage = lastPage?.currentPage || 1;
  const totalPages = lastPage?.totalPages || 1;
  const hasMore = currentPage < totalPages;

  const loadMore = () => setSize(size + 1);

  const deletePost = (postId: string) => {
    mutate(currentData => {
      if (!currentData) return currentData;
      
      const updatedData = currentData.map(page => {
        const updatedPage = { ...page };
        updatedPage.posts = page.posts.filter(post => post.id !== postId);
        return updatedPage;
      });

      // Remove empty pages
      return updatedData.filter(page => page.posts.length > 0);
    }, false);
  };

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