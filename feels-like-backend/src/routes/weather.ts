import { Router } from "express";
import WeatherController from "../controllers/weather";
import { authMiddleware } from "../controllers/auth";

const router = Router();
const weatherController = new WeatherController();

/**
 * @swagger
 * /weather/current:
 *   get:
 *     summary: Get current weather for a location
 *     description: Retrieves current weather data for the specified latitude and longitude coordinates
 *     tags: [Weather]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude coordinate of the location
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude coordinate of the location
 *     responses:
 *       200:
 *         description: Weather data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 temperature:
 *                   type: number
 *                   description: Current temperature in Celsius
 *                 location:
 *                   type: string
 *                   description: Location name and country
 *                 condition:
 *                   type: string
 *                   description: Current weather condition
 *                 feelsLike:
 *                   type: number
 *                   description: Feels like temperature in Celsius
 *                 humidity:
 *                   type: number
 *                   description: Humidity percentage
 *                 windSpeed:
 *                   type: number
 *                   description: Wind speed in km/h
 *       400:
 *         description: Missing latitude or longitude parameters
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *       500:
 *         description: Server error while fetching weather data
 */
router.get("/current", authMiddleware, (req, res) => weatherController.getCurrentWeather(req, res));

export default router;
