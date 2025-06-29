import mongoose from 'mongoose';
import logger from '../common/logger';

const connectMongoDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    logger.error('MONGO_URI is not defined in environment variables.');
    throw new Error('Missing MongoDB URI');
  }
  try {
    await mongoose.connect(mongoURI);
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    throw err;
  }
};

export default connectMongoDB;
