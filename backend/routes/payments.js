// ===================================
// Payment Routes - Payment Gateway Integration
// รองรับ: PromptPay, Credit Card (Stripe), Bank Transfer
// ===================================

const express = require('express');
const router = express.Router();
const { query, transaction } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');
const crypto = require('crypto');

// ===================================
// POST /api/payments/create - สร้างการชำระเงิน
// ===================================
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { subscription_id, payment_method, amount } = req.body;

        if (!subscription_id || !payment_method || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Subscription ID, payment method, and amount are required'
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

        // Create payment transaction
        const result = await query(
            `INSERT INTO payment_transactions 
             (user_id, subscription_id, amount, currency, payment_method, status)
             VALUES (?, ?, ?, 'THB', ?, 'pending')`,
            [req.user.user_id, subscription_id, amount, payment_method]
        );

        const transaction_id = result.insertId;

        // Generate payment details based on method
        let paymentDetails = {};

        switch (payment_method) {
            case 'promptpay':
                paymentDetails = await generatePromptPayQR(transaction_id, amount);
                break;
            case 'credit_card':
                paymentDetails = await generateStripePayment(transaction_id, amount);
                break;
            case 'bank_transfer':
                paymentDetails = generateBankTransferDetails(transaction_id);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid payment method'
                });
        }

        res.status(201).json({
            success: true,
            message: 'Payment created successfully',
            transaction_id,
            payment_method,
            amount,
            payment_details: paymentDetails
        });
    } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment'
        });
    }
});

// ===================================
// POST /api/payments/confirm - ยืนยันการชำระเงิน
// ===================================
router.post('/confirm', authenticateToken, async (req, res) => {
    try {
        const { transaction_id, gateway_transaction_id, payment_proof } = req.body;

        if (!transaction_id) {
            return res.status(400).json({
                success: false,
                message: 'Transaction ID is required'
            });
        }

        await transaction(async (conn) => {
            // Get transaction details
            const [transactions] = await conn.execute(
                'SELECT * FROM payment_transactions WHERE transaction_id = ? AND user_id = ?',
                [transaction_id, req.user.user_id]
            );

            if (transactions.length === 0) {
                throw new Error('Transaction not found');
            }

            const txn = transactions[0];

            // Update transaction status
            await conn.execute(
                `UPDATE payment_transactions 
                 SET status = 'completed', 
                     gateway_transaction_id = ?,
                     payment_details = ?,
                     updated_at = NOW()
                 WHERE transaction_id = ?`,
                [gateway_transaction_id, JSON.stringify({ payment_proof }), transaction_id]
            );

            // Update subscription status
            await conn.execute(
                `UPDATE premium_subscriptions 
                 SET status = 'active', 
                     transaction_id = ?,
                     payment_date = NOW()
                 WHERE subscription_id = ?`,
                [gateway_transaction_id, txn.subscription_id]
            );

            // Get subscription details
            const [subscriptions] = await conn.execute(
                'SELECT * FROM premium_subscriptions WHERE subscription_id = ?',
                [txn.subscription_id]
            );

            const subscription = subscriptions[0];

            // Update user membership
            const membership_type = subscription.plan_name.toLowerCase().includes('vip') ? 'vip' : 'premium';
            
            await conn.execute(
                `UPDATE users 
                 SET membership_type = ?,
                     membership_start_date = ?,
                     membership_end_date = ?
                 WHERE user_id = ?`,
                [membership_type, subscription.start_date, subscription.end_date, req.user.user_id]
            );

            // Create notification
            await conn.execute(
                `INSERT INTO notifications (user_id, type, title, message)
                 VALUES (?, 'system', 'ชำระเงินสำเร็จ', 'การชำระเงินของคุณเสร็จสมบูรณ์ ขอบคุณที่เป็นสมาชิก ${membership_type.toUpperCase()}')`,
                [req.user.user_id]
            );
        });

        res.json({
            success: true,
            message: 'Payment confirmed successfully'
        });
    } catch (error) {
        console.error('Confirm payment error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to confirm payment'
        });
    }
});

