import { Navigate, useParams, useNavigate } from "react-router";
import Post from "../components/Post";
import { useCallback } from "react";

export default function ViewPostPage() {
  const { id: postId } = useParams();
  const navigate = useNavigate();

  const handlePostDelete = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  if (!postId) {
    return <Navigate to="/" replace />;
  }

  return <Post postId={postId} showComments onDelete={handlePostDelete} />;
}
