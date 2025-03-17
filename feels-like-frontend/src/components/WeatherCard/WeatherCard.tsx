import { Box, Typography } from "@mui/material";

interface WeatherCardProps {
  temperature: string;
  condition: string;
  location: string;
  recommendedClothes: string;
}

export const WeatherCard = ({ temperature, condition, location, recommendedClothes }: WeatherCardProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        borderRadius: "1%",
        p: "3%",
        mb: "3%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: 2,
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ mb: "2%" }}>{temperature}</Typography>
        <Typography sx={{ mb: "2%" }}>{condition}</Typography>
        <Typography>{location}</Typography>
      </Box>
      <Box>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: "2%" }}>
          Recommended Clothes
        </Typography>
        <Typography>{recommendedClothes}</Typography>
      </Box>
    </Box>
  );
}; 