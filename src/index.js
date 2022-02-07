const path = require('path');
const express = require('express');
const { makeMapboxApiRequest, makeWeatherApiRequest } = require('./utils');

console.log(path.join(__dirname, '../public'));

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', async (req, res, next) => {
  res.send('Mare care suri node');
});

app.get('/help', async (req, res, next) => {
  res.send('Help page');
});

app.get('/weather', async (req, res, next) => {
  try {
    const address = req.query.address;

    if (!address) {
      res.status(400).json({
        status: 'Failed',
        message: 'Address param must be provided in query string',
      });
      return;
    }
    const { lat, lon, placeName } = await makeMapboxApiRequest(address);

    const weatherInfo = await makeWeatherApiRequest(lat, lon);

    res
      .status(200)
      .json({ placeInfo: { lat, lon, placeName }, weatherInfo })
      .end();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// Not found
app.use(async (req, res) => {
  if (!req.route) {
    res.status(404).json({ status: 'Not found', code: 404 }).end();
  }
});

// Server error
app.use(async (err, req, res, next) => {
  res
    .status(500)
    .json({
      status: 'Internal server error',
      code: 500,
      err
    })
    .end();
});

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
