import mongoose from 'mongoose';

let isConnected = false;
let dbInfo = { host: null, name: null };

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/naukrishield';
  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'naukrishield',
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    dbInfo = {
      host: conn.connection.host,
      name: conn.connection.name
    };
    console.log(`Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    // If Atlas connection fails (e.g. IP whitelist), try local MongoDB
    if (!uri.includes('127.0.0.1')) {
      try {
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/naukrishield', {
          serverSelectionTimeoutMS: 2000
        });
        isConnected = true;
        dbInfo = {
          host: localConn.connection.host,
          name: localConn.connection.name
        };
        console.log(`Connected to local MongoDB: ${localConn.connection.host}`);
        return;
      } catch (localErr) {
        // continue offline
      }
    }
    isConnected = false;
    dbInfo = { host: null, name: null };
    console.warn(`MongoDB connection offline. Running in-memory mode.`);
  }
};

export const getDBStatus = () => isConnected;
export const getDBInfo = () => dbInfo;
