const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: 'https://weather-app-k7rh.vercel.app', // Replace this with your frontend URL
    methods: ['GET', 'POST'],
    credentials: true // Add if you need to send cookies
}));

// API Key & Base URL for OpenWeatherMap
const apiKey = process.env.OPENWEATHER_API_KEY;
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

// Weather endpoint with geolocation and forecast


const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast"; // Add forecast URL

app.get("/api/weather", async (req, res) => {
    const { city, lat, lon } = req.query;
    let currentWeatherUrl, forecastWeatherUrl;

    // If city is provided, fetch both current weather and forecast
    if (city) {
        currentWeatherUrl = `${weatherUrl}?q=${city}&appid=${apiKey}&units=metric`;
        forecastWeatherUrl = `${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`;
    } 
    // If lat and lon are provided, fetch weather by geolocation
    else if (lat && lon) {
        currentWeatherUrl = `${weatherUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        forecastWeatherUrl = `${forecastUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } 
    else {
        return res.status(400).json({ message: "City or location coordinates are required" });
    }

    try {
        // Fetch current weather and forecast data
        const weatherResponse = await axios.get(currentWeatherUrl);
        const forecastResponse = await axios.get(forecastWeatherUrl);

        console.log(`Weather data for ${city || `${lat}, ${lon}`}:`, weatherResponse.data); // Log current weather
        console.log(`Forecast data for ${city || `${lat}, ${lon}`}:`, forecastResponse.data); // Log forecast data

        // Send both current weather and forecast data to the frontend
        res.json({
            current: weatherResponse.data,
            forecast: forecastResponse.data
        });
    } catch (error) {
        console.error('Error fetching weather or forecast data:', error);
        res.status(404).json({ message: "Could not fetch weather or forecast data" });
    }
});


// Simulated user database
let users = [];

// Registration endpoint
app.post("/", (req, res) => {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password || !phoneNumber) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    users.push({ name, email, password, phoneNumber });
    res.status(200).json({ message: "Registration successful" });
});

// Login endpoint
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
        message: "Login successful",
        user: { name: user.name, email: user.email },
    });
});

// Catch-all route handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 1234;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
