import { CircularProgress } from "@mui/material";
import useAuth from "../hooks/useAuth";
import useUser from "../hooks/useUser";
import { getSize, Size } from "../utils/sizes";
import UserAvatar from "./UserAvatar";

export type MyAvatarProps = { size?: Size };

export default function MyAvatar({ size = "medium" }: MyAvatarProps) {
  const { userId } = useAuth();
  const { user, isLoading } = useUser(userId);

  if (isLoading) {
    return <CircularProgress size={getSize(size)} />;
  }

  if (!user) {
    return null;
  }

  return <UserAvatar size={size} user={user} />;
}
