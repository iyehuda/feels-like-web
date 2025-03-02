import useAppVersion from "../hooks/useAppVersion";
import { Chip, CircularProgress } from "@mui/material";

function HelloWorldVersion() {
  const { version, error, isLoading } = useAppVersion();

  return (
    <>
      {isLoading && <CircularProgress size="2rem" />}
      {error && <p>Error: {error.message}</p>}
      {version && <Chip label={`Feels Like ${version}`} />}
    </>
  );
}

export default HelloWorldVersion;
