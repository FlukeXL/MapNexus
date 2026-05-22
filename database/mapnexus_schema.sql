-- ===================================
-- MapNexus Database Schema
-- ฐานข้อมูลสำหรับระบบท่องเที่ยวนครพนม
-- สำหรับใช้กับ HibiSQL
-- ===================================

-- ลบฐานข้อมูลเก่า (ถ้ามี)
DROP DATABASE IF EXISTS mapnexus;
CREATE DATABASE mapnexus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mapnexus;

-- ===================================
-- 1. ตาราง Users - ข้อมูลผู้ใช้งาน
-- ===================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    profile_image VARCHAR(255),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    
    -- ข้อมูลสมาชิก
    membership_type ENUM('free', 'premium', 'vip') DEFAULT 'free',
    membership_start_date DATETIME,
    membership_end_date DATETIME,
    
    -- สถานะบัญชี
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires DATETIME,
    
    -- ข้อมูลการใช้งาน
    last_login DATETIME,
    login_count INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_membership (membership_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 2. ตาราง Premium Subscriptions - การสมัครสมาชิกพรีเมี่ยม
-- ===================================
CREATE TABLE premium_subscriptions (
    subscription_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    
    -- ข้อมูลแพ็กเกจ
    plan_type ENUM('monthly', 'quarterly', 'yearly') NOT NULL,
    plan_name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    
    -- วันที่
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    
    -- สถานะ
    status ENUM('active', 'expired', 'cancelled', 'pending') DEFAULT 'pending',
    auto_renew BOOLEAN DEFAULT FALSE,
    
    -- ข้อมูลการชำระเงิน
    payment_method ENUM('credit_card', 'promptpay', 'bank_transfer', 'paypal') NOT NULL,
    transaction_id VARCHAR(100),
    payment_date DATETIME,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_subscription (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 3. ตาราง Places - สถานที่ท่องเที่ยว
-- ===================================
CREATE TABLE places (
    place_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    category ENUM('temple', 'cafe', 'hotel', 'restaurant', 'attraction', 'shopping', 'nature') NOT NULL,
    
    -- รายละเอียด
    description TEXT,
    description_en TEXT,
    
    -- ที่อยู่
    address TEXT,
    district VARCHAR(100),
    province VARCHAR(100) DEFAULT 'นครพนม',
    postal_code VARCHAR(10),
    
    -- พิกัด
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- ข้อมูลติดต่อ
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    facebook VARCHAR(255),
    line_id VARCHAR(100),
    
    -- เวลาทำการ
    opening_hours JSON,
    
    -- ราคา
    price_range ENUM('free', 'budget', 'moderate', 'expensive', 'luxury'),
    average_price DECIMAL(10, 2),
    
    -- รูปภาพ
    main_image VARCHAR(255),
    images JSON,
    
    -- คะแนนและรีวิว
    rating DECIMAL(3, 2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    
    -- สถานะ
    is_active BOOLEAN DEFAULT TRUE,
    is_premium BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- SEO
    slug VARCHAR(255) UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_rating (rating),
    INDEX idx_slug (slug),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 4. ตาราง Check-ins - การเช็คอิน
-- ===================================
CREATE TABLE checkins (
    checkin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    place_id INT NOT NULL,
    
    -- ข้อมูลเช็คอิน
    checkin_date DATETIME NOT NULL,
    comment TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    
    -- รูปภาพ
    images JSON,
    
    -- พิกัดเช็คอิน
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- สถานะ
    is_public BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE,
    INDEX idx_user_checkin (user_id),
    INDEX idx_place_checkin (place_id),
    INDEX idx_checkin_date (checkin_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 5. ตาราง Reviews - รีวิวสถานที่
-- ===================================
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    place_id INT NOT NULL,
    
    -- รีวิว
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT NOT NULL,
    
    -- รูปภาพ
    images JSON,
    
    -- คะแนนย่อย
    cleanliness_rating INT CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    service_rating INT CHECK (service_rating >= 1 AND service_rating <= 5),
    value_rating INT CHECK (value_rating >= 1 AND value_rating <= 5),
    
    -- สถานะ
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    
    -- การโต้ตอบ
    helpful_count INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE,
    INDEX idx_user_review (user_id),
    INDEX idx_place_review (place_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 6. ตาราง Favorites - สถานที่โปรด
-- ===================================
CREATE TABLE favorites (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    place_id INT NOT NULL,
    
    -- หมวดหมู่ (ผู้ใช้สามารถจัดกลุ่มได้)
    category VARCHAR(50) DEFAULT 'general',
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, place_id),
    INDEX idx_user_favorite (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 7. ตาราง Events - กิจกรรมและเทศกาล
-- ===================================
CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    place_id INT,
    
    -- ข้อมูลกิจกรรม
    name VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    description TEXT,
    
    -- วันที่
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    
    -- ที่อยู่
    location VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- รูปภาพ
    main_image VARCHAR(255),
    images JSON,
    
    -- ราคา
    is_free BOOLEAN DEFAULT TRUE,
    ticket_price DECIMAL(10, 2),
    
    -- ข้อมูลติดต่อ
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    website VARCHAR(255),
    
    -- สถานะ
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE SET NULL,
    INDEX idx_event_date (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 8. ตาราง Weather Data - ข้อมูลสภาพอากาศ
-- ===================================
CREATE TABLE weather_data (
    weather_id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- ข้อมูลสภาพอากาศ
    date DATE NOT NULL,
    temperature DECIMAL(5, 2),
    humidity INT,
    weather_condition VARCHAR(50),
    wind_speed DECIMAL(5, 2),
    
    -- PM2.5
    pm25_value INT,
    pm25_status ENUM('good', 'moderate', 'unhealthy_sensitive', 'unhealthy', 'very_unhealthy', 'hazardous'),
    
    -- AQI
    aqi_value INT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 9. ตาราง Traffic Data - ข้อมูลการจราจร
-- ===================================
CREATE TABLE traffic_data (
    traffic_id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- ข้อมูลการจราจร
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- สถานะ
    status ENUM('smooth', 'moderate', 'heavy', 'congested') NOT NULL,
    average_speed DECIMAL(5, 2),
    
    -- เวลา
    recorded_at DATETIME NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_location (location),
    INDEX idx_recorded_at (recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 10. ตาราง Notifications - การแจ้งเตือน
-- ===================================
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    
    -- ข้อมูลการแจ้งเตือน
    type ENUM('checkin', 'review', 'event', 'promotion', 'system') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- ลิงก์
    link VARCHAR(255),
    
    -- สถานะ
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_notification (user_id),
    INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 11. ตาราง Payment Transactions - ประวัติการชำระเงิน
-- ===================================
CREATE TABLE payment_transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subscription_id INT,
    
    -- ข้อมูลการชำระเงิน
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'THB',
    payment_method ENUM('credit_card', 'promptpay', 'bank_transfer', 'paypal') NOT NULL,
    
    -- สถานะ
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    
    -- ข้อมูลเพิ่มเติม
    payment_gateway VARCHAR(50),
    gateway_transaction_id VARCHAR(100),
    payment_details JSON,
    
    -- หมายเหตุ
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES premium_subscriptions(subscription_id) ON DELETE SET NULL,
    INDEX idx_user_transaction (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 12. ตาราง Activity Logs - บันทึกกิจกรรม
-- ===================================
CREATE TABLE activity_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    
    -- ข้อมูลกิจกรรม
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    
    -- รายละเอียด
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user_log (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 13. ตาราง Premium Features - คุณสมบัติพรีเมี่ยม
-- ===================================
CREATE TABLE premium_features (
    feature_id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- ข้อมูลฟีเจอร์
    feature_name VARCHAR(100) NOT NULL,
    feature_key VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- ระดับสมาชิก
    required_membership ENUM('free', 'premium', 'vip') NOT NULL,
    
    -- สถานะ
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 14. ตาราง User Sessions - เซสชันผู้ใช้
-- ===================================
CREATE TABLE user_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    
    -- ข้อมูลเซสชัน
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- เวลา
    expires_at DATETIME NOT NULL,
    last_activity DATETIME,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_session (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- INSERT ข้อมูลตัวอย่าง
-- ===================================

-- Premium Features
INSERT INTO premium_features (feature_name, feature_key, description, required_membership) VALUES
('ดูสถานที่ไม่จำกัด', 'unlimited_places', 'ดูข้อมูลสถานที่ท่องเที่ยวได้ไม่จำกัด', 'premium'),
('บันทึกสถานที่โปรดไม่จำกัด', 'unlimited_favorites', 'บันทึกสถานที่โปรดได้ไม่จำกัด', 'premium'),
('ดาวน์โหลดแผนที่ออฟไลน์', 'offline_maps', 'ดาวน์โหลดแผนที่ใช้งานแบบออฟไลน์', 'premium'),
('ไม่มีโฆษณา', 'ad_free', 'ใช้งานแอปโดยไม่มีโฆษณารบกวน', 'premium'),
('แผนการเดินทางส่วนตัว', 'custom_itinerary', 'สร้างแผนการเดินทางส่วนตัวได้', 'premium'),
('ส่วนลดพิเศษ', 'exclusive_discounts', 'รับส่วนลดพิเศษจากร้านค้าพันธมิตร', 'vip'),
('บริการ Concierge', 'concierge_service', 'บริการช่วยเหลือส่วนตัว 24/7', 'vip'),
('จองล่วงหน้าพิเศษ', 'priority_booking', 'จองสถานที่ได้ก่อนใคร', 'vip');

-- ===================================
-- VIEWS - มุมมองข้อมูล
-- ===================================

-- View: Active Premium Users
CREATE VIEW active_premium_users AS
SELECT 
    u.user_id,
    u.username,
    u.email,
    u.full_name,
    u.membership_type,
    u.membership_end_date,
    ps.plan_type,
    ps.status
FROM users u
LEFT JOIN premium_subscriptions ps ON u.user_id = ps.user_id
WHERE u.membership_type IN ('premium', 'vip')
AND u.is_active = TRUE
AND ps.status = 'active';

-- View: Popular Places
CREATE VIEW popular_places AS
SELECT 
    p.place_id,
    p.name,
    p.category,
    p.rating,
    p.review_count,
    COUNT(DISTINCT c.checkin_id) as checkin_count,
    COUNT(DISTINCT f.favorite_id) as favorite_count
FROM places p
LEFT JOIN checkins c ON p.place_id = c.place_id
LEFT JOIN favorites f ON p.place_id = f.place_id
WHERE p.is_active = TRUE
GROUP BY p.place_id
ORDER BY p.rating DESC, p.review_count DESC;

-- View: User Statistics
CREATE VIEW user_statistics AS
SELECT 
    u.user_id,
    u.username,
    u.membership_type,
    COUNT(DISTINCT c.checkin_id) as total_checkins,
    COUNT(DISTINCT r.review_id) as total_reviews,
    COUNT(DISTINCT f.favorite_id) as total_favorites,
    u.created_at as member_since
FROM users u
LEFT JOIN checkins c ON u.user_id = c.user_id
LEFT JOIN reviews r ON u.user_id = r.user_id
LEFT JOIN favorites f ON u.user_id = f.user_id
GROUP BY u.user_id;

-- ===================================
-- STORED PROCEDURES
-- ===================================

DELIMITER //

-- Procedure: Update Place Rating
CREATE PROCEDURE update_place_rating(IN p_place_id INT)
BEGIN
    UPDATE places
    SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE place_id = p_place_id
        AND is_approved = TRUE
    ),
    review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE place_id = p_place_id
        AND is_approved = TRUE
    )
    WHERE place_id = p_place_id;
END //

-- Procedure: Check Membership Expiry
CREATE PROCEDURE check_membership_expiry()
BEGIN
    UPDATE users
    SET membership_type = 'free'
    WHERE membership_end_date < NOW()
    AND membership_type IN ('premium', 'vip');
    
    UPDATE premium_subscriptions
    SET status = 'expired'
    WHERE end_date < NOW()
    AND status = 'active';
END //

DELIMITER ;

-- ===================================
-- TRIGGERS
-- ===================================

DELIMITER //

-- Trigger: After Review Insert - Update Place Rating
CREATE TRIGGER after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    CALL update_place_rating(NEW.place_id);
END //

-- Trigger: After Review Update - Update Place Rating
CREATE TRIGGER after_review_update
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    CALL update_place_rating(NEW.place_id);
END //

-- Trigger: After Review Delete - Update Place Rating
CREATE TRIGGER after_review_delete
AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    CALL update_place_rating(OLD.place_id);
END //

DELIMITER ;

-- ===================================
-- INDEXES สำหรับประสิทธิภาพ
-- ===================================

-- เพิ่ม Full-Text Search Index
ALTER TABLE places ADD FULLTEXT INDEX ft_place_search (name, description);
ALTER TABLE events ADD FULLTEXT INDEX ft_event_search (name, description);

-- ===================================
-- สิ้นสุดการสร้างฐานข้อมูล
-- ===================================

SELECT 'MapNexus Database Schema Created Successfully!' as Status;
