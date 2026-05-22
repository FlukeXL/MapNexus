// ===================================
// Check-ins Routes
// ===================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// ===================================
// POST /api/checkins - เช็คอิน
// ===================================
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { place_id, comment, rating, latitude, longitude, images } = req.body;

        if (!place_id) {
            return res.status(400).json({
                success: false,
                message: 'Place ID is required'
            });
        }

        // Check if place exists
        const places = await query(
            'SELECT place_id FROM places WHERE place_id = ? AND is_active = TRUE',
            [place_id]
        );

        if (places.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Place not found'
            });
        }

        // Create check-in
        const result = await query(
            `INSERT INTO checkins (user_id, place_id, checkin_date, comment, rating, latitude, longitude, images)
             VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)`,
            [req.user.user_id, place_id, comment, rating, latitude, longitude, JSON.stringify(images || [])]
        );

        res.status(201).json({
            success: true,
            message: 'Check-in successful',
            checkin_id: result.insertId
        });
    } catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check-in'
        });
    }
});

// ===================================
// GET /api/checkins/my - ดูประวัติเช็คอินของตัวเอง
// ===================================
router.get('/my', authenticateToken, async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;

        const checkins = await query(
            `SELECT c.*, p.name as place_name, p.main_image, p.category, p.address
             FROM checkins c
             JOIN places p ON c.place_id = p.place_id
             WHERE c.user_id = ?
             ORDER BY c.checkin_date DESC
             LIMIT ? OFFSET ?`,
            [req.user.user_id, parseInt(limit), parseInt(offset)]
        );

        // Parse images JSON
        checkins.forEach(checkin => {
            if (checkin.images) {
                try {
                    checkin.images = JSON.parse(checkin.images);
                } catch (e) {
                    checkin.images = [];
                }
            }
        });

        res.json({
            success: true,
            checkins
        });
    } catch (error) {
        console.error('Get checkins error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get check-ins'
        });
    }
});

// ===================================
// GET /api/checkins/place/:place_id - ดูเช็คอินของสถานที่
// ===================================
router.get('/place/:place_id', async (req, res) => {
    try {
        const { place_id } = req.params;
        const { limit = 10 } = req.query;

        const checkins = await query(
            `SELECT c.checkin_id, c.comment, c.rating, c.checkin_date, c.images,
                    u.username, u.profile_image
             FROM checkins c
             JOIN users u ON c.user_id = u.user_id
             WHERE c.place_id = ? AND c.is_public = TRUE
             ORDER BY c.checkin_date DESC
             LIMIT ?`,
            [place_id, parseInt(limit)]
        );

        // Parse images JSON
        checkins.forEach(checkin => {
            if (checkin.images) {
                try {
                    checkin.images = JSON.parse(checkin.images);
                } catch (e) {
                    checkin.images = [];
                }
            }
        });

        res.json({
            success: true,
            checkins
        });
    } catch (error) {
        console.error('Get place checkins error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get check-ins'
        });
    }
});

// ===================================
// DELETE /api/checkins/:id - ลบเช็คอิน
// ===================================
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            'DELETE FROM checkins WHERE checkin_id = ? AND user_id = ?',
            [id, req.user.user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Check-in not found'
            });
        }

        res.json({
            success: true,
            message: 'Check-in deleted successfully'
        });
    } catch (error) {
        console.error('Delete checkin error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete check-in'
        });
    }
});

module.exports = router;
