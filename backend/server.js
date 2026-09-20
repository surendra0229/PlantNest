const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');
const { ensureAdminExists } = require('./utils/adminSetup');

const passport = require('./config/passport');

// Ensure logo and favicon files are present in frontend/public
const fs = require('fs');
const path = require('path');
const logoSource = 'C:\\Users\\suren\\.gemini\\antigravity-ide\\brain\\9b9870ab-f13b-46e2-b136-f0ba2512ea67\\media__1789726635324.png';
const frontendPublic = path.join(__dirname, '..', 'frontend', 'public');

try {
  if (!fs.existsSync(frontendPublic)) {
    fs.mkdirSync(frontendPublic, { recursive: true });
  }
  if (fs.existsSync(logoSource)) {
    fs.copyFileSync(logoSource, path.join(frontendPublic, 'logo.png'));
    fs.copyFileSync(logoSource, path.join(frontendPublic, 'favicon.png'));
    fs.copyFileSync(logoSource, path.join(frontendPublic, 'favicon.ico'));
    console.log('🌿 PlantNest Logo & Favicon successfully copied to frontend/public');
  }
} catch (logoErr) {
  console.warn('Logo copy check:', logoErr.message);
}

// Connect to MongoDB, then ensure admin account and seed default knowledge
connectDB().then(async () => {
  await ensureAdminExists();
  await seedDefaultKnowledge();
}).catch(err => {
  console.error('Startup sequence error:', err.message);
});

// Seed initial knowledge base entries if collection is empty
const seedDefaultKnowledge = async () => {
  try {
    const KnowledgeBase = require('./models/KnowledgeBase');
    const count = await KnowledgeBase.countDocuments();
    if (count > 0) return; // Already seeded

    const defaultEntries = [
      {
        title: 'Shipping & Delivery Policy',
        category: 'shipping',
        content: `🚚 PlantNest Shipping & Delivery:\n• We deliver nursery-fresh plants across India within 3-5 business days.\n• Express delivery is available in select metropolitan areas.\n• Free delivery on all orders above ₹999.\n• All plants are packed securely in eco-friendly protective cardboard boxes.\n• We ship Monday–Saturday (excluding national holidays).`
      },
      {
        title: 'Return & Refund Policy',
        category: 'returns',
        content: `🛡️ PlantNest Return & Refund Policy:\n• We offer a 7-day Fresh Plant Guarantee on all orders.\n• If your plant arrives damaged, unhealthy, or defective, contact us at surendrachennamalli177@gmail.com for an instant replacement or full refund.\n• Non-plant accessories (pots, tools) can be returned within 14 days of delivery.\n• Refunds are processed within 5-7 business days.`
      },
      {
        title: 'Contact & Support',
        category: 'contact',
        content: `📞 PlantNest Contact & Support:\n• Customer Support Email: surendrachennamalli177@gmail.com\n• Nursery Helpline: +91 96520 77964 (Mon-Sat, 9:00 AM - 7:00 PM IST)\n• Nursery HQ: Bengaluru, Karnataka, India.`
      },
      {
        title: 'Payment Methods Accepted',
        category: 'payment',
        content: `💳 Accepted Payment Methods at PlantNest:\n• Cash on Delivery (COD)\n• Credit & Debit Cards (Visa, Mastercard, RuPay)\n• Instant UPI (Google Pay, PhonePe, Paytm, BHIM)\n• Net Banking across all major Indian banks.\n• Razorpay secure checkout.`
      },
      {
        title: 'PlantNest Services',
        category: 'services',
        content: `🌿 PlantNest Nursery Services:\n• Premium indoor & outdoor plant delivery across India.\n• Custom garden landscaping & office greenery design.\n• Expert botanist consultation & soil care guidance.\n• Potting mixes, organic fertilizers, and planter accessories.\n• Gift-wrapped plant packages for special occasions.`
      }
    ];

    await KnowledgeBase.insertMany(defaultEntries);
    console.log('🧠 Default chatbot knowledge base seeded successfully.');
  } catch (err) {
    console.warn('Knowledge base seed warning:', err.message);
  }
};

const app = express();

// Enable reverse proxy trust (Render, Vercel, Nginx, Heroku) for HTTPS cookies & headers
app.enable('trust proxy');

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration — allow frontend dev & production origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://plant-nest-alpha.vercel.app',
  'https://plant-nest.vercel.app',
  'https://plantnest-rcp4.onrender.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., Postman, mobile apps, same-origin)
    if (!origin) return callback(null, true);

    // Allow explicitly listed origins or hosted domains
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.onrender.com') ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.netlify.app')
    ) {
      return callback(null, true);
    }

    // Allow all localhost variants in development
    if (process.env.NODE_ENV !== 'production' && (
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    )) {
      return callback(null, true);
    }

    // Default allow for flexibility in production deployment
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
}));

// Body & Cookie Parsers
// 20mb limit to allow base64-encoded images in JSON body (10MB file ≈ 13.4MB base64)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());
app.use(passport.initialize());

// General Rate Limiter
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/plants', require('./routes/plantRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
// Cloudinary & Multer Upload Routes
app.use('/api/upload', require('./routes/uploadRoutes'));
// RAG Chatbot Routes
app.use('/api/chatbot', require('./routes/chatbotRoutes'));

// Static uploads directory serving (for local fallback files)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'PlantNest Nursery API is online',
    timestamp: new Date().toISOString()
  });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌿 PlantNest Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

