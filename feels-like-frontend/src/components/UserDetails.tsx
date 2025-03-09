import { Box, CircularProgress, Typography, Avatar, Divider } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import useUser from "../hooks/useUser";
import { getBackendUrl } from "../utils/api";

export function UserDetails() {
  const { userId } = useAuth();
  const { user, isLoading, error } = useUser(userId);

  return isLoading ? (
    <Box display="flex" justifyContent="center" my={2}>
      <CircularProgress size={40} />
    </Box>
  ) : error ? (
    <Typography color="error">Error loading user data</Typography>
  ) : user ? (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
      <Avatar
        src={getBackendUrl(user.avatar)}
        sx={{ width: 80, height: 80, mb: 2 }}
        alt={user.fullName}
      />
      <Typography variant="h6">{user.fullName}</Typography>
      <Typography variant="body2" color="text.secondary">
        {user.email}
      </Typography>

      <Divider sx={{ width: "100%", my: 2 }} />
    </Box>
  ) : null;
}
