import { AxiosError } from "axios";
import { EntityID } from "../utils/api";
import fetcher from "../services/fetcher";
import useSWRInfinite from "swr/infinite";

export interface PostComment {
  id: EntityID;
  author: EntityID;
  post: EntityID;
  content: string;
}

interface MongoComment {
  id: EntityID;
  author: EntityID;
  post: EntityID;
  content: string;
}

interface MongoCommentsResponse {
  items: MongoComment[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface CommentsResponse {
  items: PostComment[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

const PAGE_SIZE = 10;

const transformComment = (comment: MongoComment): PostComment => ({
  id: comment.id,
  author: comment.author,
  post: comment.post,
  content: comment.content,
});

const transformResponse = (response: MongoCommentsResponse): CommentsResponse => ({
  ...response,
  items: response.items.map(transformComment),
});

export default function usePostComments(postId?: EntityID) {
  const getKey = (pageIndex: number) => {
    if (!postId) return null;
    return `/comments?post=${postId}&page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
  };

  const {
    data,
    error,
    isLoading,
    size,
    setSize,
    mutate,
  } = useSWRInfinite<MongoCommentsResponse, AxiosError>(getKey, fetcher);

  // Transform data safely
  const transformedData = data ? data.map(page => transformResponse(page)) : [];
  const comments = transformedData.flatMap(page => page.items);
  const lastPage = transformedData[transformedData.length - 1];
  const hasMore = Boolean(lastPage?.hasMore);
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const totalComments = data?.[0]?.total ?? 0;

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      setSize(size + 1);
    }
  };

  const addComment = (newComment: PostComment) => {
    if (!data || data.length === 0) {
      // If there's no data yet, create the first page
      mutate([{
        items: [{ 
          id: newComment.id,
          author: newComment.author,
          post: newComment.post,
          content: newComment.content
        }],
        total: 1,
        page: 1,
        limit: PAGE_SIZE,
        hasMore: false
      }], false);
    } else {
      // Add the new comment to the first page and update total
      mutate(currentData => {
        if (!currentData) return currentData;
        
        const updatedData = [...currentData];
        const firstPage = { ...updatedData[0] };
        firstPage.items = [{
          id: newComment.id,
          author: newComment.author,
          post: newComment.post,
          content: newComment.content
        }, ...firstPage.items];
        firstPage.total += 1;
        
        // Update hasMore if we've hit the page size limit
        if (firstPage.items.length > PAGE_SIZE) {
          firstPage.items = firstPage.items.slice(0, PAGE_SIZE);
          firstPage.hasMore = true;
        }
        
        updatedData[0] = firstPage;
        return updatedData;
      }, false);
    }
  };

  const deleteComment = (commentId: string) => {
    mutate(currentData => {
      if (!currentData) return currentData;
      
      const updatedData = currentData.map(page => {
        const updatedPage = { ...page };
        updatedPage.items = page.items.filter(item => item.id !== commentId);
        updatedPage.total -= 1;
        return updatedPage;
      });

      // Remove empty pages
      return updatedData.filter(page => page.items.length > 0);
    }, false);
  };

  return {
    comments,
    error,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    mutate,
    addComment,
    deleteComment,
    totalComments,
  };
}
