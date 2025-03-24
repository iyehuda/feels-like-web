import { Box, Typography } from "@mui/material";
import Card from "./Card";

interface WeatherCardProps {
  temperature: string;
  condition: string;
  location: string;
  recommendedClothes: string;
}

export function WeatherCard({
  temperature,
  condition,
  location,
  recommendedClothes,
}: WeatherCardProps) {
  return (
    <Card title="Current Weather">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h4">{temperature}</Typography>
        <Typography variant="h6" color="text.secondary">
          {condition}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Recommended: {recommendedClothes}
        </Typography>
      </Box>
    </Card>
  );
}
