import { Box, TextField, IconButton } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { EntityID } from "../utils/api";
import MyAvatar from "./MyAvatar";
import { useCallback, useState } from "react";
import useSnackbar from "../hooks/useSnackbar";
import { commentPost } from "../services/comments";

interface AddCommentProps {
  postId: EntityID;
  onCommentAdded: (comment: string) => void;
}

export default function AddComment({ postId, onCommentAdded }: AddCommentProps) {
  const [comment, setComment] = useState("");
  const { showSnackbar } = useSnackbar();

  const handleSend = useCallback(async () => {
    try {
      await commentPost({ content: comment, post: postId });
      setComment("");
      onCommentAdded(comment);
    } catch (error) {
      console.error("Failed to send comment:", error);
      showSnackbar("Failed to send comment", "error");
    }
  }, [comment, onCommentAdded, postId, showSnackbar]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <MyAvatar size="small" />
      <TextField
        label="Write your comment..."
        fullWidth
        slotProps={{ input: { sx: { borderRadius: 8 } } }}
        value={comment}
        onChange={(e) => setComment(e.target.value.trim())}
      />
      <IconButton color="primary" onClick={handleSend} disabled={!comment}>
        <SendOutlinedIcon />
      </IconButton>
    </Box>
  );
}
