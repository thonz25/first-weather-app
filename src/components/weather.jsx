import React from "react";
import { useState, useEffect } from "react";

const WeatherApp = () => {
  const [currentWeather, setCurrentWeather] = useState({});
  const [cityName, setCityName] = useState("");
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      getWeatherByCoords(latitude, longitude);
      onloadForecast(latitude, longitude);
    });
  };

  const onloadForecast = async (latitude, longitude) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}
      `
    );

    const data = await response
      .json()

      .catch((error) => console.log(error));
    let filteredData = data.list.filter((items, index) => index % 8 === 0);
    setForecast(filteredData);
  };

  const getWeatherByCoords = async (latitude, longitude) => {
    const API_KEY = import.meta.env.VITE_API_KEY;

    const res = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
    );
    const data = await res.json().catch((error) => console.log(error));
    const day = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(data.dt * 1000);
    const options = { hour: "2-digit", minute: "2-digit" };

    const formatDate = day[date.getDay()];

    const formatTime = date.toLocaleTimeString("en-US", options);

    setCurrentWeather({
      temp: data.main.temp,
      day: formatDate,
      time: formatTime,
      minTemp: data.main.temp_min,
      maxTemp: data.main.temp_max,
      img: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      city: data.name,
      humidity: data.main.humidity,
      mainWeather: data.weather[0].main,
      feel: data.main.feels_like,
      wind: data.wind.speed,
      visibility: data.visibility,
      description: data.weather[0].description,
    });
    console.log(data.weather.main);
  };

  const getWeather = async (cityName) => {
    const API_KEY = import.meta.env.VITE_API_KEY;

    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json().catch((error) => console.log(error));
    const day = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(data.dt * 1000);
    const options = { hour: "2-digit", minute: "2-digit" };

    const formatDate = day[date.getDay()];

    const formatTime = date.toLocaleTimeString("en-US", options);

    setCurrentWeather({
      temp: data.main.temp,
      day: formatDate,
      time: formatTime,
      minTemp: data.main.temp_min,
      maxTemp: data.main.temp_max,
      img: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      city: data.name,
      humidity: data.main.humidity,
      mainWeather: data.weather[0].main,
      feel: data.main.feels_like,
      wind: data.wind.speed,
      visibility: data.visibility,
      description: data.weather[0].description,
    });
  };

  const getForecast = async (cityName) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`
    );

    const data = await response
      .json()

      .catch((error) => console.log(error));
    let filteredData = data.list.filter((items, index) => index % 8 === 0);
    setForecast(filteredData);
    console.log(forecast);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getWeather(cityName);
    getForecast(cityName);
  };

  return (
    <div className="main-container">
      {/* side box */}

      <div className="side-box">
        <form onSubmit={handleSubmit}>
          <input
            className="search-box"
            type="text"
            placeholder="Search your city"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
          />
          <input className="submit" type="submit" value="Search" />{" "}
          <div className="degrees">
            <span>°C</span>
            <span>°F</span>
          </div>
        </form>
        <p
          className="weather-type"
          style={{
            textTransform: "uppercase",
            textAlign: "center",
            marginTop: "2em",
          }}
        >
          {currentWeather.mainWeather}
        </p>
        {/* <div className="weather-img"> */}
        <img src={currentWeather.img} alt={currentWeather.description} />
        {/* </div> */}
        <p className="city-name">{currentWeather.city}</p>
        <p className="temperature">
          {currentWeather.temp}
          <sup>°C</sup>
        </p>
        <p>
          {currentWeather.day}, <span>{currentWeather.time}</span>
        </p>
      </div>
      {/* upper box */}

      <div className="upper-box">
        <div className="forecast">
          <div className="first-box">
            <div className="week">
              <span>Weekly Forecast</span>
            </div>
          </div>
          <div className="weekdays">
            {forecast.map(({ dt, main, weather }, idx) => {
              return (
                <div key={idx} className="days">
                  <p className="day-name">
                    {new Date(dt * 1000).toDateString().substring(0, 3)}
                  </p>
                  <img
                    src={`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
                    alt={weather[0].description}
                  />
                  <p className="minmax-temp">
                    {main.temp_max}
                    <sup>°C</sup>/{main.temp_min}
                    <sup>°C</sup>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* lower box */}
      <div className="lower-box">
        <span>Today's Highlights</span>
        <div className="lower-box-container">
          <div>
            <p>Min Temp</p>
            <p className="stats">
              {currentWeather.minTemp}
              <sup>°C</sup>
            </p>
          </div>
          <div>
            <p>Wind Speed</p>
            <p className="stats">
              {(currentWeather.wind * 3.6).toFixed(2)} km/hr
            </p>
          </div>
          <div>
            <p>Feels Like</p>
            <p className="stats">
              {currentWeather.feel}
              <sup>°C</sup>
            </p>
          </div>
          <div>
            <p>Max Temp</p>
            <p className="stats">
              {currentWeather.maxTemp}
              <sup>°C</sup>
            </p>
          </div>
          <div>
            <p>Visibility</p>
            <p className="stats">{currentWeather.visibility / 1000} km</p>
          </div>
          <div>
            <p>Humidity</p>
            <p className="stats">{currentWeather.humidity}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WeatherApp;
