const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/users/profile - ดูโปรไฟล์
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const users = await query(
            `SELECT user_id, username, email, full_name, phone, profile_image,
                    membership_type, membership_end_date, created_at
             FROM users WHERE user_id = ?`,
            [req.user.user_id]
        );

        res.json({ success: true, user: users[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get profile' });
    }
});

// PUT /api/users/profile - อัพเดทโปรไฟล์
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { full_name, phone, profile_image } = req.body;

        await query(
            'UPDATE users SET full_name = ?, phone = ?, profile_image = ? WHERE user_id = ?',
            [full_name, phone, profile_image, req.user.user_id]
        );

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
});

// GET /api/users/stats - สถิติผู้ใช้
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const [stats] = await query(
            'SELECT * FROM user_statistics WHERE user_id = ?',
            [req.user.user_id]
        );

        res.json({ success: true, stats: stats || {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get stats' });
    }
});

module.exports = router;
