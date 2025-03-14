import { Box, TextField, IconButton } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { EntityID } from "../utils/api";
import MyAvatar from "./MyAvatar";
import { useCallback } from "react";

export default function AddComment({ postId }: { postId: EntityID }) {
  const handleSend = useCallback(() => {
    console.log(`Sending comment for post ${postId} ...`);
  }, [postId]);

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
      />
      <IconButton color="primary" onClick={handleSend}>
        <SendOutlinedIcon />
      </IconButton>
    </Box>
  );
}
