// ===================================
// Authentication Middleware
// ===================================

const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

// Verify JWT Token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user exists and is active
        const users = await query(
            'SELECT user_id, username, email, membership_type, is_active FROM users WHERE user_id = ?',
            [decoded.user_id]
        );

        if (users.length === 0 || !users[0].is_active) {
            return res.status(403).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        // Attach user to request
        req.user = users[0];
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                success: false,
                message: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                success: false,
                message: 'Token expired'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

// Check Membership Level
const requireMembership = (requiredLevel) => {
    const levels = { free: 0, premium: 1, vip: 2 };
    
    return (req, res, next) => {
        const userLevel = levels[req.user.membership_type] || 0;
        const required = levels[requiredLevel] || 0;

        if (userLevel < required) {
            return res.status(403).json({
                success: false,
                message: `This feature requires ${requiredLevel} membership`,
                required_membership: requiredLevel,
                current_membership: req.user.membership_type
            });
        }

        next();
    };
};

// Optional Authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const users = await query(
                'SELECT user_id, username, email, membership_type FROM users WHERE user_id = ? AND is_active = TRUE',
                [decoded.user_id]
            );
            
            if (users.length > 0) {
                req.user = users[0];
            }
        }
    } catch (error) {
        // Ignore errors for optional auth
    }
    next();
};

module.exports = {
    authenticateToken,
    requireMembership,
    optionalAuth
};
