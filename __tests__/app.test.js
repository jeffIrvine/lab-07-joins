const request = require('supertest');
const fs = require('fs');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const Car = require('../lib/models/Cars');

describe('', () => {

  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('post', async() => {
    const res = await request(app)
      .post('/api/v1/cars')
      .send({
        make: 'Lotus',
        model: 'Exige',
        color: 'white'
      });

    expect(res.body).toEqual({
      id: '1',
      make: 'Lotus',
      model: 'Exige',
      color: 'white'
    });
  });

  it('finds a car by id with get',  async() => {
    const car = await Car.insert({
      make: 'Lotus',
      model: 'Exige',
      color: 'white'
    });

    const res = await request(app)
      .get(`/api/v1/cars/${car.id}`);
      
    expect(res.body).toEqual(car);
  });

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
    expect(res.body).toHaveLength(cars.length);
  });
});
