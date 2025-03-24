import { Box, Typography, TextField, Avatar, IconButton, Button, Stack } from "@mui/material";
import Card from "./Card";
import { EntityID, getBackendUrl } from "../utils/api";
import { useState, useEffect, useCallback } from "react";
import useUser from "../hooks/useUser";
import { CircularProgress } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import useSnackbar from "../hooks/useSnackbar";

interface UserProfileCardProps {
  userId: EntityID;
  onEditProfile: (data: { fullName: string; avatar?: File }) => Promise<void>;
}

export default function UserProfileCard({ userId, onEditProfile }: UserProfileCardProps) {
  const { user, isLoading, error } = useUser(userId);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { showSnackbar } = useSnackbar();

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setAvatarPreview(user.avatar ? getBackendUrl(user.avatar) : null);
    }
  }, [user]);

  const handleAvatarClick = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      }
    };
    input.click();
  }, [setAvatarFile, setAvatarPreview]);

  const handleSave = useCallback(async () => {
    try {
      await onEditProfile({
        fullName,
        avatar: avatarFile || undefined,
      });
      setIsEditing(false);
      showSnackbar("Profile updated successfully", "success");
    } catch (error) {
      console.error("Failed to update profile", error);
      showSnackbar("Failed to update profile", "error");
    }
  }, [avatarFile, fullName, onEditProfile, showSnackbar]);

  const handleCancel = useCallback(() => {
    if (user) {
      setFullName(user.fullName);
      setAvatarPreview(user.avatar ? getBackendUrl(user.avatar) : null);
      setAvatarFile(null);
    }
    setIsEditing(false);
  }, [user]);

  if (isLoading) {
    return (
      <Card title="My Profile">
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress size={40} />
        </Box>
      </Card>
    );
  }

  if (error || !user) {
    return (
      <Card title="My Profile">
        <Typography color="error">Error loading user data</Typography>
      </Card>
    );
  }

  return (
    <Card
      title="My Profile"
      action={
        isEditing
          ? undefined
          : {
              label: "Edit Profile",
              onClick: () => setIsEditing(true),
            }
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={avatarPreview || ""}
            sx={{ width: 80, height: 80, cursor: isEditing ? "pointer" : "default" }}
            onClick={isEditing ? handleAvatarClick : undefined}
            alt={user.fullName}
          >
            {!avatarPreview && <AddAPhotoIcon />}
          </Avatar>
          {isEditing && (
            <IconButton
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "background.paper",
                "&:hover": { backgroundColor: "background.paper" },
              }}
              size="small"
              onClick={handleAvatarClick}
            >
              <AddAPhotoIcon />
            </IconButton>
          )}
        </Box>

        {isEditing ? (
          <>
            <TextField
              fullWidth
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
              <Button variant="outlined" onClick={handleCancel} fullWidth>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave} fullWidth>
                Save
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Typography variant="h6">{user.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </>
        )}
      </Box>
    </Card>
  );
}
