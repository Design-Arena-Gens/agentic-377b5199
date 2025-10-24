const { connectDB, disconnectDB } = require('../utils/db');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Tech and gadgets' },
  { name: 'Fashion', slug: 'fashion', description: 'Apparel and accessories' },
  { name: 'Home & Living', slug: 'home-living', description: 'Furniture and decor' }
];

const products = [
  {
    title: 'Wireless Headphones',
    slug: 'wireless-headphones',
    description: 'Noise-cancelling over-ear headphones with 30-hour battery life.',
    price: 199,
    stock: 25,
    images: ['https://via.placeholder.com/640x480?text=Headphones'],
    tags: ['audio', 'wireless'],
    isFeatured: true,
    categoryName: 'Electronics'
  },
  {
    title: 'Smartwatch Pro',
    slug: 'smartwatch-pro',
    description: 'Track fitness, health metrics, and receive notifications on the go.',
    price: 249,
    stock: 40,
    images: ['https://via.placeholder.com/640x480?text=Smartwatch'],
    tags: ['wearable'],
    categoryName: 'Electronics'
  },
  {
    title: 'Ergonomic Desk Chair',
    slug: 'ergonomic-desk-chair',
    description: 'Comfortable lumbar support chair ideal for remote work.',
    price: 329,
    stock: 15,
    images: ['https://via.placeholder.com/640x480?text=Desk%20Chair'],
    tags: ['office'],
    categoryName: 'Home & Living'
  }
];

const run = async () => {
  await connectDB();
  await Category.deleteMany();
  await Product.deleteMany();

  const createdCategories = await Category.insertMany(categories);
  const categoryMap = createdCategories.reduce((acc, category) => {
    acc[category.name] = category._id;
    return acc;
  }, {});

  await Product.insertMany(products.map((product) => ({
    ...product,
    category: categoryMap[product.categoryName]
  })));

  console.log('Database seeded successfully');
  await disconnectDB();
  process.exit(0);
};

run().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});
