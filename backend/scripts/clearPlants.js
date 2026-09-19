const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const Plant = require('../models/Plant');

const clearPlants = async () => {
  try {
    await connectDB();
    console.log('Clearing all plant data from MongoDB...');
    const result = await Plant.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} plants from database.`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to clear plant collection:', err.message);
    process.exit(1);
  }
};

clearPlants();
