const request = require('supertest');
const fs = require('fs');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');

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
});
