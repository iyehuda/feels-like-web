import { Box, Container, Divider, Paper, Typography, CircularProgress, IconButton } from "@mui/material";
import { EntityID } from "../utils/api";
import usePost from "../hooks/usePost";
import UserDetails from "./UserDetails";
import usePostComments from "../hooks/usePostComments";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import Comment from "./Comment";
import AddComment from "./AddComment";
import PostImage from "./PostImage";
import LikeButton from "./LikeButton";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostComment } from "../hooks/usePostComments";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import useAuth from "../hooks/useAuth";
import useSnackbar from "../hooks/useSnackbar";
import { deletePost } from "../services/posts";
import { getPostLikes } from "../services/likes";

interface PostProps {
  postId: EntityID;
  showComments?: boolean;
  onDelete?: (postId: string) => void;
}

export default function Post({ postId, showComments = false, onDelete }: PostProps) {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { post, isLoading, error } = usePost(postId);
  const [likedByMe, setLikedByMe] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
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

  useEffect(() => {
    if (post) {
      setTotalLikes(post.likes);
      fetchLikeStatus();
    }
  }, [post]);

  const fetchLikeStatus = async () => {
    try {
      const { likes, likedByMe } = await getPostLikes(postId);
      setTotalLikes(likes);
      setLikedByMe(likedByMe);
    } catch (error) {
      console.error("Failed to fetch like status:", error);
    }
  };

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

  const handleEdit = useCallback(() => {
    navigate(`/posts/${postId}/edit`);
  }, [navigate, postId]);

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

  if (isLoading || commentsLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error || commentsError) {
    console.error({ error, commentsError });
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
            <Box>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
                sx={{ color: "primary.main", padding: 0.5, mr: 0.5 }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
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
            </Box>
          )}
        </Box>
        <Divider sx={{ mt: 2 }} />
        <Box padding={3}>
          <Typography>{post.content}</Typography>
          <PostImage image={post.image} />
          <Box display={"flex"} flexDirection={"row"} padding={1}>
            <Box display={"flex"} flexDirection={"row"} sx={{ mr: 3 }}>
              <Box sx={{ mr: 1 }}>
                <LikeButton postId={postId} isSet={likedByMe} onLikeChange={setLikedByMe} />
              </Box>
              <Typography>{totalLikes} Likes</Typography>
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
