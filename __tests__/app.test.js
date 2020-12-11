const request = require('supertest');
const fs = require('fs');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const Car = require('../lib/models/Cars');
const Driver = require('../lib/models/Drivers');

describe('all routes for cars and drivers', () => {

  let car;
  let drivers;
  beforeEach(async() => {
    await pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    car = await Car.insert({
      make: 'Lotus',
      model: 'Exige',
      color: 'white'
    });
    drivers = await Driver.insert({
      license: 'd101',
      carId: car.id
    });
  });

  afterAll(() => {
    return pool.end();
  });

  //Car post
  it('creates a car with post', async() => {
    const res = await request(app)
      .post('/api/v1/cars')
      .send({
        make: 'Lotus',
        model: 'Exige',
        color: 'white'
      });

    expect(res.body).toEqual({
      id: '2',
      make: 'Lotus',
      model: 'Exige',
      color: 'white'
    });
  });

  //Driver post
  it('creates a driver with post', async() => {
    const res = await request(app)
      .post('/api/v1/drivers')
      .send({
        license: 'd101',
        carId: car.id
      });

    expect(res.body).toEqual({
      id: '2',
      license: 'd101',
      carId: car.id
    });
  });


  //Car findById
  it('finds a car referenced with driver by id with get',  async() => {
    const car = await Car.insert({
      make: 'Lotus',
      model: 'Exige',
      color: 'white'
    });

    const drivers = await Promise.all([
      { license: 'f101', carId: car.id },
      { license: 'd123', carId: car.id },
      { license: 'b201', carId: car.id }
    ].map(driver => Driver.insert(driver)));

    const res = await request(app)
      .get(`/api/v1/cars/${car.id}`);
      
    expect(res.body).toEqual({
      ...car,
      drivers: expect.arrayContaining(drivers)
    });
  });

  //Driver findById
  it('finds a driver referenced by id with get',  async() => {
    const res = await request(app)
      .get(`/api/v1/drivers/${drivers.id}`);
      
    expect(res.body).toEqual(drivers);
  });


  //Cars get all
  it('finds all cars with get', async() => {
    const cars = await Promise.all([
      
      {
        make: 'Lotus',
        model: 'Exige',
        color: 'white'
      },
      {
        make: 'Lotus',
        model: 'Elise',
        color: 'red'
      },
      {
        make: 'Lotus',
        model: 'Evija',
        color: 'blue'
      }
    ].map(car => Car.insert(car)));

    const res = await request(app)
      .get('/api/v1/cars');

    expect(res.body).toEqual(expect.arrayContaining(cars));
    expect(res.body).toHaveLength(cars.length + 1);
  });

  //Drivers get all
  it('finds all drivers with get', async() => {
    const drivers = await Promise.all([
      
      {
        license: 'd101',
        carId: Driver.carId
      },
      {
        license: 'f101',
        carId: Driver.carId
      },
      {
        license: 'a101',
        carId: Driver.carId
      }
    ].map(driver => Driver.insert(driver)));

    const res = await request(app)
      .get('/api/v1/drivers');

    expect(res.body).toEqual(expect.arrayContaining(drivers));
    expect(res.body).toHaveLength(drivers.length + 1);
  });

  //Car update
  it('update a car with put', async() => {
    const res = await request(app)
      .put(`/api/v1/cars/${car.id}`)
      .send({
        make: 'Lotus',
        model: 'Evija',
        color: 'black'
      });

    expect(res.body).toEqual({
      id: car.id,
      make: 'Lotus',
      model: 'Evija',
      color: 'black'
    });
  });

  //Driver update
  it('updates a driver with put', async() => {
    const res = await request(app)
      .put(`/api/v1/drivers/${drivers.id}`)
      .send({
        license: 'd101',
        carId: car.id
      });

    expect(res.body).toEqual({
      id: drivers.id,
      license: 'd101',
      carId: car.id
    });
  });


  //Car deletes
  it('deletes a car with delete', async() => {
    const car = await Car.insert({
      make: 'Lotus',
      model: 'Evija',
      color: 'white'
    });

    const res = await request(app)
      .delete(`/api/v1/cars/${car.id}`);

    expect(res.body).toEqual(car);
  });

  //Driver deletes
  it('deletes a driver with delete', async() => {
    const driver = await Driver.insert({
      license: 'd101',
      carId: car.id
    });

    const res = await request(app)
      .delete(`/api/v1/drivers/${driver.id}`);

    expect(res.body).toEqual(driver);
  });
});
