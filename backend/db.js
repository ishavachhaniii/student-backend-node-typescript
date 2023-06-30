const mongoose = require('mongoose')
require('dotenv').config()

const mongoURI = process.env.MONGO_URI

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1); // Exit the process with an error code
  }
};

module.exports = connectDB