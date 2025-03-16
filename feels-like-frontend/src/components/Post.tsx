import { Box, Container, Divider, Paper, Typography } from "@mui/material";
import { EntityID } from "../utils/api";
import usePost from "../hooks/usePost";
import UserDetails from "./UserDetails";
import usePostComments from "../hooks/usePostComments";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import Comment from "./Comment";
import AddComment from "./AddComment";
import PostImage from "./PostImage";
import LikeButton from "./LikeButton";
import { useCallback } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface PostProps {
  postId: EntityID;
  showComments?: boolean;
}

export default function Post({ postId, showComments = false }: PostProps) {
  const navigate = useNavigate();
  const { post, error: postError, isLoading: postLoading } = usePost(postId);
  const {
    comments,
    error: commentsError,
    isLoading: commentsLoading,
    mutate: mutateComments,
  } = usePostComments(postId);
  const { userId } = useAuth();
  const handleCommentAdded = useCallback(
    (comment: string) => {
      mutateComments([...comments, { author: userId!, content: comment, id: "new", post: postId }]);
    },
    [comments, mutateComments, postId, userId],
  );

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
        <UserDetails userId={post.author} />
        <Divider sx={{ mt: 2 }} />
        <Box padding={3}>
          <Typography>{post.content}</Typography>
          <PostImage image={post.image} />
          <Box display={"flex"} flexDirection={"row"} padding={1}>
            <Box display={"flex"} flexDirection={"row"} sx={{ mr: 3 }}>
              <Box sx={{ mr: 1 }}>
                <LikeButton isSet={post.likedByMe} />
              </Box>
              <Typography>{post.likes} Likes</Typography>
            </Box>
            <Box display={"flex"} flexDirection={"row"}>
              <SmsOutlinedIcon sx={{ mr: 1 }} />
              <Typography>{comments.length} Comments</Typography>
            </Box>
          </Box>
          {showComments && (
            <>
              {comments.length > 0 && <Divider sx={{ my: 2 }} />}
              {comments.map((comment) => (
                <Comment comment={comment} />
              ))}
              <Divider sx={{ my: 2 }} />
              <AddComment postId={postId} onCommentAdded={handleCommentAdded} />
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
