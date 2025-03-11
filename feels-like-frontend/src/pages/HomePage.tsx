import Card from "@mui/material/Card";
import Logo from "../components/Logo";
import { CardContent, CardHeader, Button } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import LogoutIcon from "@mui/icons-material/Logout";
import { UserDetails } from "../components/UserDetails";

function HomePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div>
      <Logo />
      <Card variant="outlined" sx={{ p: 1 }}>
        <CardHeader title="Welcome to Feels Like!" />
        <CardContent>
          <UserDetails />
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default HomePage;
