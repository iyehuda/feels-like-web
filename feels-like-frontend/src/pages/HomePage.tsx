import { Box, Button, Container, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import usePosts from "../hooks/usePosts";
import Post from "../components/Post";
import { useEffect, useCallback, useState } from "react";

export default function HomePage() {
  const navigate = useNavigate();
  const { posts, error, isLoading, isValidating, hasMore, loadMore } = usePosts();
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);


  useEffect(() => {
    setTimeout(() => {
      // Detecting the correct scroll container
      const detectedContainer = document.querySelector(".MuiContainer-root");
      setScrollContainer(detectedContainer as HTMLElement);

    }, 500);
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollContainer) return;

    const scrollTop = scrollContainer.scrollTop;
    const windowHeight = scrollContainer.clientHeight;
    const docHeight = scrollContainer.scrollHeight;

    console.log("Scroll Debug:", { scrollTop, windowHeight, docHeight, hasMore, isValidating });

    if (scrollTop + windowHeight >= docHeight - 100 && hasMore && !isValidating) {
      console.log("Triggering loadMore() automatically");
      loadMore();
    }
  }, [scrollContainer, hasMore, isValidating, loadMore]);

  useEffect(() => {
    if (!scrollContainer) return;

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [scrollContainer, handleScroll]);

  return (
    <Container maxWidth="md" className="scroll-container">
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
        {posts.map((post) => (
          <Post key={post.id} postId={post.id} showComments={false} />
        ))}

        {/* Loading More Indicator */}
        {isValidating && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={30} />
          </Box>
        )}
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