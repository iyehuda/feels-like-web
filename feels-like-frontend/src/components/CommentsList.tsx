import { Box, CircularProgress, Typography } from "@mui/material";
import { EntityID } from "../utils/api";
import usePostComments from "../hooks/usePostComments";
import Comment from "./Comment";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

export default function CommentsList({ postId }: { postId: EntityID }) {
  const {
    comments,
    error,
    isLoading,
    isLoadingMore,
    hasMore = false,
    loadMore,
  } = usePostComments(postId);

  const loaderRef = useInfiniteScroll({
    hasMore,
    isLoading: Boolean(isLoadingMore),
    onLoadMore: loadMore,
  });

  if (error) {
    return <Typography color="error">Error loading comments</Typography>;
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={2}>
        <CircularProgress />
      </Box>
    );
  }

  if (comments.length === 0) {
    return (
      <Box textAlign="center" my={2}>
        <Typography color="text.secondary">No comments yet</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
      {hasMore && (
        <Box ref={loaderRef} display="flex" justifyContent="center" my={2}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
}
