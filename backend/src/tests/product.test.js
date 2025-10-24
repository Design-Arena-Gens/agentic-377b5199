const request = require('supertest');
const app = require('../app');
const { connectDB, disconnectDB } = require('../utils/db');
const User = require('../models/User');
const Category = require('../models/Category');

describe('Product API', () => {
  let adminToken;
  let categoryId;

  beforeAll(async () => {
    await connectDB();

    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'Password123',
        phone: '+1234567891'
      });

    await User.updateOne({ email: 'admin@example.com' }, { role: 'admin', isEmailVerified: true, isPhoneVerified: true });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'Password123' });

    adminToken = loginResponse.body.token;

    const category = await Category.create({ name: 'Electronics', slug: 'electronics' });
    categoryId = category._id;
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('creates and lists products', async () => {
    const createResponse = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Smartphone',
        price: 799,
        description: 'Latest smartphone',
        category: categoryId,
        stock: 10
      })
      .expect(201);

    expect(createResponse.body.title).toBe('Smartphone');

    const listResponse = await request(app)
      .get('/api/products')
      .expect(200);

    expect(listResponse.body.data.length).toBeGreaterThan(0);
  });
});
