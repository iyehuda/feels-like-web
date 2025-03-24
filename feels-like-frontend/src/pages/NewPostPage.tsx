import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/posts";
import { mutate } from "swr";
import PostForm from "../components/PostForm";
import { useCallback } from "react";

export default function NewPostPage() {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: { content: string; image?: File }) => {
      await createPost(data);
      mutate("/posts");
      navigate("/");
    },
    [navigate],
  );

  return (
    <Container maxWidth="md">
      <PostForm onSubmit={handleSubmit} submitButtonText="Post" title="Create a New Post" />
    </Container>
  );
}
