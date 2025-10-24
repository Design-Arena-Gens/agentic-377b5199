const request = require('supertest');
const app = require('../app');
const { connectDB, disconnectDB } = require('../utils/db');

describe('Auth API', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('registers a new user and logs in', async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        phone: '+1234567890'
      })
      .expect(201);

    expect(registerResponse.body.message).toContain('Verification');

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123'
      })
      .expect(200);

    expect(loginResponse.body.token).toBeDefined();
    expect(loginResponse.body.user.email).toBe('test@example.com');
  });
});
