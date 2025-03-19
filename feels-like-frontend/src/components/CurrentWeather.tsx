import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { WeatherCard } from "./WeatherCard";
import { apiClient } from "../services/fetcher";

interface WeatherData {
  temperature: number;
  location: string;
  condition: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
}

export function CurrentWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // First get the user's location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        // Then fetch weather data from our backend
        const { data } = await apiClient.get<WeatherData>(
          `/weather/current?latitude=${latitude}&longitude=${longitude}`
        );

        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

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
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!weatherData) {
    return null;
  }

  // Simple clothing recommendation based on temperature
  const getRecommendedClothes = (temp: number): string => {
    if (temp < 10) return "Warm jacket, scarf, and gloves";
    if (temp < 20) return "Light jacket or sweater";
    if (temp < 25) return "T-shirt and light pants";
    return "Light, breathable clothing";
  };

  return (
    <WeatherCard
      temperature={`${Math.round(weatherData.temperature)}°C`}
      condition={weatherData.condition}
      location={weatherData.location}
      recommendedClothes={getRecommendedClothes(weatherData.temperature)}
    />
  );
} 