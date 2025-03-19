import { Container } from "@mui/material";
import useUserPosts from "../hooks/useUserPosts";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { PostFeed } from "../components/PostFeed";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import UserProfileCard from "../components/UserProfileCard";
import { updateUser } from "../services/users";
import { mutate } from "swr";

export default function MyProfilePage() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { posts, error, isLoading, isValidating, hasMore, loadMore, deletePost } = useUserPosts(userId || "");
  
  const loadMoreRef = useInfiniteScroll({
    hasMore,
    isLoading: isValidating,
    onLoadMore: loadMore
  });

  const handleEditProfile = async (data: { fullName: string; avatar?: File }) => {
    if (!userId) return;
    
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }
    
    const updatedUser = await updateUser(userId, formData);
    // Revalidate the user data in the SWR cache
    await mutate(`/users/${userId}`, updatedUser, false);
  };

  return (
    <Container 
      maxWidth="md"
      sx={{
        width: "100%",
        height: "100%",
        py: "2%",
      }}
    >
      {userId && (
        <UserProfileCard userId={userId} onEditProfile={handleEditProfile} />
      )}

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
