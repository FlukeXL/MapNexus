// ===================================
// Subscriptions Routes
// ===================================

const express = require('express');
const router = express.Router();
const { query, transaction } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// ===================================
// GET /api/subscriptions/plans - ดูแพ็กเกจทั้งหมด
// ===================================
router.get('/plans', async (req, res) => {
    try {
        const plans = [
            {
                plan_id: 'monthly_premium',
                plan_name: 'Premium Monthly',
                plan_type: 'monthly',
                price: 99.00,
                duration_months: 1,
                features: [
                    'ดูสถานที่ไม่จำกัด',
                    'บันทึกสถานที่โปรดไม่จำกัด',
                    'ดาวน์โหลดแผนที่ออฟไลน์',
                    'ไม่มีโฆษณา',
                    'สร้างแผนการเดินทางส่วนตัว'
                ],
                popular: false
            },
            {
                plan_id: 'quarterly_premium',
                plan_name: 'Premium Quarterly',
                plan_type: 'quarterly',
                price: 249.00,
                original_price: 297.00,
                duration_months: 3,
                discount: '15%',
                features: [
                    'ดูสถานที่ไม่จำกัด',
                    'บันทึกสถานที่โปรดไม่จำกัด',
                    'ดาวน์โหลดแผนที่ออฟไลน์',
                    'ไม่มีโฆษณา',
                    'สร้างแผนการเดินทางส่วนตัว',
                    'ประหยัด 15%'
                ],
                popular: false
            },
            {
                plan_id: 'yearly_premium',
                plan_name: 'Premium Yearly',
                plan_type: 'yearly',
                price: 899.00,
                original_price: 1188.00,
                duration_months: 12,
                discount: '25%',
                features: [
                    'ดูสถานที่ไม่จำกัด',
                    'บันทึกสถานที่โปรดไม่จำกัด',
                    'ดาวน์โหลดแผนที่ออฟไลน์',
                    'ไม่มีโฆษณา',
                    'สร้างแผนการเดินทางส่วนตัว',
                    'ประหยัด 25%'
                ],
                popular: true
            },
            {
                plan_id: 'yearly_vip',
                plan_name: 'VIP Yearly',
                plan_type: 'yearly',
                price: 1999.00,
                duration_months: 12,
                features: [
                    'สิทธิ์ทั้งหมดของ Premium',
                    'ส่วนลดพิเศษ 10-30% จากร้านค้าพันธมิตร',
                    'บริการ Concierge 24/7',
                    'จองล่วงหน้าพิเศษ',
                    'เข้าร่วมกิจกรรมพิเศษ',
                    'ของขวัญวันเกิด'
                ],
                popular: false,
                exclusive: true
            }
        ];

        res.json({
            success: true,
            plans
        });
    } catch (error) {
        console.error('Get plans error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get plans'
        });
    }
});

// ===================================
// POST /api/subscriptions/subscribe - สมัครสมาชิก
// ===================================
router.post('/subscribe', authenticateToken, async (req, res) => {
    try {
        const { plan_id, payment_method } = req.body;

        if (!plan_id || !payment_method) {
            return res.status(400).json({
                success: false,
                message: 'Plan ID and payment method are required'
            });
        }

        // Get plan details
        const planMap = {
            'monthly_premium': { name: 'Premium Monthly', type: 'monthly', price: 99.00, months: 1 },
            'quarterly_premium': { name: 'Premium Quarterly', type: 'quarterly', price: 249.00, months: 3 },
            'yearly_premium': { name: 'Premium Yearly', type: 'yearly', price: 899.00, months: 12 },
            'yearly_vip': { name: 'VIP Yearly', type: 'yearly', price: 1999.00, months: 12 }
        };

        const plan = planMap[plan_id];

        if (!plan) {
            return res.status(400).json({
                success: false,
                message: 'Invalid plan ID'
            });
        }

        // Check if user already has active subscription
        const activeSubscriptions = await query(
            `SELECT subscription_id FROM premium_subscriptions 
             WHERE user_id = ? AND status = 'active' AND end_date > NOW()`,
            [req.user.user_id]
        );

        if (activeSubscriptions.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'You already have an active subscription'
            });
        }

        const result = await transaction(async (conn) => {
            // Create subscription
            const [subResult] = await conn.execute(
                `INSERT INTO premium_subscriptions 
                 (user_id, plan_type, plan_name, price, start_date, end_date, status, payment_method)
                 VALUES (?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? MONTH), 'pending', ?)`,
                [req.user.user_id, plan.type, plan.name, plan.price, plan.months, payment_method]
            );

            // Create payment transaction
            const [txnResult] = await conn.execute(
                `INSERT INTO payment_transactions 
                 (user_id, subscription_id, amount, currency, payment_method, status)
                 VALUES (?, ?, ?, 'THB', ?, 'pending')`,
                [req.user.user_id, subResult.insertId, plan.price, payment_method]
            );

            return {
                subscription_id: subResult.insertId,
                transaction_id: txnResult.insertId
            };
        });

        res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            subscription_id: result.subscription_id,
            transaction_id: result.transaction_id,
            next_step: 'Please proceed to payment'
        });
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create subscription'
        });
    }
});

// ===================================
// GET /api/subscriptions/my - ดูสมาชิกของตัวเอง
// ===================================
router.get('/my', authenticateToken, async (req, res) => {
    try {
        const subscriptions = await query(
            `SELECT * FROM premium_subscriptions 
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [req.user.user_id]
        );

        // Get current active subscription
        const activeSubscription = subscriptions.find(
            sub => sub.status === 'active' && new Date(sub.end_date) > new Date()
        );

        res.json({
            success: true,
            current_subscription: activeSubscription || null,
            subscription_history: subscriptions
        });
    } catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get subscription'
        });
    }
});

// ===================================
// POST /api/subscriptions/cancel - ยกเลิกสมาชิก
// ===================================
router.post('/cancel', authenticateToken, async (req, res) => {
    try {
        const { subscription_id, reason } = req.body;

        if (!subscription_id) {
            return res.status(400).json({
                success: false,
                message: 'Subscription ID is required'
            });
        }

        // Verify subscription belongs to user
        const subscriptions = await query(
            'SELECT * FROM premium_subscriptions WHERE subscription_id = ? AND user_id = ?',
            [subscription_id, req.user.user_id]
        );

        if (subscriptions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            });
        }

        // Update subscription status
        await query(
            `UPDATE premium_subscriptions 
             SET status = 'cancelled', auto_renew = FALSE
             WHERE subscription_id = ?`,
            [subscription_id]
        );

        // Log cancellation reason
        await query(
            `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description)
             VALUES (?, 'cancel_subscription', 'subscription', ?, ?)`,
            [req.user.user_id, subscription_id, reason || 'No reason provided']
        );

        res.json({
            success: true,
            message: 'Subscription cancelled successfully',
            note: 'You can still use premium features until the end of your billing period'
        });
    } catch (error) {
        console.error('Cancel subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel subscription'
        });
    }
});

// ===================================
// GET /api/subscriptions/features - ดูฟีเจอร์พรีเมี่ยม
// ===================================
router.get('/features', async (req, res) => {
    try {
        const features = await query(
            'SELECT * FROM premium_features WHERE is_active = TRUE ORDER BY required_membership'
        );

        // Group by membership level
        const grouped = {
            free: [],
            premium: features.filter(f => f.required_membership === 'premium'),
            vip: features.filter(f => f.required_membership === 'vip')
        };

        res.json({
            success: true,
            features: grouped
        });
    } catch (error) {
        console.error('Get features error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get features'
        });
    }
});

module.exports = router;
