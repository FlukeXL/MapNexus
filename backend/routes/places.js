// ===================================
// Places Routes
// ===================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { optionalAuth, authenticateToken } = require('../middleware/auth');

// ===================================
// GET /api/places - ดูสถานที่ทั้งหมด
// ===================================
router.get('/', optionalAuth, async (req, res) => {
    try {
        const { 
            category, 
            limit = 20, 
            offset = 0,
            sort = 'rating',
            search
        } = req.query;

        let sql = `
            SELECT place_id, name, category, description, address, district,
                   latitude, longitude, phone, main_image, rating, review_count,
                   price_range, average_price, is_featured
            FROM places 
            WHERE is_active = TRUE
        `;
        const params = [];

        // Filter by category
        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }

        // Search
        if (search) {
            sql += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        // Sorting
        if (sort === 'rating') {
            sql += ' ORDER BY rating DESC, review_count DESC';
        } else if (sort === 'reviews') {
            sql += ' ORDER BY review_count DESC';
        } else if (sort === 'name') {
            sql += ' ORDER BY name ASC';
        }

        sql += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const places = await query(sql, params);

        // Get total count
        let countSql = 'SELECT COUNT(*) as total FROM places WHERE is_active = TRUE';
        const countParams = [];
        
        if (category) {
            countSql += ' AND category = ?';
            countParams.push(category);
        }
        
        if (search) {
            countSql += ' AND (name LIKE ? OR description LIKE ?)';
            countParams.push(`%${search}%`, `%${search}%`);
        }

        const [countResult] = await query(countSql, countParams);

        res.json({
            success: true,
            places,
            pagination: {
                total: countResult.total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                has_more: (parseInt(offset) + places.length) < countResult.total
            }
        });
    } catch (error) {
        console.error('Get places error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get places'
        });
    }
});

// ===================================
// GET /api/places/:id - ดูรายละเอียดสถานที่
// ===================================
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Get place details
        const places = await query(
            'SELECT * FROM places WHERE place_id = ? AND is_active = TRUE',
            [id]
        );

        if (places.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Place not found'
            });
        }

        const place = places[0];

        // Get recent reviews
        const reviews = await query(
            `SELECT r.*, u.username, u.profile_image
             FROM reviews r
             JOIN users u ON r.user_id = u.user_id
             WHERE r.place_id = ? AND r.is_approved = TRUE
             ORDER BY r.created_at DESC
             LIMIT 5`,
            [id]
        );

        // Check if user has favorited (if authenticated)
        let is_favorited = false;
        if (req.user) {
            const favorites = await query(
                'SELECT favorite_id FROM favorites WHERE user_id = ? AND place_id = ?',
                [req.user.user_id, id]
            );
            is_favorited = favorites.length > 0;
        }

        res.json({
            success: true,
            place: {
                ...place,
                is_favorited
            },
            recent_reviews: reviews
        });
    } catch (error) {
        console.error('Get place error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get place details'
        });
    }
});

// ===================================
// GET /api/places/category/:category - ดูสถานที่ตามหมวดหมู่
// ===================================
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const { limit = 20 } = req.query;

        const places = await query(
            `SELECT place_id, name, category, description, address, main_image, 
                    rating, review_count, price_range
             FROM places 
             WHERE category = ? AND is_active = TRUE
             ORDER BY rating DESC, review_count DESC
             LIMIT ?`,
            [category, parseInt(limit)]
        );

        res.json({
            success: true,
            category,
            places,
            count: places.length
        });
    } catch (error) {
        console.error('Get places by category error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get places'
        });
    }
});

// ===================================
// GET /api/places/featured - ดูสถานที่แนะนำ
// ===================================
router.get('/featured/list', async (req, res) => {
    try {
        const places = await query(
            `SELECT place_id, name, category, description, address, main_image,
                    rating, review_count, price_range
             FROM places 
             WHERE is_featured = TRUE AND is_active = TRUE
             ORDER BY rating DESC
             LIMIT 10`
        );

        res.json({
            success: true,
            places
        });
    } catch (error) {
        console.error('Get featured places error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get featured places'
        });
    }
});

module.exports = router;
