import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { useCallback } from "react";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login");
  }, [logout, navigate]);

  return (
    <IconButton onClick={handleLogout}>
      <LogoutIcon />
    </IconButton>
  );
}
