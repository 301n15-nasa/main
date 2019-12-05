'use strict';
const express = require('express');
const app = express();
const superagent = require('superagent');
require('dotenv').config();
const pg = require('pg');
const cors = require('cors');
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.static('public')); 
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.status(200).render('pages/index');
});
// searches route
app.post('/searches', searchAPI); 

async function searchAPI(req, res){
  let url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${req.body.startdate}&end_date=${req.body.enddate}&api_key=${process.env.ASTEROID_KEY}`;
  try{
    let result = await superagent.get(url);
    let dates = Object.keys(result.body.near_earth_objects);
    let asteroidArray = [];
    dates.forEach(element => {
      let tempArr = result.body.near_earth_objects[element].map(asteroid => new Asteroid(asteroid));
      tempArr.forEach(element => asteroidArray.push(element));
    });
    res.render('pages/searches', {results:asteroidArray});
  }
  catch{
    //if something goes wrong, say something.
      errorHandler(`Something has gone amiss!`, req, res);
  }
}

function Asteroid (asteroid){
  this.date = asteroid.close_approach_data[0].close_approach_date;
  this.jpl_link = asteroid.nasa_jpl_url+';old=0;orb=1;cov=0;log=0;cad=0#orb';
  this.diameter_meters = asteroid.estimated_diameter.meters.estimated_diameter_max;
  this.diameter_feet = asteroid.estimated_diameter.feet.estimated_diameter_max;
  this.potentially_hazardous = asteroid.is_potentially_hazardous_asteroid;
  this.relative_velocity_kmh = asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour;
  this.relative_velocity_mph = asteroid.close_approach_data[0].relative_velocity.miles_per_hour;

}

function errorHandler(error, req, res) {
  res.status(500).send(error);
  // res.render('pages/error');
}

app.listen(PORT, () => console.log(`server running up on port ${PORT}`));
