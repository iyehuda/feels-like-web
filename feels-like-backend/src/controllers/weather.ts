import { Request, Response } from "express";
import { DBHandler } from "./base-controller";
import axios from "axios";
import { weatherApiKey } from "../config";

export interface WeatherResponse {
  temperature: number;
  location: string;
  condition: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
}

export default class WeatherController {
  @DBHandler
  async getCurrentWeather(req: Request, res: Response): Promise<void> {
    try {
      const { latitude, longitude } = req.query;

      if (!latitude || !longitude) {
        res.status(400).json({ error: "Latitude and longitude are required" });
        return;
      }

      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${latitude},${longitude}&aqi=no`
      );

      const weatherData = response.data;
      const current = weatherData.current;
      const location = weatherData.location;

      const weatherResponse: WeatherResponse = {
        temperature: current.temp_c,
        location: `${location.name}, ${location.country}`,
        condition: current.condition.text,
        feelsLike: current.feelslike_c,
        humidity: current.humidity,
        windSpeed: current.wind_kph,
      };

      res.json(weatherResponse);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  }
} 