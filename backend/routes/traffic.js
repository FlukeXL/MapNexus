const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// GET /api/traffic/current - ดูสถานะการจราจรปัจจุบัน
router.get('/current', async (req, res) => {
    try {
        const traffic = await query(
            `SELECT * FROM traffic_data 
             WHERE recorded_at >= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
             ORDER BY recorded_at DESC`
        );
        
        res.json({ success: true, traffic });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get traffic data' });
    }
});

module.exports = router;
