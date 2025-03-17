import { Box, Typography, CircularProgress } from "@mui/material";
import { Post as PostType } from "../../hooks/usePost";
import Post from "../Post";
import { forwardRef } from "react";
import { AxiosError } from "axios";

interface PostFeedProps {
  posts: PostType[];
  isLoading: boolean;
  error: AxiosError | undefined;
  isValidating: boolean;
  hasMore: boolean;
}

export const PostFeed = forwardRef<HTMLDivElement, PostFeedProps>(
  ({ posts, isLoading, error, isValidating, hasMore }, ref) => {
    return (
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "1%",
          p: "3%",
          backgroundColor: "background.paper",
          boxShadow: 1,
        }}
      >
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
              p: "3%"
            }}
          >
            Failed to load posts
          </Typography>
        )}

        {/* Posts List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "3%" }}>
          {posts.map((post) => (
            <Post key={post.id} postId={post.id} showComments={false} />
          ))}
        </Box>

        {/* Loading More Trigger */}
        <Box 
          ref={ref}
          sx={{ 
            display: "flex", 
            justifyContent: "center",
            mt: "3%",
            p: "2%"
          }}
        >
          {isValidating && <CircularProgress size="2rem" />}
          {!isValidating && hasMore && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: "text.secondary",
                opacity: 0.8
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
                opacity: 0.8
              }}
            >
              No more posts to load
            </Typography>
          )}
        </Box>
      </Box>
    );
  }
); 