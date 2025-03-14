import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { IconButton } from "@mui/material";

interface LikeButtonProps {
  isSet: boolean;
  onClick?: () => void;
}

export default function LikeButton({ isSet, onClick }: LikeButtonProps) {
  return (
    <IconButton sx={{ padding: 0 }} onClick={onClick}>
      {isSet ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
    </IconButton>
  );
}
