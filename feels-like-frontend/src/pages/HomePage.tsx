import { Box, Button, Container, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import usePosts from "../hooks/usePosts";
import Post from "../components/Post";

export default function HomePage() {
  const navigate = useNavigate();

  // Fetch all posts
  const { posts, error, isLoading } = usePosts();

  return (
    <Container maxWidth="md">
      {/* Weather & Clothing Recommendation Section */}
      <Box
        sx={{
          backgroundColor: "#1976d2",
          color: "white",
          borderRadius: "8px",
          padding: "16px",
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4">23°C</Typography>
          <Typography>Sunny</Typography>
          <Typography>Tel Aviv, Israel</Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="h6" fontWeight="bold">
            Recommended Clothes
          </Typography>
          <Typography>T-Shirt and jeans</Typography>
        </Box>
      </Box>

      {/* Post Feed */}
      <Box mt={4}>
        {isLoading && (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
        {error && <Typography color="error">Failed to load posts</Typography>}
        {posts &&
          posts.map((post) => (
            <Post key={post.id} postId={post.id} showComments={false} />
          ))}
      </Box>

      {/* Floating "Add New Post" Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/new-post")}
        sx={{
          position: "fixed",
          bottom: "2%",
          right: "2%",
          padding: "0.75rem 1.5rem",
        }}
      >
        Add New Post +
      </Button>
    </Container>
  );
}