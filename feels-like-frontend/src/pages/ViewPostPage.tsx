import { Navigate, useParams } from "react-router";
import Post from "../components/Post";

export default function ViewPostPage() {
  const { id: postId } = useParams();

  if (!postId) {
    return <Navigate to="/" replace />;
  }

  return <Post postId={postId} showComments />;
}
