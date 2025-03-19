import { Navigate, useParams, useNavigate } from "react-router";
import Post from "../components/Post";

export default function ViewPostPage() {
  const { id: postId } = useParams();
  const navigate = useNavigate();

  if (!postId) {
    return <Navigate to="/" replace />;
  }

  const handlePostDelete = () => {
    navigate("/", { replace: true });
  };

  return <Post postId={postId} showComments onDelete={handlePostDelete} />;
}
