// Description: This file contains the functions to get the weather information from the openweathermap api
const key = "9ae8216bea4ff853455ec69cc8c92110";

// function to get city information, lat and lon for the weather api
const getCity = async (city) => {
  const base = "https://api.openweathermap.org/geo/1.0/direct";
  const query = `?q=${city}&limit=1&type=like&appid=${key}`;
  const response = await fetch(base + query);
  const data = await response.json();
  // check if the city is found
  if (!data || !data[0] || !data[0].lat) {
    throw new Error("City not found");
  }
  return { lat: data[0].lat, lon: data[0].lon };
};

// get today weather information

const getWeather = async (lat, lon) => {
  const base = "https://api.openweathermap.org/data/2.5/weather?lat=";
  const query = `${lat}&lon=${lon}&appid=${key}`;
  const response = await fetch(base + query);
  const data = await response.json();

  return data;
};

// get forecast for the next 5 days
const getForecast = async (lat, lon) => {
  const base = "https://api.openweathermap.org/data/2.5/forecast?lat=";
  const query = `${lat}&lon=${lon}&appid=${key}`;
  const response = await fetch(base + query);
  const data = await response.json();

  return data;
};
