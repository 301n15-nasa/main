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

client.connect();

app.get('/', showSavedAsteroids);

app.get('/searches', (req, res) => {
  res.status(200).render('pages/searches/new');
});

// searches route
app.post('/searches', searchAPI); 
app.post('/asteroids', saveToDatabase);


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
    res.render('pages/searches/show', {results:asteroidArray});
  }
  catch{
    //if something goes wrong, say something.
      errorHandler(`Something has gone amiss!`, req, res);
  }
}

// Showing saved asteroid from database on page load
async function showSavedAsteroids(req, res) {
  let sql = 'SELECT * FROM asteroid;';
  try {
    let result = await client.query(sql);
    res.status(200).render('pages/index', { sqlResults: result.rows });
  } catch(err) {
    errorHandler(err, req, res);
  }
};

// Saving selected asteroid into database
async function saveToDatabase(req, res) {
  const r = req.body;
  console.log(req.body)
  let sql = 'INSERT INTO asteroid (date, link, meters, feet, hazardous, kmh, mph) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;';
  try {
    let result = await client.query(sql, [r.date, r.link, r.meters, r.feet, r.hazardous, r.kmh, r.mph]);
    sql = 'SELECT * FROM asteroid WHERE id=$1;';
    let id = result.rows[0].id;
    console.log(id);
    result = await client.query(sql, [id]);
    console.log(result);
    res.status(200).redirect('/');
  } catch(err) {
    errorHandler(err, req, res);
  }
};

function Asteroid (asteroid){
  this.date = asteroid.close_approach_data[0].close_approach_date;
  this.link = asteroid.nasa_jpl_url+';old=0;orb=1;cov=0;log=0;cad=0#orb';
  this.meters = asteroid.estimated_diameter.meters.estimated_diameter_max;
  this.feet = asteroid.estimated_diameter.feet.estimated_diameter_max;
  this.hazardous = asteroid.is_potentially_hazardous_asteroid;
  this.kmh = asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour;
  this.mph = asteroid.close_approach_data[0].relative_velocity.miles_per_hour;

}

function errorHandler(error, req, res) {
  res.status(500).send(error);
  // res.render('pages/error');
}

app.listen(PORT, () => console.log(`server running up on port ${PORT}`));
