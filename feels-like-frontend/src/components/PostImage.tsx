import { Box } from "@mui/material";
import { RelativePath, getBackendUrl } from "../utils/api";

export default function PostImage({ image }: { image: RelativePath }) {
  return (
    <Box display="flex" justifyContent="center" my={2}>
      <img
        src={getBackendUrl(image)}
        style={{
          width: "80%",
          maxWidth: "60vw",
        }}
      />
    </Box>
  );
}
