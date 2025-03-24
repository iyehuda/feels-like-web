import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { IconButton } from "@mui/material";
import { EntityID } from "../utils/api";
import { likePost, unlikePost } from "../services/likes";
import useSnackbar from "../hooks/useSnackbar";
import { useCallback } from "react";
import { mutate } from "swr";

interface LikeButtonProps {
  postId: EntityID;
  isSet: boolean;
  onLikeChange?: (liked: boolean) => void;
}

export default function LikeButton({ postId, isSet, onLikeChange }: LikeButtonProps) {
  const { showSnackbar } = useSnackbar();

  const handleClick = useCallback(async () => {
    try {
      if (isSet) {
        await unlikePost(postId);
        showSnackbar("Post unliked", "success");
      } else {
        await likePost(postId);
        showSnackbar("Post liked", "success");
      }

      // Revalidate the post data
      await mutate(`/posts/${postId}`);
      onLikeChange?.(!isSet);
    } catch (error) {
      console.error("Failed to update like status:", error);
      showSnackbar("Failed to update like status", "error");
    }
  }, [isSet, onLikeChange, postId, showSnackbar]);

  return (
    <IconButton sx={{ padding: 0 }} onClick={handleClick}>
      {isSet ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
    </IconButton>
  );
}
