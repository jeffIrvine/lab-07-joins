const express = require('express');
const Car = require('./models/Cars');
const app = express();

app.use(express.json());

app.post('/api/v1/cars', (req, res, next) => {
  Car
    .insert(req.body)
    .then(car => res.send(car))
    .catch(next);
});




module.exports = app;
