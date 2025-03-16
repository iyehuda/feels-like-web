import { Box, CircularProgress, Typography } from "@mui/material";
import { PostComment } from "../hooks/usePostComments";
import useUser from "../hooks/useUser";
import UserAvatar from "./UserAvatar";

export default function Comment({ comment }: { comment: PostComment }) {
  const { user, isLoading, error } = useUser(comment.author);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={2}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error loading user comment</Typography>;
  }

  if (!user) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        my: 2,
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
        }}
      >
        <Typography variant="h6">{user.fullName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {comment.content}
        </Typography>
      </Box>
    </Box>
  );
}
