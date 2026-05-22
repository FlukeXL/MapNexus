// ===================================
// Authentication Routes
// ===================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query, transaction } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// ===================================
// POST /api/auth/register - สมัครสมาชิก
// ===================================
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, full_name, phone } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email, and password are required'
            });
        }

        // Check if user exists
        const existingUsers = await query(
            'SELECT user_id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email or username already exists'
            });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create user
        const result = await query(
            `INSERT INTO users (username, email, password_hash, full_name, phone, membership_type)
             VALUES (?, ?, ?, ?, ?, 'free')`,
            [username, email, password_hash, full_name, phone]
        );

        // Generate token
        const token = jwt.sign(
            { user_id: result.insertId, email, membership_type: 'free' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                user_id: result.insertId,
                username,
                email,
                full_name,
                membership_type: 'free'
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

// ===================================
// POST /api/auth/login - เข้าสู่ระบบ
// ===================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const users = await query(
            'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update login info
        await query(
            'UPDATE users SET last_login = NOW(), login_count = login_count + 1 WHERE user_id = ?',
            [user.user_id]
        );

        // Generate token
        const token = jwt.sign(
            { 
                user_id: user.user_id, 
                email: user.email,
                membership_type: user.membership_type 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                profile_image: user.profile_image,
                membership_type: user.membership_type,
                membership_end_date: user.membership_end_date
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// ===================================
// GET /api/auth/me - ดูข้อมูลตัวเอง
// ===================================
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const users = await query(
            `SELECT user_id, username, email, full_name, phone, profile_image,
                    membership_type, membership_end_date, created_at, last_login
             FROM users WHERE user_id = ?`,
            [req.user.user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user info'
        });
    }
});

// ===================================
// POST /api/auth/logout - ออกจากระบบ
// ===================================
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        // In a real app, you might want to blacklist the token
        // For now, just return success
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
});

// ===================================
// POST /api/auth/change-password - เปลี่ยนรหัสผ่าน
// ===================================
router.post('/change-password', authenticateToken, async (req, res) => {
    try {
        const { current_password, new_password } = req.body;

        if (!current_password || !new_password) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        // Get user
        const users = await query(
            'SELECT password_hash FROM users WHERE user_id = ?',
            [req.user.user_id]
        );

        // Verify current password
        const isValid = await bcrypt.compare(current_password, users[0].password_hash);

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const new_password_hash = await bcrypt.hash(new_password, 10);

        // Update password
        await query(
            'UPDATE users SET password_hash = ? WHERE user_id = ?',
            [new_password_hash, req.user.user_id]
        );

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password'
        });
    }
});

module.exports = router;
