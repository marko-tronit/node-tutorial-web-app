require('dotenv').config();
const axios = require('axios').default;

const makeMapboxApiRequest = async address => {
  const accessToken = process.env.ACCESS_TOKEN;
  // const accessToken = 'marecare';

  const url = `http://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${accessToken}&limit=1`;
  // const url = `http://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?limit=1`;

  const res = await axios.get(url);

  console.log(res.data);

  if (res.data.features.length === 0) {
    // console.log(`Failed to get info for place with given address ${address}`);
    throw new Error('Failed to get info');
  }

  const lon = res.data.features[0].center[0];
  const lat = res.data.features[0].center[1];
  const placeName = res.data.features[0].place_name;

  console.log(`Coordinates for ${placeName}: lat: ${lat}, lon: ${lon}`);

  return {
    lat,
    lon,
    placeName,
  };
};

const makeWeatherApiRequest = async (lat, lon) => {
  const weatherApiKey = process.env.WEATHER_API_KEY;
  //   const lat = 44.7871;
  //   const lon = 20.4572;
  const url = `http://api.weatherstack.com/current?access_key=${weatherApiKey}&query=${lat},${lon}`;

  try {
    const res = await axios.get(url);

    if (!res.data) {
      console.log('No data returned!');
      return;
    }

    if (res.data.success === false) {
      console.log(res.data.error);
      return;
    }

    const currentWeatherConditions = res.data.current;

    console.log(currentWeatherConditions);

    return currentWeatherConditions;
  } catch (err) {
    console.log(
      `Request failed with status ${err.response.status}: ${err.resposne.statusText}`
    );
  }
};

module.exports = {
  makeWeatherApiRequest,
  makeMapboxApiRequest,
};
