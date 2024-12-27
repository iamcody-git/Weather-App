import React, { useEffect, useState } from "react";
import { FaLocationDot, FaWind } from "react-icons/fa6";
import { BiSearch } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather } from "../Redux/weatherSlice";

const Weather = () => {
  const [city, setCity] = useState(""); // State to hold user input

  const dispatch = useDispatch();
  const { weather, loading, error } = useSelector((state) => state.weather);

  // Default background
  const defaultBackgroundImage = "url(/path/to/default-image.jpg)"; // Provide a fallback image if required

  // Get weather condition and set background accordingly
  let backgroundImage = defaultBackgroundImage; // Start with default background
  const forecast = weather?.forecast;
  const weatherCondition = forecast?.current?.condition?.text?.toLowerCase() || "";

  if (weatherCondition) {
    // Check the weather condition and update the background image
    if (weatherCondition.includes("rain")) {
      backgroundImage = "url(/path/to/rain-image.jpg)";
    } else if (weatherCondition.includes("cloud")) {
      backgroundImage = "url(/path/to/cloud-image.jpg)";
    } else if (weatherCondition.includes("snow")) {
      backgroundImage = "url(/path/to/snow-image.jpg)";
    }
  }

  const forecastHours = forecast?.forecastday?.[0]?.hour?.slice(0, 5) || [];

  // Fetch default city weather on component mount
  useEffect(() => {
    dispatch(fetchWeather("Kathmandu")); // Fetch weather for default city
  }, [dispatch]);

  const handleSearch = () => {
    if (city.trim()) {
      dispatch(fetchWeather(city)); // Fetch weather for entered city
      setCity(""); // Clear input
    } else {
      alert("Please enter a city name");
    }
  };

  // Handle loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className="weather-container"
      style={{
        backgroundImage: backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="main-section">
        {/* Weather Info Section */}
        <div className="weather-info">
          <div className="location">
            <h3>
              {forecast?.location?.name} - {forecast?.location?.region}
            </h3>
          </div>
          <div className="condition">
            <h1>{forecast?.current?.condition?.text}</h1>
          </div>
        </div>

        {/* Hourly Forecast Section */}
        <div className="weather-hours">
          {forecastHours.map((hour, index) => (
            <div className="hour-card" key={index}>
              <div className="hour-time">
                <p>{hour?.time?.slice(11, 16)}</p>
              </div>
              <div className="hour-condition">
                <img src={hour?.condition?.icon} alt="icon" />
              </div>
              <div className="hour-temp">
                <h2>{Math.ceil(hour?.temp_c)}°C</h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="side-section">
        {/* Search Box */}
        <div className="search-box">
          <FaLocationDot className="icon" />
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)} // Update state on input change
          />
          <BiSearch className="icon" onClick={handleSearch} />
        </div>

        {/* Current Weather Info */}
        <div className="temp-info">
          {forecast?.current?.temp_c !== undefined ? (
            <>
              <h1>{Math.ceil(forecast?.current?.temp_c)}°C</h1>
              <p>
                <FaWind /> {forecast?.current?.wind_dir} {forecast?.current?.wind_kph} km/h
              </p>
            </>
          ) : (
            <h1>Loading...</h1> // Display a fallback message while waiting for data
          )}
        </div>

        {/* Forecast for Next Days */}
        <div className="forecast-days">
          <h1 className="forecast-heading">The Next Days Forecast</h1>
          {forecast?.forecastday?.map((item, index) => (
            <div className="forecast-item" key={index}>
              <div className="forecast-details">
                <div className="forecast-icons">
                  <img src={item.day.condition.icon} alt="icon" />
                </div>
                <div className="details">
                  <h2>{item.date}</h2>
                  <p>{item.day.condition.text}</p>
                </div>
              </div>
              <div className="forecast-temp">
                <h2>{Math.ceil(item.day.maxtemp_c)}°C</h2>
                <h2>{Math.ceil(item.day.mintemp_c)}°C</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;