// ===================================
// GET /api/payments/history - ประวัติการชำระเงิน
// ===================================
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;

        const payments = await query(
            `SELECT pt.*, ps.plan_name, ps.plan_type
             FROM payment_transactions pt
             LEFT JOIN premium_subscriptions ps ON pt.subscription_id = ps.subscription_id
             WHERE pt.user_id = ?
             ORDER BY pt.created_at DESC
             LIMIT ? OFFSET ?`,
            [req.user.user_id, parseInt(limit), parseInt(offset)]
        );

        res.json({
            success: true,
            payments
        });
    } catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get payment history'
        });
    }
});

// ===================================
// POST /api/payments/webhook/promptpay - PromptPay Webhook
// ===================================
router.post('/webhook/promptpay', async (req, res) => {
    try {
        // Verify webhook signature
        const signature = req.headers['x-webhook-signature'];
        // TODO: Implement signature verification

        const { transaction_id, status, reference_id } = req.body;

        if (status === 'success') {
            await transaction(async (conn) => {
                // Update transaction
                await conn.execute(
                    `UPDATE payment_transactions 
                     SET status = 'completed', gateway_transaction_id = ?
                     WHERE transaction_id = ?`,
                    [reference_id, transaction_id]
                );

                // Get transaction details
                const [transactions] = await conn.execute(
                    'SELECT * FROM payment_transactions WHERE transaction_id = ?',
                    [transaction_id]
                );

                if (transactions.length > 0) {
                    const txn = transactions[0];

                    // Update subscription
                    await conn.execute(
                        `UPDATE premium_subscriptions 
                         SET status = 'active', payment_date = NOW()
                         WHERE subscription_id = ?`,
                        [txn.subscription_id]
                    );

                    // Update user membership
                    const [subscriptions] = await conn.execute(
                        'SELECT * FROM premium_subscriptions WHERE subscription_id = ?',
                        [txn.subscription_id]
                    );

                    if (subscriptions.length > 0) {
                        const subscription = subscriptions[0];
                        const membership_type = subscription.plan_name.toLowerCase().includes('vip') ? 'vip' : 'premium';

                        await conn.execute(
                            `UPDATE users 
                             SET membership_type = ?,
                                 membership_start_date = ?,
                                 membership_end_date = ?
                             WHERE user_id = ?`,
                            [membership_type, subscription.start_date, subscription.end_date, txn.user_id]
                        );
                    }
                }
            });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('PromptPay webhook error:', error);
        res.status(500).json({ success: false });
    }
});

// ===================================
// Helper Functions
// ===================================

// Generate PromptPay QR Code
async function generatePromptPayQR(transaction_id, amount) {
    // PromptPay ID (เบอร์โทรหรือ Tax ID)
    const promptpayId = process.env.PROMPTPAY_ID || '0812345678';
    
    // Generate QR Code data
    // ในการใช้งานจริง ควรใช้ library สำหรับสร้าง PromptPay QR
    const qrData = {
        promptpay_id: promptpayId,
        amount: amount,
        reference: `TXN${transaction_id}`,
        qr_code_url: `https://promptpay.io/${promptpayId}/${amount}.png`
    };

    return qrData;
}

// Generate Stripe Payment Intent
async function generateStripePayment(transaction_id, amount) {
    // ในการใช้งานจริง ต้องติดตั้ง stripe package
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    // สำหรับตัวอย่าง
    const paymentIntent = {
        client_secret: `pi_${crypto.randomBytes(16).toString('hex')}`,
        publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
        amount: amount * 100, // Stripe uses cents
        currency: 'thb'
    };

    return paymentIntent;
}

// Generate Bank Transfer Details
function generateBankTransferDetails(transaction_id) {
    return {
        bank_name: 'ธนาคารกสิกรไทย',
        account_number: '123-4-56789-0',
        account_name: 'MapNexus Co., Ltd.',
        reference: `TXN${transaction_id}`,
        instructions: [
            '1. โอนเงินไปยังบัญชีที่ระบุ',
            '2. ใส่เลขอ้างอิง (Reference) ในช่องหมายเหตุ',
            '3. ถ่ายรูปสลิปการโอนเงิน',
            '4. อัพโหลดสลิปในหน้ายืนยันการชำระเงิน'
        ]
    };
}

module.exports = router;
