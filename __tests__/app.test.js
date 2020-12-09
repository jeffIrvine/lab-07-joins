const request = require('supertest');
const app = require('../lib/app');

describe('', () => {
  it('post', async() => {
    const res = await request(app).get('/');

    expect(res.body).toEqual({ hello: 'world' });
  });
});
