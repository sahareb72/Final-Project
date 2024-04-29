const { MongoClient } = require('mongodb');

// Environment variables for MongoDB connection
const uri = process.env.MONGODB_URI; // MongoDB URI
const dbName = process.env.MONGODB_DB_NAME; // Database name

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB server');
    const db = client.db(dbName);
    return db;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

module.exports = connectDB;
