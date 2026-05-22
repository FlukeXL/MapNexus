// ===================================
// MapNexus Database Connection Example
// ตัวอย่างการเชื่อมต่อฐานข้อมูลด้วย Node.js
// ===================================

// ===================================
// 1. ติดตั้ง Dependencies
// ===================================
// npm install mysql2 dotenv bcrypt jsonwebtoken

// ===================================
// 2. สร้างไฟล์ .env
// ===================================
/*
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=mapnexus
JWT_SECRET=your_jwt_secret_key_here
*/

// ===================================
// 3. Database Connection
// ===================================

require('dotenv').config();
const mysql = require('mysql2/promise');

// สร้าง Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'mapnexus',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// ทดสอบการเชื่อมต่อ
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully!');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// ===================================
// 4. ตัวอย่าง CRUD Operations
// ===================================

// === USER OPERATIONS ===

// สร้างผู้ใช้ใหม่
async function createUser(userData) {
    const bcrypt = require('bcrypt');
    const { username, email, password, full_name, phone } = userData;
    
    try {
        // Hash password
        const password_hash = await bcrypt.hash(password, 10);
        
        const [result] = await pool.execute(
            `INSERT INTO users (username, email, password_hash, full_name, phone) 
             VALUES (?, ?, ?, ?, ?)`,
            [username, email, password_hash, full_name, phone]
        );
        
        return {
            success: true,
            user_id: result.insertId,
            message: 'User created successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// ตรวจสอบ Login
async function loginUser(email, password) {
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    
    try {
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
            [email]
        );
        
        if (users.length === 0) {
            return { success: false, message: 'User not found' };
        }
        
        const user = users[0];
        
        // ตรวจสอบรหัสผ่าน
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
            return { success: false, message: 'Invalid password' };
        }
        
        // อัพเดทข้อมูลการ login
        await pool.execute(
            'UPDATE users SET last_login = NOW(), login_count = login_count + 1 WHERE user_id = ?',
            [user.user_id]
        );
        
        // สร้าง JWT Token
        const token = jwt.sign(
            { 
                user_id: user.user_id, 
                email: user.email,
                membership_type: user.membership_type 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        return {
            success: true,
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                membership_type: user.membership_type
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// ดูข้อมูลผู้ใช้
async function getUserById(user_id) {
    try {
        const [users] = await pool.execute(
            `SELECT user_id, username, email, full_name, phone, profile_image, 
                    membership_type, membership_end_date, created_at
             FROM users WHERE user_id = ?`,
            [user_id]
        );
        
        if (users.length === 0) {
            return { success: false, message: 'User not found' };
        }
        
        return { success: true, user: users[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// === PLACE OPERATIONS ===

// ดูสถานที่ทั้งหมด
async function getAllPlaces(category = null, limit = 20, offset = 0) {
    try {
        let query = `
            SELECT place_id, name, category, description, address, district,
                   latitude, longitude, phone, main_image, rating, review_count,
                   price_range, average_price
            FROM places 
            WHERE is_active = TRUE
        `;
        
        const params = [];
        
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        
        query += ' ORDER BY rating DESC, review_count DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);
        
        const [places] = await pool.execute(query, params);
        
        return { success: true, places, count: places.length };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// ค้นหาสถานที่
async function searchPlaces(keyword) {
    try {
        const [places] = await pool.execute(
            `SELECT place_id, name, category, description, address, 
                    main_image, rating, review_count
             FROM places 
             WHERE is_active = TRUE 
             AND (name LIKE ? OR description LIKE ?)
             ORDER BY rating DESC
             LIMIT 20`,
            [`%${keyword}%`, `%${keyword}%`]
        );
        
        return { success: true, places, count: places.length };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// ดูรายละเอียดสถานที่
async function getPlaceById(place_id) {
    try {
        const [places] = await pool.execute(
            'SELECT * FROM places WHERE place_id = ? AND is_active = TRUE',
            [place_id]
        );
        
        if (places.length === 0) {
            return { success: false, message: 'Place not found' };
        }
        
        // ดูรีวิวล่าสุด
        const [reviews] = await pool.execute(
            `SELECT r.*, u.username, u.profile_image
             FROM reviews r
             JOIN users u ON r.user_id = u.user_id
             WHERE r.place_id = ? AND r.is_approved = TRUE
             ORDER BY r.created_at DESC
             LIMIT 5`,
            [place_id]
        );
        
        return {
            success: true,
            place: places[0],
            recent_reviews: reviews
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// === CHECK-IN OPERATIONS ===

// เช็คอิน
async function createCheckin(user_id, place_id, data) {
    const { comment, rating, latitude, longitude, images } = data;
    
    try {
        const [result] = await pool.execute(
            `INSERT INTO checkins (user_id, place_id, checkin_date, comment, rating, latitude, longitude, images)
             VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)`,
            [user_id, place_id, comment, rating, latitude, longitude, JSON.stringify(images)]
        );
        
        return {
            success: true,
            checkin_id: result.insertId,
            message: 'Check-in successful'
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// ดูประวัติเช็คอิน
async function getUserCheckins(user_id, limit = 20) {
    try {
        const [checkins] = await pool.execute(
            `SELECT c.*, p.name as place_name, p.main_image, p.category
             FROM checkins c
             JOIN places p ON c.place_id = p.place_id
             WHERE c.user_id = ?
             ORDER BY c.checkin_date DESC
             LIMIT ?`,
            [user_id, limit]
        );
        
        return { success: true, checkins };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// === REVIEW OPERATIONS ===

// เขียนรีวิว
async function createReview(user_id, place_id, reviewData) {
    const { rating, title, content, images, cleanliness_rating, service_rating, value_rating } = reviewData;
    
    try {
        const [result] = await pool.execute(
            `INSERT INTO reviews (user_id, place_id, rating, title, content, images, 
                                  cleanliness_rating, service_rating, value_rating)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, place_id, rating, title, content, JSON.stringify(images),
             cleanliness_rating, service_rating, value_rating]
        );
        
        return {
            success: true,
            review_id: result.insertId,
            message: 'Review created successfully'
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// === FAVORITE OPERATIONS ===

// เพิ่มสถานที่โปรด
async function addFavorite(user_id, place_id, category = 'general', notes = null) {
    try {
        const [result] = await pool.execute(
            'INSERT INTO favorites (user_id, place_id, category, notes) VALUES (?, ?, ?, ?)',
            [user_id, place_id, category, notes]
        );
        
        return {
            success: true,
            favorite_id: result.insertId,
            message: 'Added to favorites'
        };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'Already in favorites' };
        }
        return { success: false, message: error.message };
    }
}

// ลบสถานที่โปรด
async function removeFavorite(user_id, place_id) {
    try {
        const [result] = await pool.execute(
            'DELETE FROM favorites WHERE user_id = ? AND place_id = ?',
            [user_id, place_id]
        );
        
        if (result.affectedRows === 0) {
            return { success: false, message: 'Favorite not found' };
        }
        
        return { success: true, message: 'Removed from favorites' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// ดูสถานที่โปรดทั้งหมด
async function getUserFavorites(user_id) {
    try {
        const [favorites] = await pool.execute(
            `SELECT f.*, p.name, p.category, p.main_image, p.rating, p.address
             FROM favorites f
             JOIN places p ON f.place_id = p.place_id
             WHERE f.user_id = ?
             ORDER BY f.created_at DESC`,
            [user_id]
        );
        
        return { success: true, favorites };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// === PREMIUM SUBSCRIPTION OPERATIONS ===

// สร้างการสมัครสมาชิก
async function createSubscription(user_id, subscriptionData) {
    const { plan_type, plan_name, price, payment_method } = subscriptionData;
    
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // คำนวณวันหมดอายุ
        let duration;
        switch (plan_type) {
            case 'monthly': duration = 1; break;
            case 'quarterly': duration = 3; break;
            case 'yearly': duration = 12; break;
            default: duration = 1;
        }
        
        // สร้าง subscription
        const [subResult] = await connection.execute(
            `INSERT INTO premium_subscriptions 
             (user_id, plan_type, plan_name, price, start_date, end_date, status, payment_method)
             VALUES (?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? MONTH), 'pending', ?)`,
            [user_id, plan_type, plan_name, price, duration, payment_method]
        );
        
        // สร้าง transaction
        await connection.execute(
            `INSERT INTO payment_transactions 
             (user_id, subscription_id, amount, payment_method, status)
             VALUES (?, ?, ?, ?, 'pending')`,
            [user_id, subResult.insertId, price, payment_method]
        );
        
        await connection.commit();
        
        return {
            success: true,
            subscription_id: subResult.insertId,
            message: 'Subscription created, awaiting payment'
        };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
}

// อัพเดทสถานะการชำระเงิน
async function confirmPayment(subscription_id, transaction_id) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // อัพเดท subscription
        await connection.execute(
            `UPDATE premium_subscriptions 
             SET status = 'active', transaction_id = ?, payment_date = NOW()
             WHERE subscription_id = ?`,
            [transaction_id, subscription_id]
        );
        
        // อัพเดท user membership
        const [subscription] = await connection.execute(
            'SELECT user_id, end_date, plan_name FROM premium_subscriptions WHERE subscription_id = ?',
            [subscription_id]
        );
        
        if (subscription.length > 0) {
            const membership_type = subscription[0].plan_name.includes('VIP') ? 'vip' : 'premium';
            
            await connection.execute(
                `UPDATE users 
                 SET membership_type = ?, membership_start_date = NOW(), membership_end_date = ?
                 WHERE user_id = ?`,
                [membership_type, subscription[0].end_date, subscription[0].user_id]
            );
        }
        
        // อัพเดท transaction
        await connection.execute(
            `UPDATE payment_transactions 
             SET status = 'completed', gateway_transaction_id = ?
             WHERE subscription_id = ?`,
            [transaction_id, subscription_id]
        );
        
        await connection.commit();
        
        return { success: true, message: 'Payment confirmed successfully' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
}

// === STATISTICS ===

// สถิติผู้ใช้
async function getUserStats(user_id) {
    try {
        const [stats] = await pool.execute(
            'SELECT * FROM user_statistics WHERE user_id = ?',
            [user_id]
        );
        
        return { success: true, stats: stats[0] || {} };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// ===================================
// Export Functions
// ===================================

module.exports = {
    pool,
    testConnection,
    
    // User
    createUser,
    loginUser,
    getUserById,
    
    // Places
    getAllPlaces,
    searchPlaces,
    getPlaceById,
    
    // Check-ins
    createCheckin,
    getUserCheckins,
    
    // Reviews
    createReview,
    
    // Favorites
    addFavorite,
    removeFavorite,
    getUserFavorites,
    
    // Subscriptions
    createSubscription,
    confirmPayment,
    
    // Statistics
    getUserStats
};

// ===================================
// ตัวอย่างการใช้งาน
// ===================================

/*
// Import
const db = require('./database/connection_example');

// ทดสอบการเชื่อมต่อ
await db.testConnection();

// สร้างผู้ใช้ใหม่
const newUser = await db.createUser({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    full_name: 'Test User',
    phone: '0812345678'
});

// Login
const loginResult = await db.loginUser('test@example.com', 'password123');

// ดูสถานที่ทั้งหมด
const places = await db.getAllPlaces('cafe', 10, 0);

// เช็คอิน
const checkin = await db.createCheckin(1, 1, {
    comment: 'สถานที่สวยมาก',
    rating: 5,
    latitude: 17.4100,
    longitude: 104.7900
});
*/
