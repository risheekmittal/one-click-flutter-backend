import request from 'supertest';
import app from '../src/index.js';

describe('API health', () => {
  it('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('OK');
  });
});

describe('Auth & Todos', () => {
  let token = '';
  it('login returns token', async () => {
    const res = await request(app).post('/login').send({ username: 'admin', password: 'secret' });
    expect(res.statusCode).toBe(200);
    token = res.body.token;
    expect(token).toBeDefined();
  });
  it('POST /todos with token', async () => {
    const res = await request(app).post('/todos').set('Authorization', `Bearer ${token}`).send({ title: 'Write tests' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Write tests');
  });
});
