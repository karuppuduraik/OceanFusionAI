require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const oceanRoutes = require('./routes/oceanRoutes');
const tsunamiRoutes = require('./routes/tsunamiRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and seed default accounts
connectDB().then(() => {
  User.seedDefaultUsers();
});

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api/', limiter);

// API Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'OceanFusion Express API Server',
    timestamp: new Date().toISOString(),
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
// Direct aliases for convenience
app.post('/api/login', (req, res, next) => { req.url = '/login'; authRoutes(req, res, next); });
app.post('/api/register', (req, res, next) => { req.url = '/register'; authRoutes(req, res, next); });
app.post('/login', (req, res, next) => { req.url = '/login'; authRoutes(req, res, next); });
app.post('/register', (req, res, next) => { req.url = '/register'; authRoutes(req, res, next); });
app.use('/api/predict', predictionRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/ocean', oceanRoutes);
app.use('/api/tsunami', tsunamiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` OceanFusion Backend Server running on port ${PORT}`);
  console.log(` API Endpoint: http://localhost:${PORT}/api`);
  console.log(` AI Microservice URL: ${process.env.FLASK_AI_URL || 'http://127.0.0.1:5001'}`);
  console.log(`====================================================`);
});

module.exports = app;
