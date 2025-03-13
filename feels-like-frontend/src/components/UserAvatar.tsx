import { Avatar } from "@mui/material";
import { getBackendUrl } from "../utils/api";
import { User } from "../hooks/useUser";
import { getSize, Size } from "../utils/sizes";

export default function UserAvatar({ size = "medium", user }: { size?: Size; user: User }) {
  const imageSize = getSize(size);

  return (
    <Avatar
      src={getBackendUrl(user.avatar)}
      sx={{ width: imageSize, height: imageSize, mx: 2 }}
      alt={user.fullName}
    />
  );
}
