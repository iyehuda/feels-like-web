import { Avatar } from "@mui/material";
import { getBackendUrl } from "../utils/api";
import { User } from "../hooks/useUser";
import { getSize, Size } from "../utils/sizes";

export type UserAvatarProps = { size?: Size; user: User };

export default function UserAvatar({ size = "medium", user }: UserAvatarProps) {
  const imageSize = getSize(size);

  return (
    <Avatar
      src={getBackendUrl(user.avatar)}
      sx={{ width: imageSize, height: imageSize, mx: 2 }}
      alt={user.fullName}
    />
  );
}
