// ===================================
// MapNexus Backend Server
// Express.js API Server
// ===================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// ===================================
// Middleware
// ===================================

// Security
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// ===================================
// Routes
// ===================================

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const placeRoutes = require('./routes/places');
const checkinRoutes = require('./routes/checkins');
const reviewRoutes = require('./routes/reviews');
const favoriteRoutes = require('./routes/favorites');
const subscriptionRoutes = require('./routes/subscriptions');
const paymentRoutes = require('./routes/payments');
const eventRoutes = require('./routes/events');
const weatherRoutes = require('./routes/weather');
const trafficRoutes = require('./routes/traffic');

// Health Check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'MapNexus API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/traffic', trafficRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ===================================
// Start Server
// ===================================

const db = require('./config/db');

async function startServer() {
    try {
        // Test Database Connection
        const isConnected = await db.testConnection();
        
        if (!isConnected) {
            console.error('❌ Failed to connect to database');
            process.exit(1);
        }
        
        // Start Server
        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════╗
║     MapNexus API Server Started      ║
╠═══════════════════════════════════════╣
║  Port: ${PORT}                        
║  Environment: ${process.env.NODE_ENV || 'development'}
║  Database: Connected ✓               
╚═══════════════════════════════════════╝
            `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;
