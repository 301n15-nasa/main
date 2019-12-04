'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
require('dotenv').config();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');  
app.use(express.static('public')); 
app.use(express.urlencoded({extended:true}));

app.get('/',searchAPI);

async function searchAPI(req, res){
  let current_datetime = new Date();
  let formatted_date = current_datetime.getFullYear() + "-" + ('0'+(current_datetime.getMonth() + 1)).slice(-2) + "-" + ('0'+current_datetime.getDate()).slice(-2);
  let url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formatted_date}&end_date=${formatted_date}&api_key=${process.env.ASTEROID_KEY}`;

  try{
    console.log('in the try-catch');
    let result = await superagent.get(url);
    let asteroidArray = result.body.near_earth_objects[formatted_date].map(asteroid => new Asteroid(asteroid));
    console.log(asteroidArray);
    res.render('pages/index', {results:asteroidArray});
  }
  catch{
    //if something goes wrong, say something.
      errorHandler(`Something has gone amiss!`, req, res);
  }
}

function Asteroid (asteroid){
  console.log('asteroid constructor function called');
  this.date = asteroid.close_approach_data[0].close_approach_date;
  this.jpl_link = asteroid.nasa_jpl_url;
  this.diameter_meters = asteroid.estimated_diameter.meters.estimated_diameter_max;
  this.diameter_feet = asteroid.estimated_diameter.feet.estimated_diameter_max;
  this.potentially_hazardous = asteroid.is_potentially_hazardous_asteroid;
  this.relative_velocity_kmh = asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour;
  this.relative_velocity_mph = asteroid.close_approach_data[0].relative_velocity.miles_per_hour
}

function errorHandler(error, req, res) {
  res.status(500).send(error);
  // res.render('pages/error');
}

app.listen(PORT, () => console.log(`server running up on port ${PORT}`));
