// ===================================
// Favorites Routes
// ===================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// POST /api/favorites - เพิ่มสถานที่โปรด
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { place_id, category, notes } = req.body;

        if (!place_id) {
            return res.status(400).json({
                success: false,
                message: 'Place ID is required'
            });
        }

        const result = await query(
            'INSERT INTO favorites (user_id, place_id, category, notes) VALUES (?, ?, ?, ?)',
            [req.user.user_id, place_id, category || 'general', notes]
        );

        res.status(201).json({
            success: true,
            message: 'Added to favorites',
            favorite_id: result.insertId
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Already in favorites'
            });
        }
        console.error('Add favorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add favorite'
        });
    }
});

// GET /api/favorites - ดูสถานที่โปรดทั้งหมด
router.get('/', authenticateToken, async (req, res) => {
    try {
        const favorites = await query(
            `SELECT f.*, p.name, p.category, p.main_image, p.rating, p.address, p.district
             FROM favorites f
             JOIN places p ON f.place_id = p.place_id
             WHERE f.user_id = ?
             ORDER BY f.created_at DESC`,
            [req.user.user_id]
        );

        res.json({
            success: true,
            favorites
        });
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get favorites'
        });
    }
});

// DELETE /api/favorites/:place_id - ลบสถานที่โปรด
router.delete('/:place_id', authenticateToken, async (req, res) => {
    try {
        const { place_id } = req.params;

        const result = await query(
            'DELETE FROM favorites WHERE user_id = ? AND place_id = ?',
            [req.user.user_id, place_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Favorite not found'
            });
        }

        res.json({
            success: true,
            message: 'Removed from favorites'
        });
    } catch (error) {
        console.error('Delete favorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove favorite'
        });
    }
});

module.exports = router;
