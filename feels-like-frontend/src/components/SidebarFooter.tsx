import { Box, CircularProgress, Typography } from "@mui/material";
import useAuth from "../hooks/useAuth";
import useUser from "../hooks/useUser";
import LogoutButton from "./LogoutButton";
import UserAvatar from "./UserAvatar";

export default function SidebarFooter() {
  const { userId } = useAuth();
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
        width: "-webkit-fill-available",
        mx: 1,
        my: 2,
        justifyContent: "space-between",
      }}
    >
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
      <LogoutButton />
    </Box>
  );
}
