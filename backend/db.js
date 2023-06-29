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


// Image upload mate learn karyu che using Multer? yes have update user ni api banavani che and ama image upload karvani che
// only for .jpeg,.jpg,.png format and max 5MB size hovi joye

// And User Signin hoy to j te route [End point] access thavo joye otherwise error rertun thavi joye.And

// ni khbar pade to mne kyo? atyre to khabr padi gay good start work on it