import { Box, Container, Divider, Paper, Typography, CircularProgress, IconButton } from "@mui/material";
import { EntityID } from "../utils/api";
import usePost from "../hooks/usePost";
import UserDetails from "./UserDetails";
import usePostComments from "../hooks/usePostComments";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Comment from "./Comment";
import AddComment from "./AddComment";
import PostImage from "./PostImage";
import LikeButton from "./LikeButton";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PostComment } from "../hooks/usePostComments";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import useAuth from "../hooks/useAuth";
import useSnackbar from "../hooks/useSnackbar";
import { deletePost } from "../services/posts";

interface PostProps {
  postId: EntityID;
  showComments?: boolean;
  onDelete?: (postId: string) => void;
}

export default function Post({ postId, showComments = false, onDelete }: PostProps) {
  const navigate = useNavigate();
  const { post, error: postError, isLoading: postLoading } = usePost(postId);
  const { userId } = useAuth();
  const { showSnackbar } = useSnackbar();
  const {
    comments,
    error: commentsError,
    isLoading: commentsLoading,
    addComment,
    deleteComment,
    totalComments,
    hasMore,
    isLoadingMore,
    loadMore,
  } = usePostComments(postId);

  const loaderRef = useInfiniteScroll({
    hasMore: Boolean(hasMore),
    isLoading: Boolean(isLoadingMore),
    onLoadMore: loadMore,
  });

  const handleCommentAdded = useCallback(
    (comment: PostComment) => {
      addComment(comment);
    },
    [addComment]
  );

  const handleCommentDeleted = useCallback(
    (commentId: string) => {
      deleteComment(commentId);
    },
    [deleteComment]
  );

  const handleDelete = useCallback(async () => {
    try {
      await deletePost(postId);
      onDelete?.(postId);
      showSnackbar("Post deleted successfully", "success");
    } catch (error) {
      console.error("Failed to delete post:", error);
      showSnackbar("Failed to delete post", "error");
    }
  }, [postId, onDelete, showSnackbar]);

  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on interactive elements
    if (
      (e.target as HTMLElement).closest('button') ||
      showComments // Don't navigate if we're already in the post view
    ) {
      return;
    }
    navigate(`/posts/${postId}`);
  };

  if (postLoading || commentsLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (postError || commentsError) {
    console.error({ postError, commentsError });
    return <Typography>Error loading post</Typography>;
  }

  if (!post) {
    return <Typography>Post not found</Typography>;
  }

  const isAuthor = userId === post.author;

  return (
    <Container maxWidth="md">
      <Paper 
        variant="outlined" 
        sx={{ 
          padding: 2, 
          borderRadius: 8,
          cursor: showComments ? 'default' : 'pointer',
          '&:hover': {
            backgroundColor: showComments ? 'transparent' : 'action.hover'
          }
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <UserDetails userId={post.author} />
          {isAuthor && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              sx={{ color: "error.main", padding: 0.5 }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Divider sx={{ mt: 2 }} />
        <Box padding={3}>
          <Typography>{post.content}</Typography>
          <PostImage image={post.image} />
          <Box display={"flex"} flexDirection={"row"} padding={1}>
            <Box display={"flex"} flexDirection={"row"} sx={{ mr: 3 }}>
              <Box sx={{ mr: 1 }}>
                <LikeButton postId={postId} isSet={post.likedByMe} />
              </Box>
              <Typography>{post.likes} Likes</Typography>
            </Box>
            <Box display={"flex"} flexDirection={"row"}>
              <SmsOutlinedIcon sx={{ mr: 1 }} />
              <Typography>{totalComments} Comments</Typography>
            </Box>
          </Box>
          {showComments && (
            <>
              {comments.length > 0 && <Divider sx={{ my: 2 }} />}
              <Box sx={{ maxHeight: showComments ? '400px' : 'auto', overflowY: 'auto' }}>
                {comments.map((comment) => (
                  <Comment 
                    key={comment.id} 
                    comment={comment} 
                    onDelete={handleCommentDeleted}
                  />
                ))}
                {hasMore && (
                  <Box ref={loaderRef} display="flex" justifyContent="center" my={2}>
                    <CircularProgress size={24} />
                  </Box>
                )}
              </Box>
              <Divider sx={{ my: 2 }} />
              <AddComment postId={postId} onCommentAdded={handleCommentAdded} />
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
