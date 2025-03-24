import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import usePosts from "../hooks/usePosts";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { CurrentWeather } from "../components/CurrentWeather";
import PostFeed from "../components/PostFeed";
import FloatingActionButton from "../components/FloatingActionButton";

export default function HomePage() {
  const navigate = useNavigate();
  const { posts, error, isLoading, isValidating, hasMore, loadMore, deletePost } = usePosts();

  const loadMoreRef = useInfiniteScroll({
    hasMore,
    isLoading: isValidating,
    onLoadMore: loadMore,
  });

  return (
    <Container
      maxWidth="md"
      sx={{
        width: "100%",
        height: "100%",
        py: "2%",
      }}
    >
      <CurrentWeather />

      <PostFeed
        ref={loadMoreRef}
        posts={posts}
        isLoading={isLoading}
        error={error}
        isValidating={isValidating}
        hasMore={hasMore}
        onPostDelete={deletePost}
      />

      <FloatingActionButton onClick={() => navigate("/new-post")}>
        Add New Post +
      </FloatingActionButton>
    </Container>
  );
}
