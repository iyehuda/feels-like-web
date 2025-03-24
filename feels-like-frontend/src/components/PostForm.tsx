import { useState, useRef, useEffect, useCallback } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import useSnackbar from "../hooks/useSnackbar";

interface PostFormProps {
  initialContent?: string;
  initialImageUrl?: string;
  onSubmit: (data: { content: string; image?: File }) => Promise<void>;
  submitButtonText: string;
  title: string;
  isLoading?: boolean;
}

export default function PostForm({
  initialContent = "",
  initialImageUrl,
  onSubmit,
  submitButtonText,
  title,
  isLoading = false,
}: PostFormProps) {
  const { showSnackbar } = useSnackbar();
  const [content, setContent] = useState(initialContent);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl || null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!image) return;

    if (!image.type.startsWith("image/")) {
      showSnackbar("Please upload an image file", "error");
      setImage(null);
      return;
    }

    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (image.size > maxFileSize) {
      showSnackbar("Image must be smaller than 5MB", "error");
      setImage(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(image);
  }, [image, showSnackbar]);

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) {
      showSnackbar("Post content is required!", "error");
      return;
    }

    try {
      await onSubmit({ content, image: image || undefined });
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : "Failed to submit post", "error");
    }
  }, [content, image, onSubmit, showSnackbar]);

  return (
    <Paper variant="outlined" sx={{ padding: "3%", borderRadius: 8, mt: "3%" }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>

      {/* Post Content */}
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Describe what you feel..."
        variant="outlined"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ mb: "3%" }}
      />

      {/* Image Upload */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        my="2%"
        width="100%"
      >
        <Box
          sx={{
            width: "60%",
            maxWidth: "400px",
            height: "250px",
            borderRadius: "16px",
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            cursor: "pointer",
            position: "relative",
          }}
          onClick={() => imageInputRef.current?.click()}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <AddAPhotoIcon sx={{ fontSize: 50, color: "gray" }} />
          )}
        </Box>
        <Typography variant="caption" color="text.secondary" mt={1}>
          Click to {initialImageUrl ? "upload a new image" : "upload an image"}
        </Typography>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          style={{ display: "none" }}
        />
      </Box>

      {/* Submit Button */}
      <Box display="flex" justifyContent="flex-end" mt="3%">
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Submitting..." : submitButtonText}
        </Button>
      </Box>
    </Paper>
  );
}
