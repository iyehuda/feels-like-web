import { Box, CircularProgress, Typography } from "@mui/material";
import useUser from "../hooks/useUser";
import UserAvatar from "./UserAvatar";
import { EntityID } from "../utils/api";

export default function UserDetails({ userId }: { userId: EntityID }) {
  const { user, isLoading, error } = useUser(userId);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={2}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error loading user data</Typography>;
  }

  if (!user) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <UserAvatar user={user} />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h6">{user.fullName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
}
