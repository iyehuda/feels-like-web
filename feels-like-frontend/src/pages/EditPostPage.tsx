import { useState } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { updatePost } from "../services/posts";
import { mutate } from "swr";
import usePost from "../hooks/usePost";
import PostForm from "../components/PostForm";

export default function EditPostPage() {
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { post, isLoading: isLoadingPost } = usePost(postId);

  const handleSubmit = async (data: { content: string; image?: File }) => {
    if (!postId) {
      throw new Error("Invalid post ID");
    }

    setIsLoading(true);
    try {
      await updatePost(postId, data);
      // Trigger SWR cache refresh to update posts
      mutate("/posts");
      mutate(`/posts/${postId}`);
      navigate(`/posts/${postId}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPost) {
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md">
        <Typography color="error">Post not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <PostForm
        initialContent={post.content}
        initialImageUrl={post.image ? `${import.meta.env.VITE_API_URL}${post.image}` : undefined}
        onSubmit={handleSubmit}
        submitButtonText="Update Post"
        title="Edit Post"
        isLoading={isLoading}
      />
    </Container>
  );
}
