'use strict';

require('dotenv').config();


const express = require('express');
const app = express();
const PORT = process.env.PORT;

app.get('/',searchAPI);

async function searchAPI(req, res){
  let current_datetime = new Date();
  let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate();
  let url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formatted_date}&end_date=${formatted_date}&api_key=${process.env.ASTEROID_KEY}`;
  try{
    //wait for the result of the API call
    let result = await superagent.get(url);
    let asteroidArray = result.near_earth_objects[formatted_date].map(asteroid => new Asteroid(asteroid));
    res.render('pages/index', {results:asteroidArray});
  }
  catch{
    //if something goes wrong, say something.
      errorHandler(`Something has gone amiss!`, req, res);
  }
}

function Asteroid (asteroid){
  this.date = asteroid.close_approach_data[0].close_approach_date;
  this.jpl_link = asteroid.nasa_jpl_url;
  this.diameter_meters = asteroid.estimated_diameter.meters.estimated_diameter_max;
  this.diameter_feet = asteroid.estimated_diameter.feet.estimated_diameter_max;
  this.potentially_hazardous = asteroid.is_potentially_hazardous_asteroid;
  this.relative_velocity_kmh = asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour;
  this.relative_velocity_mph = asteroid.close_approach_data[0].relative_velocity.miles_per_hour
}

app.listen(PORT, () => console.log(`server running up on port ${PORT}`));
