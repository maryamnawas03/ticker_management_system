import mongoose from 'mongoose';

/**
 * CONCEPT: MongoDB Connection Setup
 * 
 * MongoDB is a NoSQL database that stores data in JSON-like documents.
 * Mongoose is an ODM (Object Data Modeling) library that provides:
 * - Schema validation
 * - Type casting
 * - Relationship management
 * - Middleware hooks
 * 
 * How it works:
 * 1. mongoose.connect() establishes connection to MongoDB URI
 * 2. Handles connection errors with try-catch
 * 3. Returns connection object on success
 * 4. Exits process on failure (prevents silent failures)
 * 
 * Environment variables keep sensitive data secure
 */

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
