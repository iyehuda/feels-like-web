import { Box } from "@mui/material";
import LogoutButton from "./LogoutButton";
import UserDetails from "./UserDetails";
import useAuth from "../hooks/useAuth";

export default function SidebarFooter() {
  const { userId } = useAuth();

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
      {userId && <UserDetails userId={userId} />}
      <LogoutButton />
    </Box>
  );
}
