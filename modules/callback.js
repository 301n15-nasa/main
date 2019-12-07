'use strict';

const superagent = require('superagent');

// Connecting to DB
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => errorHandler(err, req, res) );

// Object for holding callback functions
const Callback = {};

// Constructor function 
function Asteroid (asteroid){
  this.date = asteroid.close_approach_data[0].close_approach_date;
  this.link = asteroid.nasa_jpl_url+';old=0;orb=1;cov=0;log=0;cad=0#orb';
  this.meters = Math.round(asteroid.estimated_diameter.meters.estimated_diameter_max);
  this.feet = Math.round(asteroid.estimated_diameter.feet.estimated_diameter_max);
  this.hazardous = asteroid.is_potentially_hazardous_asteroid;
  this.kmh = Math.round(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour);
  this.mph = Math.round(asteroid.close_approach_data[0].relative_velocity.miles_per_hour);
}

// NASA API call
Callback.searchApi = async function searchApi(req, res){
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
Callback.showSavedAsteroids = async function showSavedAsteroids(req, res) {
  let sql = 'SELECT * FROM asteroid;';
  try {
    let result = await client.query(sql);
    res.status(200).render('pages/index', { sqlResults: result.rows });
  } catch(err) {
    errorHandler(err, req, res);
  }
};

// Show details
Callback.showAsteroidDetails = async function showAsteroidDetails(req, res) {
  let sql = 'SELECT * FROM asteroid WHERE id=$1;';
  try {
    let result = await client.query(sql, [req.params.asteroid_id]);
    res.status(200).render('pages/asteroids/show', { asteroid: result.rows[0] });
  } catch(err) {
    errorHandler(err, req, res);
  }
};

// Saving selected asteroid into database
Callback.saveToDatabase = async function saveToDatabase(req, res) {
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
    res.status(200).redirect(`/asteroids/${result.rows[0].id}`);;
  } catch(err) {
    errorHandler(err, req, res);
  }
};

// Updating details
Callback.updateAsteroidDetails = async function updateAsteroidDetails(req, res) {
  const r = req.body;
  let sql = 'UPDATE asteroid SET date=$1, link=$2, meters=$3, feet=$4, hazardous=$5, kmh=$6, mph=$7 WHERE id=$8;';
  try {
    let result = await client.query(sql, [r.date, r.link, r.meters, r.feet, r.hazardous, r.kmh, r.mph, req.params.asteroid_id]);
    console.log(result.rows[0]);
    res.status(200).redirect(`/asteroids/${req.params.asteroid_id}`);
  } catch(err) {
    errorHandler(err, req, res);
  }
};



// Deleteing book from database
Callback.deleteAsteroid = async function deleteAsteroid(req, res) {
  let sql = 'DELETE FROM asteroid WHERE id=$1;';
  try {
    await client.query(sql, [parseInt(req.body.id)]);
    res.status(200).redirect('/');
  } catch(err) {
    errorHandler(err, req, res);
  }
};

// Error handler
function errorHandler(err, req, res) {
  res.status(500).render('pages/err/error500', {data: err});
}

// Exporting Callback object
module.exports = Callback;