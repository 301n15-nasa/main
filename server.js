'use strict';
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const methodOverride = require('method-override');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');

// Middleware
app.use(methodOverride( (req, res) => {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    console.log(req.body);
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// Importing callback functions
const Callback = require(path.join(__dirname, 'modules', 'callback.js'));
const searchApi = Callback.searchApi;
const showSavedAsteroids = Callback.showSavedAsteroids;
const showAsteroidDetails = Callback.showAsteroidDetails;
const saveToDatabase = Callback.saveToDatabase;
const updateAsteroidDetails = Callback.updateAsteroidDetails;
const deleteAsteroid = Callback.deleteAsteroid;
const buildIndex = Callback.buildIndex;

// Routs
app.get('/', buildIndex);
app.get('/searches', (req, res) => {
  res.status(200).render('pages/searches/new');
});
app.post('/searches', searchApi);
app.post('/asteroids', saveToDatabase);
app.get('/asteroids/:asteroid_id', showAsteroidDetails);
app.put('/asteroids/:asteroid_id', updateAsteroidDetails);
app.delete('/asteroids/:asteroid_id', deleteAsteroid);

app.get('*', (req, res) => res.status(404).render('pages/err/error404'));

app.listen(PORT, () => console.log(`server running up on port ${PORT}`));
