const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Plant = require('../models/Plant');
const Category = require('../models/Category');
const Order = require('../models/Order');
const connectDB = require('../config/db');

const categories = [
  {
    name: 'Indoor Plants',
    slug: 'indoor-plants',
    description: 'Purify indoor air and enhance living spaces with lush tropical foliage.'
  },
  {
    name: 'Outdoor Plants',
    slug: 'outdoor-plants',
    description: 'Resilient shrubs, patio greenery, and sun-loving garden highlights.'
  },
  {
    name: 'Flowering Plants',
    slug: 'flowering-plants',
    description: 'Vibrant blooming plants that fill your home with fragrant colorful flowers.'
  },
  {
    name: 'Succulents & Cacti',
    slug: 'succulents-cacti',
    description: 'Low-maintenance, drought-tolerant architectural plants perfect for desks and windowsills.'
  },
  {
    name: 'Bonsai & Trees',
    slug: 'bonsai-trees',
    description: 'Miniature living art pieces crafted for mindfulness and timeless garden beauty.'
  },
  {
    name: 'Herbs & Spices',
    slug: 'herbs-spices',
    description: 'Fresh organic culinary herbs to grow right in your kitchen garden.'
  }
];

const plants = [];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Admin.deleteMany();
    await Plant.deleteMany();
    await Category.deleteMany();
    await Order.deleteMany();

    console.log('Seeding Categories...');
    await Category.insertMany(categories);

    console.log('Seeding Admin account from .env...');
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@plantnest.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'changeme_set_ADMIN_PASSWORD';
    const adminName = process.env.ADMIN_NAME || 'PlantNest Admin';

    await Admin.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });

    console.log('Seeding Plants...');
    for (const p of plants) {
      const plantDoc = new Plant(p);
      await plantDoc.save();
    }

    console.log('==================================================');
    console.log('PlantNest Database Seeded Successfully!');
    console.log(`Admin Email: ${adminEmail}`);
    console.log('Admin Password: (from ADMIN_PASSWORD in .env)');
    console.log('==================================================');

    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();

