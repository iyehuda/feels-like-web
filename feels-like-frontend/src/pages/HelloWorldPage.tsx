import Card from "@mui/material/Card";
import HelloWorldGreeting from "../components/HelloWorldGreeting";
import HelloWorldVersion from "../components/HelloWorldVersion";
import Logo from "../components/Logo";
import { CardActions, CardContent, CardHeader, Divider } from "@mui/material";

function HelloWorldPage() {
  return (
    <div>
      <Logo />
      <Card variant="outlined" sx={{ p: 1 }}>
        <CardHeader title="Welcome to Feels Like!" />
        <Divider />
        <CardContent>
          <HelloWorldGreeting />
        </CardContent>
        <CardActions>
          <HelloWorldVersion />
        </CardActions>
      </Card>
    </div>
  );
}

export default HelloWorldPage;
