const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB using Mongoose.
 * 
 * Attempts to connect to a MongoDB database using the URI specified in the
 * environment variable `MONGO_URI`. Falls back to a default local development
 * URI if the environment variable is not set. Configures a 5-second server
 * selection timeout.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<mongoose.Connection>} Resolves with Mongoose connection object on successful connection
 * @throws {Error} Terminates process with exit code 1 on connection failure
 * 
 * @example
 * const connectDB = require('./config/database');
 * 
 * connectDB()
 *   .then((connection) => {
 *     console.log(`Connected to database: ${connection.connection.name}`);
 *   })
 *   .catch((error) => {
 *     console.error('Database connection failed:', error.message);
 *   });
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hospitalManagementDB';
    
    console.log('Connecting to MongoDB:', mongoURI);
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('Database connection error:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('Cannot connect to MongoDB. Please ensure MongoDB is running.');
      console.error('Run: mongod (in a separate terminal)');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;