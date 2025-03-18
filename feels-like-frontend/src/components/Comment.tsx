import { Box, CircularProgress, Typography, IconButton } from "@mui/material";
import { PostComment } from "../hooks/usePostComments";
import useUser from "../hooks/useUser";
import UserAvatar from "./UserAvatar";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useCallback } from "react";
import useAuth from "../hooks/useAuth";
import useSnackbar from "../hooks/useSnackbar";
import { deleteComment } from "../services/comments";

interface CommentProps {
  comment: PostComment;
  onDelete?: (commentId: string) => void;
}

export default function Comment({ comment, onDelete }: CommentProps) {
  const { user, isLoading, error } = useUser(comment.author);
  const { userId } = useAuth();
  const { showSnackbar } = useSnackbar();

  const handleDelete = useCallback(async () => {
    try {
      if (!comment.id) {
        showSnackbar("Cannot delete comment: Invalid comment ID", "error");
        return;
      }
      await deleteComment(comment.id);
      onDelete?.(comment.id);
      showSnackbar("Comment deleted successfully", "success");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      showSnackbar("Failed to delete comment", "error");
    }
  }, [comment.id, onDelete, showSnackbar]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error loading user comment</Typography>;
  }

  if (!user) {
    return null;
  }

  const isAuthor = userId === comment.author;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        my: 1.5,
      }}
    >
      <UserAvatar size="small" user={user} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "action.hover",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          width: "100%",
          ml: 2,
          paddingY: 1,
          paddingX: 2,
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle2">{user.fullName}</Typography>
          {isAuthor && (
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{ color: "error.main", padding: 0.5 }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {comment.content}
        </Typography>
      </Box>
    </Box>
  );
}
