import { Box, CircularProgress, Typography } from "@mui/material";
import { WeatherCard } from "./WeatherCard";
import useWeather from "../hooks/useWeather";

export function CurrentWeather() {
  const { error, loading, weatherData } = useWeather();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error.message}</Typography>
      </Box>
    );
  }

  if (!weatherData) {
    return null;
  }

  return (
    <WeatherCard
      temperature={`${Math.round(weatherData.temperature)}°C`}
      condition={weatherData.condition}
      location={weatherData.location}
      recommendedClothes={weatherData.clothingRecommendation}
    />
  );
}
