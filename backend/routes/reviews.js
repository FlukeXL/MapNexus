// ===================================
// Reviews Routes
// ===================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// POST /api/reviews - เขียนรีวิว
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { place_id, rating, title, content, images, cleanliness_rating, service_rating, value_rating } = req.body;

        if (!place_id || !rating || !content) {
            return res.status(400).json({
                success: false,
                message: 'Place ID, rating, and content are required'
            });
        }

        const result = await query(
            `INSERT INTO reviews (user_id, place_id, rating, title, content, images, 
                                  cleanliness_rating, service_rating, value_rating)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [req.user.user_id, place_id, rating, title, content, JSON.stringify(images || []),
             cleanliness_rating, service_rating, value_rating]
        );

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            review_id: result.insertId
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create review'
        });
    }
});

// GET /api/reviews/place/:place_id - ดูรีวิวของสถานที่
router.get('/place/:place_id', async (req, res) => {
    try {
        const { place_id } = req.params;
        const { limit = 10, offset = 0 } = req.query;

        const reviews = await query(
            `SELECT r.*, u.username, u.profile_image
             FROM reviews r
             JOIN users u ON r.user_id = u.user_id
             WHERE r.place_id = ? AND r.is_approved = TRUE
             ORDER BY r.created_at DESC
             LIMIT ? OFFSET ?`,
            [place_id, parseInt(limit), parseInt(offset)]
        );

        res.json({
            success: true,
            reviews
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get reviews'
        });
    }
});

module.exports = router;
