import { Box, Typography, CircularProgress } from "@mui/material";
import { Post as PostType } from "../hooks/usePost";
import Post from "./Post";
import { AxiosError } from "axios";

interface PostFeedProps {
  posts: PostType[];
  isLoading: boolean;
  error: AxiosError | undefined;
  isValidating: boolean;
  hasMore: boolean;
  onPostDelete?: (postId: string) => void;
  ref: React.RefObject<HTMLDivElement | null>;
}

export default function PostFeed({
  posts,
  isLoading,
  error,
  isValidating,
  hasMore,
  onPostDelete,
  ref,
}: PostFeedProps) {
  return (
    <>
      {isLoading && (
        <Box display="flex" justifyContent="center" sx={{ p: "3%" }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography
          color="error"
          sx={{
            textAlign: "center",
            p: "3%",
          }}
        >
          Failed to load posts
        </Typography>
      )}

      {posts.map((post) => (
        <Post key={post.id} postId={post.id} showComments={false} onDelete={onPostDelete} />
      ))}

      <Box
        ref={ref}
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "3%",
          p: "2%",
        }}
      >
        {isValidating && <CircularProgress size="2rem" />}
        {!isValidating && hasMore && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              opacity: 0.8,
            }}
          >
            Loading more posts...
          </Typography>
        )}
        {!hasMore && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              opacity: 0.8,
            }}
          >
            No more posts to load
          </Typography>
        )}
      </Box>
    </>
  );
}
