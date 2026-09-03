import mongoose from 'mongoose';
import env from './env.js';

export const connectMongoDB = async () => {
  const uri = env.MONGODB_URI;
  if (!uri) {
    console.log('⚠️ MONGODB_URI is not configured in backend/.env');
    return null;
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log('=================================================');
    console.log(`🍃 MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);
    console.log('=================================================');
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Atlas Connection Error:', error.message);
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('🍃 MongoDB connection disconnected');
});

export default connectMongoDB;
