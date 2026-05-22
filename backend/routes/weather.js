const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// GET /api/weather/current - ดูสภาพอากาศปัจจุบัน
router.get('/current', async (req, res) => {
    try {
        const weather = await query(
            'SELECT * FROM weather_data ORDER BY date DESC LIMIT 1'
        );
        
        res.json({ 
            success: true, 
            weather: weather[0] || null 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get weather data' });
    }
});

// GET /api/weather/forecast - พยากรณ์อากาศ 7 วัน
router.get('/forecast', async (req, res) => {
    try {
        const forecast = await query(
            'SELECT * FROM weather_data WHERE date >= CURDATE() ORDER BY date ASC LIMIT 7'
        );
        
        res.json({ success: true, forecast });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get forecast' });
    }
});

module.exports = router;
