import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import searchIcon from "./assets/search-removebg-preview.png";
import clearIcon from "./assets/clear-removebg-preview.png";
import cloudIcon from "./assets/cloud-removebg-preview.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/rain-removebg-preview.png";
import windIcon from "./assets/wind-removebg-preview.png";
import snowIcon from "./assets/snow-removebg-preview.png";
import humidityIcon from "./assets/humidity-removebg-preview.png";


const WeatherDetails = ({icon, temp, city, country, lat, long, humidity, wind}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Image" height="225" width="224" /> 
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="long">longitude</span>
          <span>{long}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" height="30" width="50"/>
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" height="50" width="50"/>
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">Humidity</div>
          </div>
        </div>
      </div>
    </>
  )
}

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,
}


export default function App(){
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Chennai");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [text, setText] = useState("Chennai");

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  
  let api_key = "c450a55c88e729110bb3dc258809e1bc";

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  }

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;

    try{
      let res = await fetch(url);
      let data = await res.json();
      // console.log(data); 
      if(data.cod === "404"){
        console.log("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLong(data.coord.lon); //lon not long bcse thats how longitude is named in the api

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);
    }
    catch(error){
      console.log("An error occured: ", error.message);
      setError("An error occured while fetching weather data.");
    }
    finally{
      setLoading(false);
    }
  }

  const handleCity = (e) => {
    setText(e.target.value);
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter"){
      search();
    }
  }

  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text" className="cityInput" placeholder="Search City" value={text} onChange={handleCity} onKeyDown={handleKeyDown}/>
          <div className="search-icon" onClick={() => search()}>
            <img src={searchIcon} alt="Search" height="19" width="21"/>
          </div>
        </div>

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}

        {!loading && !cityNotFound &&< WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} long={long} humidity={humidity} wind={wind}/>}


        <p className="copyright">Designed by <span>Dharshan</span>
        </p>
      </div>
    </>
  )
}