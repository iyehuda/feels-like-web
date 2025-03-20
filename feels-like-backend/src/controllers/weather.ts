import { Request, Response } from "express";
import { DBHandler } from "./base-controller";
import axios from "axios";
import { weatherApiKey, geminiApiKey } from "../config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(geminiApiKey);

export interface WeatherResponse {
  temperature: number;
  location: string;
  condition: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  clothingRecommendation: string;
}

// Fallback recommendation based on temperature and conditions
function getFallbackRecommendation(temp: number, condition: string, windSpeed: number): string {
  let baseRecommendation = "";
  
  // Temperature-based recommendations
  if (temp < 5) {
    baseRecommendation = "Heavy winter coat, scarf, gloves, and warm boots";
  } else if (temp < 10) {
    baseRecommendation = "Warm jacket, scarf, and gloves";
  } else if (temp < 15) {
    baseRecommendation = "Light jacket or sweater";
  } else if (temp < 20) {
    baseRecommendation = "T-shirt and light pants";
  } else if (temp < 25) {
    baseRecommendation = "Light, breathable clothing";
  } else {
    baseRecommendation = "Very light, breathable clothing";
  }

  // Add condition-specific recommendations
  if (condition.toLowerCase().includes("rain")) {
    baseRecommendation += " and bring an umbrella or raincoat";
  }
  if (condition.toLowerCase().includes("snow")) {
    baseRecommendation += " and wear waterproof boots";
  }
  if (windSpeed > 20) {
    baseRecommendation += " (windy conditions)";
  }

  return baseRecommendation;
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

      let clothingRecommendation: string;

      try {
        // Try to get AI recommendation using Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Based on these weather conditions (Temperature: ${current.temp_c}°C, Feels like: ${current.feelslike_c}°C, Condition: ${current.condition.text}, Humidity: ${current.humidity}%, Wind Speed: ${current.wind_kph} km/h), provide exactly 5 words for what to wear. Example format: "Wear warm jacket with scarf".`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        clothingRecommendation = response.text() || "";
      } catch (geminiError) {
        // If Gemini fails (e.g., quota exceeded), use fallback recommendation
        console.warn("Gemini API error, using fallback recommendation:", geminiError);
        clothingRecommendation = getFallbackRecommendation(
          current.temp_c,
          current.condition.text,
          current.wind_kph
        );
      }

      const weatherResponse: WeatherResponse = {
        temperature: current.temp_c,
        location: `${location.name}, ${location.country}`,
        condition: current.condition.text,
        feelsLike: current.feelslike_c,
        humidity: current.humidity,
        windSpeed: current.wind_kph,
        clothingRecommendation: clothingRecommendation || "Unable to generate clothing recommendation",
      };

      res.json(weatherResponse);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  }
} 