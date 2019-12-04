'use strict';

require('dotenv').config();


const express = require('express');
const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => res.send('Hello Space Invaders!'));

app.listen(PORT, () => console.log(`server running up on port ${PORT}`));
