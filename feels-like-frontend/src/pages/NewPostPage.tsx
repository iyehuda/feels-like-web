import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/posts";
import { mutate } from "swr";
import PostForm from "../components/PostForm";

export default function NewPostPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: { content: string; image?: File }) => {
    await createPost(data);
    // Trigger SWR cache refresh to update posts
    mutate("/posts");
    navigate("/");
  };

  return (
    <Container maxWidth="md">
      <PostForm
        onSubmit={handleSubmit}
        submitButtonText="Post"
        title="Create a New Post"
      />
    </Container>
  );
}