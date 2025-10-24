const mongoose = require('mongoose');

let dbConnection;

const connectDB = async () => {
  if (dbConnection) {
    return dbConnection;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }

  mongoose.set('strictQuery', true);

  dbConnection = await mongoose.connect(mongoUri, {
    autoIndex: process.env.NODE_ENV !== 'production'
  });

  return dbConnection;
};

const disconnectDB = async () => {
  if (!dbConnection) return;
  await mongoose.disconnect();
  dbConnection = null;
};

module.exports = {
  connectDB,
  disconnectDB
};
