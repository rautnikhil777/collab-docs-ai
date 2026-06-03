const mongoose = require('mongoose');

async function connectMongo() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('Missing MONGO_URI');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName: undefined });
}

module.exports = { connectMongo };

