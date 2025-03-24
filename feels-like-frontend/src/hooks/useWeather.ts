import { AxiosError } from "axios";
import { useCallback } from "react";
import { useGeolocation } from "@uidotdev/usehooks";
import useSWR from "swr";
import fetcher from "../services/fetcher";

export interface WeatherData {
  temperature: number;
  location: string;
  condition: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  clothingRecommendation: string;
}

export default function useWeather() {
  const { latitude, longitude, loading: locationLoading, error: locationError } = useGeolocation();
  const weatherUrl = useCallback(() => {
    if (locationError || locationLoading) {
      return null;
    }

    return `/weather/current?latitude=${latitude}&longitude=${longitude}`;
  }, [latitude, longitude, locationError, locationLoading]);
  const {
    data: weatherData,
    error: weatherError,
    isLoading: weatherLoading,
  } = useSWR<WeatherData, AxiosError>(weatherUrl, fetcher);

  return {
    error: locationError || weatherError,
    loading: locationLoading || weatherLoading,
    weatherData,
  };
}
