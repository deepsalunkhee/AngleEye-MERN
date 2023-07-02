const mongoose = require('mongoose');
require('dotenv').config();

async function connectToDatabase() {
  try {
    const uri = process.env.MONGO_URI;
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(uri, options);

    console.log('Connected to MongoDB');

    return mongoose.connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

module.exports = connectToDatabase;


