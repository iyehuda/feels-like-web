import { Box, Button, Container, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import usePosts from "../hooks/usePosts";
import Post from "../components/Post";
import { useEffect, useCallback, useRef } from "react";

export default function HomePage() {
  const navigate = useNavigate();
  const { posts, error, isLoading, isValidating, hasMore, loadMore } = usePosts();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const scrollTop = scrollContainerRef.current.scrollTop;
    const containerHeight = scrollContainerRef.current.clientHeight;
    const contentHeight = scrollContainerRef.current.scrollHeight;

    console.log("Scroll Debug:", { scrollTop, containerHeight, contentHeight, hasMore, isValidating });

    if (scrollTop + containerHeight >= contentHeight - 50 && hasMore && !isValidating) {
      console.log("Triggering loadMore() automatically");
      loadMore();
    }
  }, [hasMore, isValidating, loadMore]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <Container maxWidth="md">
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

      {/* Scrollable Post Feed */}
      <Box
        ref={scrollContainerRef} // Attach ref here
        mt={4}
        sx={{
          height: "500px", // Needed to enable scrolling
          overflowY: "auto", // Enables vertical scrolling
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
          '&::-webkit-scrollbar': {
            WebkitAppearance: 'none',
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '8px',
            backgroundColor: 'gray',
          },
        }}
      >
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
        <Button onClick={loadMore}>Load More</Button>
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