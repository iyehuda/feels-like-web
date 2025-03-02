import useGreeting from "../hooks/useGreeting";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";

function HelloWorldGreeting() {
  const { greeting, error, isLoading } = useGreeting();

  return (
    <>
      {isLoading && <CircularProgress />}
      {error && <p>Error: {error.message}</p>}
      {greeting && (
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          The server says: <code>{greeting}</code>
        </Typography>
      )}
    </>
  );
}

export default HelloWorldGreeting;
