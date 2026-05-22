const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// GET /api/events - ดูกิจกรรมทั้งหมด
router.get('/', async (req, res) => {
    try {
        const { upcoming = true } = req.query;
        
        let sql = 'SELECT * FROM events WHERE is_active = TRUE';
        
        if (upcoming === 'true') {
            sql += ' AND end_date >= NOW()';
        }
        
        sql += ' ORDER BY start_date ASC';
        
        const events = await query(sql);
        
        res.json({ success: true, events });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get events' });
    }
});

// GET /api/events/:id - ดูรายละเอียดกิจกรรม
router.get('/:id', async (req, res) => {
    try {
        const events = await query(
            'SELECT * FROM events WHERE event_id = ? AND is_active = TRUE',
            [req.params.id]
        );
        
        if (events.length === 0) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        
        res.json({ success: true, event: events[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get event' });
    }
});

module.exports = router;
