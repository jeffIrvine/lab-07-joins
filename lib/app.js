const express = require('express');
const Car = require('./models/Cars');
const Driver = require('./models/Drivers');
const app = express();

app.use(express.json());

//create 
app.post('/api/v1/cars', (req, res, next) => {
  Car
    .insert(req.body)
    .then(car => res.send(car))
    .catch(next);
});
app.post('/api/v1/drivers', (req, res, next) => {
  Driver
    .insert(req.body)
    .then(drivers => res.send(drivers))
    .catch(next);
});

//find by id
app.get('/api/v1/cars/:id', (req, res, next) => {
  Car
    .findById(req.params.id)
    .then(car => res.send(car))
    .catch(next);
});

app.get('/api/v1/drivers/:id', (req, res, next) => {
  Driver
    .findById(req.params.id)
    .then(driver => res.send(driver))
    .catch(next);
});

//get all
app.get('/api/v1/cars', (req, res, next) => {
  Car
    .find()
    .then(cars => res.send(cars))
    .catch(next);
});

app.get('/api/v1/drivers', (req, res, next) => {
  Driver
    .find()
    .then(drivers => res.send(drivers))
    .catch(next);
});

// update by id
app.put('/api/v1/cars/:id', (req, res, next) => {
  Car
    .update(req.params.id, req.body)
    .then(car => res.send(car))
    .catch(next);
});

app.put('/api/v1/drivers/:id', (req, res, next) => {
  Driver
    .find(req.params.id, req.body)
    .then(driver => res.send(driver))
    .catch(next);
});

//delete
app.delete('/api/v1/cars/:id', (req, res, next) => {
  Car
    .delete(req.params.id)
    .then(car => res.send(car))
    .catch(next);
});

app.delete('/api/v1/drivers/:id', (req, res, next) => {
  Driver
    .delete(req.params.id, req.body)
    .then(driver => res.send(driver))
    .catch(next);
});

module.exports = app;
