"use strict";
const axios = require("axios");
require("dotenv").config();

module.exports.weather = async (event) => {
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const country = body.country;
  if (!country) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Country is required in the request body",
      }),
    };
  }

  const apiKey = process.env.API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    return {
      statusCode: 200,
      body: JSON.stringify({
        timezone: response.data.timezone,
        name: response.data.name,
        main: {
          temp: (response.data.main.temp - 273.15).toFixed(2),
          pressure: response.data.main.pressure,
        },
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error fetching data from OpenWeatherMap API",
      }),
    };
  }
};
