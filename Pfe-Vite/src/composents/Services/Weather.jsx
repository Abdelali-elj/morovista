import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
    FaArrowLeft, FaTemperatureHigh, FaWind, FaTint,
    FaCloudSun, FaSun, FaCloudShowersHeavy, FaCloud, FaChevronDown, FaChevronUp
} from "react-icons/fa";

const MOROCCAN_CITIES = [
    { name: "Casablanca", lat: 33.5731, lon: -7.5898 },
    { name: "Rabat", lat: 34.0209, lon: -6.8416 },
    { name: "Marrakech", lat: 31.6295, lon: -7.9811 },
    { name: "Tanger", lat: 35.7595, lon: -5.8340 },
    { name: "Agadir", lat: 30.4278, lon: -9.5981 },
    { name: "Fès", lat: 34.0181, lon: -5.0078 }
];

export default function Weather() {
    const { t, i18n } = useTranslation();
    const [selectedCity, setSelectedCity] = useState(MOROCCAN_CITIES[0]);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Africa%2FCasablanca`
                );
                const data = await response.json();
                setWeather(data);
                setLoading(false);
            } catch (err) {
                console.error("Weather Fetch Error:", err);
                setLoading(false);
            }
        };

        fetchWeather();
    }, [selectedCity]);

    const getWeatherTheme = (code) => {
        if (code === 0) return "sunny";
        if (code >= 1 && code <= 3) return "partly-cloudy";
        if (code >= 45 && code <= 48) return "foggy";
        if (code >= 51 && code <= 67) return "rainy"; // Drizzle & Rain
        if (code >= 71 && code <= 77) return "snowy";
        if (code >= 80 && code <= 82) return "rainy"; // Rain showers
        if (code >= 95 && code <= 99) return "stormy"; // Thunderstorms
        return "default";
    };

    const getWeatherIcon = (code) => {
        if (code === 0) return <FaSun />;
        if (code >= 1 && code <= 3) return <FaCloudSun />;
        if (code >= 45 && code <= 48) return <FaCloud />;
        if (code >= 51) return <FaCloudShowersHeavy />;
        return <FaCloudSun />;
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(i18n.language, { weekday: 'long' });
    };

    return (
        <div className="page-container">
            <Link to="/" className="back-btn">
                <FaArrowLeft /> {t('tools.back_home')}
            </Link>

            <div className="page-header">
                <h2>{t('tools.weather_title')}</h2>
                <p className="subtitle">{t('tools.weather_subtitle')}</p>
            </div>

            {/* City Selection Tabs */}
            <div className="city-tabs">
                {MOROCCAN_CITIES.map((city) => (
                    <button
                        key={city.name}
                        className={`city-tab ${selectedCity.name === city.name ? "active" : ""}`}
                        onClick={() => {
                            setSelectedCity(city);
                            setIsExpanded(false);
                        }}
                    >
                        {city.name}
                    </button>
                ))}
            </div>

            <div className="weather-container">
                {loading ? (
                    <div className="premium-loader-container">
                        <div className="premium-loader"></div>
                        <div className="premium-loader-text">{t('weather.loading', 'Fetching Local Weather Conditions...')}</div>
                    </div>
                ) : weather ? (
                    <div className={`mega-weather-card ${getWeatherTheme(weather.current.weather_code)} ${isExpanded ? "expanded" : ""}`}>
                        <div className="main-weather-content">
                            <div className="header-info">
                                <h3>{selectedCity.name}</h3>
                                <p className="current-date">{new Date().toLocaleDateString(i18n.language, { day: 'numeric', month: 'long' })}</p>
                            </div>

                            <div className="hero-weather">
                                <div className="hero-icon">
                                    {getWeatherIcon(weather.current.weather_code)}
                                </div>
                                <div className="hero-temp">
                                    {Math.round(weather.current.temperature_2m)}°
                                </div>
                            </div>

                            <div className="vital-stats">
                                <div className="stat">
                                    <FaTemperatureHigh />
                                    <span>{t('tools.feels_like')}: {Math.round(weather.current.apparent_temperature)}°C</span>
                                </div>
                                <div className="stat">
                                    <FaTint />
                                    <span>{t('tools.humidity')}: {weather.current.relative_humidity_2m}%</span>
                                </div>
                                <div className="stat">
                                    <FaWind />
                                    <span>{t('tools.wind')}: {weather.current.wind_speed_10m} km/h</span>
                                </div>
                            </div>

                            <button
                                className="more-forecast-btn"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? <><FaChevronUp /> {t('tools.view_less')}</> : <><FaChevronDown /> {t('tools.forecast_3days')}</>}
                            </button>
                        </div>

                        {isExpanded && (
                            <div className="forecast-extension">
                                <h4>{t('tools.next_days')}</h4>
                                <div className="forecast-column">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="forecast-item">
                                            <span className="day-name">{formatDate(weather.daily.time[i])}</span>
                                            <div className="day-icon">
                                                {getWeatherIcon(weather.daily.weather_code[i])}
                                            </div>
                                            <div className="day-temps">
                                                <span className="max">{Math.round(weather.daily.temperature_2m_max[i])}°</span>
                                                <span className="min">{Math.round(weather.daily.temperature_2m_min[i])}°</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="error-card">{t('tools.loading_data')}</div>
                )}
            </div>
        </div>
    );
}

