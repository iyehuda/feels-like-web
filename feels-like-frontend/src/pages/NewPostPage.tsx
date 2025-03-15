import { useState, useRef, useEffect } from "react";
import { Box, Container, Paper, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useSnackbar from "../hooks/useSnackbar";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { createPost } from "../services/posts";
import { mutate } from "swr";

export default function NewPostPage() {
  const { showSnackbar } = useSnackbar();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async () => {
    if (!content.trim()) {
      showSnackbar("Post content is required!", "error");
      return;
    }

    setIsLoading(true);

    try {
      await createPost({ content, image: image || undefined }); // Ensure image is undefined, not null

      // Trigger SWR cache refresh to update posts
      mutate("/posts");

      showSnackbar("Post created successfully!", "success");
      navigate("/");
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : "Failed to create post", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper variant="outlined" sx={{ padding: "3%", borderRadius: 8, mt: "3%" }}>
        <Typography variant="h5" gutterBottom>
          Create a New Post
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
            Click to upload an image
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Posting..." : "Post"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}