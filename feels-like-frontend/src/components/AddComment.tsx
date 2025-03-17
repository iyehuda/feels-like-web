import { Box, TextField, IconButton } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { EntityID } from "../utils/api";
import MyAvatar from "./MyAvatar";
import { useCallback, useState } from "react";
import useSnackbar from "../hooks/useSnackbar";
import { commentPost } from "../services/comments";
import { PostComment } from "../hooks/usePostComments";

interface AddCommentProps {
  postId: EntityID;
  onCommentAdded: (comment: PostComment) => void;
}

export default function AddComment({ postId, onCommentAdded }: AddCommentProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleSend = useCallback(async () => {
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newComment = await commentPost({ content: comment.trim(), post: postId });
      setComment("");
      onCommentAdded(newComment);
      showSnackbar("Comment added successfully", "success");
    } catch (error) {
      console.error("Failed to send comment:", error);
      showSnackbar("Failed to send comment", "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [comment, onCommentAdded, postId, showSnackbar, isSubmitting]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
      }}
    >
      <MyAvatar size="small" />
      <TextField
        label="Write your comment..."
        fullWidth
        multiline
        maxRows={4}
        size="small"
        disabled={isSubmitting}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />
      <IconButton 
        color="primary" 
        onClick={handleSend} 
        disabled={!comment.trim() || isSubmitting}
      >
        <SendOutlinedIcon />
      </IconButton>
    </Box>
  );
}
