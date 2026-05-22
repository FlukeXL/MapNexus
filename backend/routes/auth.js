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

// ===================================
// POST /api/auth/register-phone - สมัครสมาชิกด้วยเบอร์โทร
// ===================================
router.post('/register-phone', async (req, res) => {
    try {
        const { full_name, phone, password } = req.body;

        // Validation
        if (!phone || !password || !full_name) {
            return res.status(400).json({
                success: false,
                message: 'Full name, phone, and password are required'
            });
        }

        // Validate phone format (+66xxxxxxxxx)
        if (!phone.startsWith('+66') || phone.length !== 12) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format'
            });
        }

        // Check if phone exists
        const existingUsers = await query(
            'SELECT user_id FROM users WHERE phone = ?',
            [phone]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Phone number already registered'
            });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Generate username from phone
        const username = 'user_' + phone.substring(3); // Remove +66

        // Create user
        const result = await query(
            `INSERT INTO users (username, phone, password_hash, full_name, membership_type, auth_provider)
             VALUES (?, ?, ?, ?, 'free', 'phone')`,
            [username, phone, password_hash, full_name]
        );

        // Generate token
        const token = jwt.sign(
            { user_id: result.insertId, phone, membership_type: 'free' },
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
                phone,
                full_name,
                membership_type: 'free'
            }
        });
    } catch (error) {
        console.error('Register phone error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

// ===================================
// POST /api/auth/login-phone - เข้าสู่ระบบด้วยเบอร์โทร
// ===================================
router.post('/login-phone', async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Validation
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Phone and password are required'
            });
        }

        // Find user by phone
        const users = await query(
            'SELECT * FROM users WHERE phone = ? AND is_active = TRUE',
            [phone]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid phone number or password'
            });
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid phone number or password'
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
                phone: user.phone,
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
                phone: user.phone,
                full_name: user.full_name,
                profile_image: user.profile_image,
                membership_type: user.membership_type,
                membership_end_date: user.membership_end_date
            }
        });
    } catch (error) {
        console.error('Login phone error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// ===================================
// POST /api/auth/google - Google OAuth Login/Register
// ===================================
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: 'Google credential is required'
            });
        }

        // Verify Google token
        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        let payload;
        try {
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            payload = ticket.getPayload();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Google token'
            });
        }

        const { sub: google_id, email, name, picture } = payload;

        // Check if user exists
        let users = await query(
            'SELECT * FROM users WHERE google_id = ? OR email = ?',
            [google_id, email]
        );

        let user;
        let isNewUser = false;

        if (users.length === 0) {
            // Create new user
            const username = 'google_' + google_id.substring(0, 10);
            
            const result = await query(
                `INSERT INTO users (username, email, full_name, profile_image, google_id, 
                                   membership_type, is_verified, auth_provider)
                 VALUES (?, ?, ?, ?, ?, 'free', TRUE, 'google')`,
                [username, email, name, picture, google_id]
            );

            user = {
                user_id: result.insertId,
                username,
                email,
                full_name: name,
                profile_image: picture,
                membership_type: 'free'
            };
            isNewUser = true;
        } else {
            user = users[0];
            
            // Update Google ID if not set
            if (!user.google_id) {
                await query(
                    'UPDATE users SET google_id = ?, is_verified = TRUE WHERE user_id = ?',
                    [google_id, user.user_id]
                );
            }

            // Update last login
            await query(
                'UPDATE users SET last_login = NOW(), login_count = login_count + 1 WHERE user_id = ?',
                [user.user_id]
            );
        }

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
            message: isNewUser ? 'Account created successfully' : 'Login successful',
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
        console.error('Google auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Google authentication failed',
            error: error.message
        });
    }
});

// ===================================
// POST /api/auth/forgot-password - ลืมรหัสผ่าน
// ===================================
router.post('/forgot-password', async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        // Find user
        const users = await query(
            'SELECT user_id, phone, full_name FROM users WHERE phone = ? AND is_active = TRUE',
            [phone]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Phone number not found'
            });
        }

        const user = users[0];

        // Generate reset token
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        
        // Token expires in 1 hour
        const expiresAt = new Date(Date.now() + 3600000);

        // Save token to database
        await query(
            'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE user_id = ?',
            [resetTokenHash, expiresAt, user.user_id]
        );

        // In production, send SMS with reset link
        // For now, just return success
        // Reset link would be: https://yourdomain.com/reset-password?token=${resetToken}

        res.json({
            success: true,
            message: 'Password reset link sent to your phone',
            // In development, return token for testing
            ...(process.env.NODE_ENV === 'development' && { resetToken })
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process forgot password request'
        });
    }
});

// ===================================
// POST /api/auth/reset-password - รีเซ็ตรหัสผ่าน
// ===================================
router.post('/reset-password', async (req, res) => {
    try {
        const { token, new_password } = req.body;

        if (!token || !new_password) {
            return res.status(400).json({
                success: false,
                message: 'Token and new password are required'
            });
        }

        if (new_password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters'
            });
        }

        // Hash the token
        const crypto = require('crypto');
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token
        const users = await query(
            `SELECT user_id FROM users 
             WHERE reset_password_token = ? 
             AND reset_password_expires > NOW()
             AND is_active = TRUE`,
            [resetTokenHash]
        );

        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        const user = users[0];

        // Hash new password
        const password_hash = await bcrypt.hash(new_password, 10);

        // Update password and clear reset token
        await query(
            `UPDATE users 
             SET password_hash = ?, 
                 reset_password_token = NULL, 
                 reset_password_expires = NULL 
             WHERE user_id = ?`,
            [password_hash, user.user_id]
        );

        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password'
        });
    }
});

// ===================================
// GET /api/auth/verify - ตรวจสอบ Token
// ===================================
router.get('/verify', authenticateToken, async (req, res) => {
    try {
        res.json({
            success: true,
            valid: true,
            user: req.user
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            valid: false,
            message: 'Invalid token'
        });
    }
});

module.exports = router;
