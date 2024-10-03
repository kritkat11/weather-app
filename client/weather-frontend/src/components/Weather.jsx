import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css';

function Weather() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [location, setLocation] = useState({ lat: null, lon: null });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                getWeatherByLocation(position.coords.latitude, position.coords.longitude);
            });
        }
    }, []);

    const getWeatherByLocation = async (lat, lon) => {
        try {
            // Adjust this URL according to the API you're using
            const response = await axios.get(`https://weather-app-two-mu-25.vercel.app/api/weather?lat=${lat}&lon=${lon}`);
            setWeatherData(response.data.current);
            setForecastData(filterDailyForecast(response.data.forecast.list));
        } catch (error) {
            console.error('Error fetching weather data by location:', error);
            alert('Could not fetch weather data');
        }
    };

    const handleSearch = async () => {
        if (!city) {
            alert('Please enter a city name');
            return;
        }
    
        try {
            const response = await axios.get(`https://weather-app-two-mu-25.vercel.app/api/weather?city=${city}`);
            if (response.data && response.data.current && response.data.forecast) {
                setWeatherData(response.data.current);
                setForecastData(filterDailyForecast(response.data.forecast.list));
            } else {
                alert("No weather data found for the entered city.");
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data');
        }
    };        

    const addFavorite = () => {
        if (!favorites.includes(city)) {
            setFavorites([...favorites, city]);
        }
    };

    const filterDailyForecast = (forecastList) => {
        const dailyForecast = {};
        
        forecastList.forEach((item) => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!dailyForecast[date]) {
                dailyForecast[date] = item;
            }
        });

        // Return the first five days of forecast data
        return Object.values(dailyForecast).slice(0, 5);
    };

    const getWeatherEmoji = (condition) => {
        switch (condition) {
            case 'Clear':
                return '☀️';
            case 'Clouds':
                return '☁️';
            case 'Rain':
                return '🌧️';
            case 'Snow':
                return '❄️';
            case 'Thunderstorm':
                return '⛈️';
            case 'Drizzle':
                return '🌦️';
            case 'Haze':
                return '🌫️';
            case 'Mist':
                return '🌫️';
            default:
                return '🌈'; // Default emoji for undefined conditions
        }
    };    

    return (
        <div className="weather-container">
            <div className={`current-weather ${weatherData ? weatherData.weather[0].main.toLowerCase() : ''}`}>
                <h1>{weatherData ? weatherData.name : 'Current Location'}</h1>
                {weatherData && (
                    <>
                        <h2>{Math.round(weatherData.main.temp)}°C {getWeatherEmoji(weatherData.weather[0].main)}</h2>
                        <p>{weatherData.weather[0].description}</p>
                        
                        {/* Search Input & Button */}
                        <input
                            type="text"
                            placeholder="Enter city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="city-input"
                        />
                        <button onClick={handleSearch} className="search-btn">Get Weather</button>
    
                        <button onClick={addFavorite} className="favorite-btn">Add to Favorites</button>
                    </>
                )}
            </div>
            <div className="forecast-container">
                <h3>5-Day Forecast:</h3>
                <div className="forecast-info">
                    {forecastData.map((day, index) => (
                        <div key={index} className="forecast-card">
                            <h4>{new Date(day.dt * 1000).toLocaleDateString()}</h4>
                            <p>{Math.round(day.main.temp)}°C {getWeatherEmoji(day.weather[0].main)}</p>
                            <p>{day.weather[0].description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="favorites">
                <h3>Your Favorite Cities:</h3>
                <ul>
                    {favorites.map((fav, index) => (
                        <li key={index}>{fav}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}       

export default Weather;

