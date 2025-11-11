const app = require('../js/server');
const request = require('supertest');


describe('API basic endpoints', () => {
  test('GET /api/genres returns 200 and array', async () => {
    const res = await request(app).get('/api/genres');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/movies returns 200 and array', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      const m = res.body[0];
      expect(m).toHaveProperty('id');
      expect(m).toHaveProperty('title');
      expect(m).toHaveProperty('watched');
      expect(m).toHaveProperty('watchlist');
    }
  });
});

describe('Movies CRUD happy path', () => {
  let createdId = null;

  test('POST /api/movies creates a movie', async () => {
    const title = `Test Movie ${Date.now()}`;
    const payload = {
      title,
      year: 2020,
      genre: 'Test',
      rating: 4,
      watched: false,
      watchlist: false
    };

    const res = await request(app).post('/api/movies').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(title);
    createdId = res.body.id;
  });

  test('PATCH /api/movies/:id/watchlist toggles watchlist', async () => {
    expect(createdId).not.toBeNull();
    const res = await request(app).patch(`/api/movies/${createdId}/watchlist`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', createdId);
    expect(typeof res.body.watchlist).toBe('boolean');
  });

  test('GET /api/movies/:id returns created movie', async () => {
    expect(createdId).not.toBeNull();
    const res = await request(app).get(`/api/movies/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', createdId);
  });

  test('DELETE /api/movies/:id deletes created movie', async () => {
    expect(createdId).not.toBeNull();
    const res = await request(app).delete(`/api/movies/${createdId}`);
    expect(res.status).toBe(204);
  });
});

