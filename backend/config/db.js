import mongoose from 'mongoose';

let isConnected = false;
let dbInfo = { host: null, name: null };

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/naukrishield';
  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'naukrishield',
      serverSelectionTimeoutMS: 8000
    });
    isConnected = true;
    dbInfo = {
      host: conn.connection.host,
      name: conn.connection.name
    };
    console.log(`Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    dbInfo = { host: null, name: null };
    console.warn(`MongoDB connection failed (${error.message}). Continuing in offline mode.`);
  }
};

export const getDBStatus = () => isConnected;
export const getDBInfo = () => dbInfo;
