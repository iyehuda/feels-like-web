import useSWRInfinite from "swr/infinite";
import { AxiosError } from "axios";
import fetcher from "../services/fetcher";
import { Post } from "./usePost";

const PAGE_SIZE = 1; // For debugging, set limit to 1

export default function usePosts() {
  const getKey = (pageIndex: number, previousPageData: { posts: Post[]; totalPages: number; currentPage: number } | null) => {
    if (previousPageData && previousPageData.posts.length === 0) return null; // Stop fetching when no more posts
    return `/posts?page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
  };

  const {
    data,
    error,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite<{ posts: Post[]; totalPages: number; currentPage: number }, AxiosError>(getKey, fetcher);

  // Flatten posts array (combine all pages)
  const posts = data ? data.flatMap((page) => page.posts) : [];

  // Extract pagination details from the last fetched page
  const lastPage = data ? data[data.length - 1] : null;
  const currentPage = lastPage?.currentPage || 1;
  const totalPages = lastPage?.totalPages || 1;
  const hasMore = currentPage < totalPages; // Fix: Compare currentPage, not size

  return {
    posts,
    error,
    isLoading: !data && !error,
    isValidating,
    hasMore,
    loadMore: () => {
      if (hasMore && !isValidating) {
        console.log(`Loading more posts... Current Page: ${currentPage}, Total Pages: ${totalPages}`);
        setSize(size + 1).catch((error) => console.error("Failed to load more posts:", error));
      }
    },
  };
}