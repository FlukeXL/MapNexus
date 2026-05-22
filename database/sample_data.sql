-- ===================================
-- MapNexus Sample Data
-- ข้อมูลตัวอย่างสำหรับทดสอบระบบ
-- ===================================

USE mapnexus;

-- ===================================
-- ข้อมูลผู้ใช้ตัวอย่าง
-- ===================================

-- User 1: Free Member
INSERT INTO users (username, email, password_hash, full_name, phone, membership_type, is_verified, is_active) VALUES
('john_doe', 'john@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456789', 'John Doe', '0812345678', 'free', TRUE, TRUE);

-- User 2: Premium Member
INSERT INTO users (username, email, password_hash, full_name, phone, membership_type, membership_start_date, membership_end_date, is_verified, is_active) VALUES
('jane_premium', 'jane@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456789', 'Jane Smith', '0823456789', 'premium', NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), TRUE, TRUE);

-- User 3: VIP Member
INSERT INTO users (username, email, password_hash, full_name, phone, membership_type, membership_start_date, membership_end_date, is_verified, is_active) VALUES
('vip_traveler', 'vip@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456789', 'VIP Traveler', '0834567890', 'vip', NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR), TRUE, TRUE);

-- ===================================
-- ข้อมูล Premium Subscriptions
-- ===================================

INSERT INTO premium_subscriptions (user_id, plan_type, plan_name, price, start_date, end_date, status, payment_method, transaction_id, payment_date) VALUES
(2, 'monthly', 'Premium Monthly', 99.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), 'active', 'credit_card', 'TXN001234567', NOW()),
(3, 'yearly', 'VIP Yearly', 999.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR), 'active', 'promptpay', 'TXN001234568', NOW());

-- ===================================
-- ข้อมูลสถานที่ท่องเที่ยว
-- ===================================

-- วัด
INSERT INTO places (name, name_en, category, description, address, district, latitude, longitude, phone, opening_hours, price_range, main_image, rating, review_count, is_active, slug) VALUES
('พระธาตุพนม', 'Phra That Phanom', 'temple', 'พระธาตุศักดิ์สิทธิ์คู่บ้านคู่เมืองนครพนม อายุกว่า 2,000 ปี', '123 ถนนพระธาตุพนม', 'ธาตุพนม', 17.0000, 104.7000, '042-540-001', '{"monday": "06:00-18:00", "tuesday": "06:00-18:00", "wednesday": "06:00-18:00", "thursday": "06:00-18:00", "friday": "06:00-18:00", "saturday": "06:00-18:00", "sunday": "06:00-18:00"}', 'free', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80', 4.9, 2500, TRUE, 'phra-that-phanom'),

('วัดโพธิ์ชัย', 'Wat Pho Chai', 'temple', 'วัดเก่าแก่ริมแม่น้ำโขง สถาปัตยกรรมผสมผสานไทย-ลาว', '456 ถนนสุนทรวิจิตร', 'เมืองนครพนม', 17.4000, 104.7800, '042-511-234', '{"monday": "06:00-18:00", "tuesday": "06:00-18:00", "wednesday": "06:00-18:00", "thursday": "06:00-18:00", "friday": "06:00-18:00", "saturday": "06:00-18:00", "sunday": "06:00-18:00"}', 'free', 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80', 4.7, 850, TRUE, 'wat-pho-chai');

-- คาเฟ่
INSERT INTO places (name, name_en, category, description, address, district, latitude, longitude, phone, opening_hours, price_range, average_price, main_image, rating, review_count, is_active, slug) VALUES
('Mekong Riverside Café', 'Mekong Riverside Café', 'cafe', 'คาเฟ่ริมโขง บรรยากาศสบายๆ วิวสวยงาม', '789 ถนนริมโขง', 'เมืองนครพนม', 17.4100, 104.7900, '042-522-345', '{"monday": "08:00-20:00", "tuesday": "08:00-20:00", "wednesday": "08:00-20:00", "thursday": "08:00-20:00", "friday": "08:00-22:00", "saturday": "08:00-22:00", "sunday": "08:00-22:00"}', 'moderate', 150.00, 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', 4.8, 1200, TRUE, 'mekong-riverside-cafe'),

('Sunset View Coffee', 'Sunset View Coffee', 'cafe', 'ชมพระอาทิตย์ตกพร้อมกาแฟหอมกรุ่น', '321 ถนนนิตโย', 'เมืองนครพนม', 17.4050, 104.7850, '042-533-456', '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-22:00", "saturday": "09:00-22:00", "sunday": "09:00-22:00"}', 'moderate', 120.00, 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80', 4.7, 980, TRUE, 'sunset-view-coffee');

-- โรงแรม
INSERT INTO places (name, name_en, category, description, address, district, latitude, longitude, phone, email, website, opening_hours, price_range, average_price, main_image, rating, review_count, is_active, slug) VALUES
('The River Hotel Nakhon Phanom', 'The River Hotel Nakhon Phanom', 'hotel', 'โรงแรมหรูริมโขง วิวสวยงาม ห้องพักสะดวกสบาย', '555 ถนนสุนทรวิจิตร', 'เมืองนครพนม', 17.4120, 104.7820, '042-544-567', 'info@riverhotel.com', 'https://riverhotel.com', '{"monday": "00:00-23:59", "tuesday": "00:00-23:59", "wednesday": "00:00-23:59", "thursday": "00:00-23:59", "friday": "00:00-23:59", "saturday": "00:00-23:59", "sunday": "00:00-23:59"}', 'expensive', 3500.00, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', 4.8, 2100, TRUE, 'the-river-hotel-nakhon-phanom'),

('Grand View Hotel', 'Grand View Hotel', 'hotel', 'โรงแรมใจกลางเมือง สะดวกสบาย ใกล้แหล่งท่องเที่ยว', '888 ถนนบำรุงเมือง', 'เมืองนครพนม', 17.4080, 104.7780, '042-555-678', 'contact@grandview.com', 'https://grandview.com', '{"monday": "00:00-23:59", "tuesday": "00:00-23:59", "wednesday": "00:00-23:59", "thursday": "00:00-23:59", "friday": "00:00-23:59", "saturday": "00:00-23:59", "sunday": "00:00-23:59"}', 'moderate', 2500.00, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80', 4.6, 1500, TRUE, 'grand-view-hotel');

-- ===================================
-- ข้อมูล Check-ins
-- ===================================

INSERT INTO checkins (user_id, place_id, checkin_date, comment, rating, latitude, longitude, is_public) VALUES
(1, 1, NOW(), 'สถานที่สวยงามมาก บรรยากาศดี', 5, 17.0000, 104.7000, TRUE),
(2, 3, DATE_SUB(NOW(), INTERVAL 1 DAY), 'กาแฟอร่อย วิวสวย แนะนำเลย', 5, 17.4100, 104.7900, TRUE),
(3, 5, DATE_SUB(NOW(), INTERVAL 2 DAY), 'โรงแรมดีมาก บริการเยี่ยม', 5, 17.4120, 104.7820, TRUE);

-- ===================================
-- ข้อมูล Reviews
-- ===================================

INSERT INTO reviews (user_id, place_id, rating, title, content, cleanliness_rating, service_rating, value_rating, is_verified, is_approved) VALUES
(1, 1, 5, 'สถานที่ศักดิ์สิทธิ์', 'พระธาตุพนมเป็นสถานที่ที่สวยงามและศักดิ์สิทธิ์มาก บรรยากาศดี เหมาะกับการมาสักการะ', 5, 5, 5, TRUE, TRUE),
(2, 3, 5, 'คาเฟ่ริมโขงที่ดีที่สุด', 'บรรยากาศดีมาก กาแฟอร่อย วิวสวย พนักงานบริการดี ราคาไม่แพง', 5, 5, 5, TRUE, TRUE),
(3, 5, 5, 'โรงแรมระดับ 5 ดาว', 'ห้องพักสะอาด วิวสวยงาม บริการเยี่ยม อาหารเช้าอร่อย คุ้มค่ากับราคา', 5, 5, 4, TRUE, TRUE),
(1, 2, 4, 'วัดสวยงาม', 'วัดเก่าแก่ สถาปัตยกรรมสวย เหมาะกับการมาเที่ยวชม', 4, 4, 5, TRUE, TRUE);

-- ===================================
-- ข้อมูล Favorites
-- ===================================

INSERT INTO favorites (user_id, place_id, category, notes) VALUES
(1, 1, 'must_visit', 'ต้องมาอีกครั้ง'),
(1, 3, 'cafe', 'คาเฟ่โปรด'),
(2, 5, 'hotel', 'โรงแรมที่ชอบ'),
(3, 1, 'temple', 'วัดศักดิ์สิทธิ์');

-- ===================================
-- ข้อมูล Events
-- ===================================

INSERT INTO events (place_id, name, name_en, description, start_date, end_date, location, latitude, longitude, is_free, is_active, is_featured) VALUES
(1, 'งานบุญพระธาตุพนม', 'Phra That Phanom Festival', 'งานประเพณีประจำปีที่ยิ่งใหญ่ที่สุดของนครพนม', '2026-02-01 08:00:00', '2026-02-15 20:00:00', 'วัดพระธาตุพนม', 17.0000, 104.7000, TRUE, TRUE, TRUE),
(NULL, 'เทศกาลดนตริมโขง', 'Mekong Music Festival', 'เทศกาลดนตรีริมแม่น้ำโขง', '2026-03-15 18:00:00', '2026-03-17 23:00:00', 'ริมฝั่งแม่น้ำโขง', 17.4100, 104.7900, FALSE, TRUE, TRUE);

-- ===================================
-- ข้อมูล Weather Data
-- ===================================

INSERT INTO weather_data (date, temperature, humidity, weather_condition, wind_speed, pm25_value, pm25_status, aqi_value) VALUES
(CURDATE(), 28.5, 65, 'Partly Cloudy', 12.5, 32, 'good', 45),
(DATE_SUB(CURDATE(), INTERVAL 1 DAY), 29.0, 70, 'Sunny', 10.0, 28, 'good', 40),
(DATE_SUB(CURDATE(), INTERVAL 2 DAY), 27.5, 75, 'Cloudy', 15.0, 35, 'good', 48);

-- ===================================
-- ข้อมูล Traffic Data
-- ===================================

INSERT INTO traffic_data (location, latitude, longitude, status, average_speed, recorded_at) VALUES
('ถนนสุนทรวิจิตร', 17.4100, 104.7800, 'smooth', 45.5, NOW()),
('ถนนนิตโย', 17.4050, 104.7850, 'moderate', 35.0, NOW()),
('ถนนบำรุงเมือง', 17.4080, 104.7780, 'smooth', 50.0, NOW());

-- ===================================
-- ข้อมูล Notifications
-- ===================================

INSERT INTO notifications (user_id, type, title, message, link, is_read) VALUES
(1, 'event', 'งานบุญพระธาตุพนมใกล้เข้ามาแล้ว', 'งานบุญพระธาตุพนมจะจัดขึ้นในวันที่ 1-15 กุมภาพันธ์ 2026', '/events/1', FALSE),
(2, 'promotion', 'ส่วนลดพิเศษสำหรับสมาชิกพรีเมี่ยม', 'รับส่วนลด 20% ที่ร้านค้าพันธมิตร', '/promotions', FALSE),
(3, 'system', 'ยินดีต้อนรับสู่ MapNexus VIP', 'ขอบคุณที่เป็นสมาชิก VIP คุณจะได้รับสิทธิพิเศษมากมาย', '/profile', TRUE);

-- ===================================
-- ข้อมูล Payment Transactions
-- ===================================

INSERT INTO payment_transactions (user_id, subscription_id, amount, currency, payment_method, status, payment_gateway, gateway_transaction_id, payment_details) VALUES
(2, 1, 99.00, 'THB', 'credit_card', 'completed', 'Stripe', 'ch_1234567890', '{"card_last4": "4242", "card_brand": "Visa"}'),
(3, 2, 999.00, 'THB', 'promptpay', 'completed', 'PromptPay', 'pp_9876543210', '{"phone": "0834567890"}');

-- ===================================
-- ข้อมูล Activity Logs
-- ===================================

INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description, ip_address) VALUES
(1, 'login', 'user', 1, 'User logged in', '192.168.1.100'),
(2, 'checkin', 'place', 3, 'User checked in at Mekong Riverside Café', '192.168.1.101'),
(3, 'review', 'place', 5, 'User reviewed The River Hotel', '192.168.1.102'),
(1, 'favorite', 'place', 1, 'User added Phra That Phanom to favorites', '192.168.1.100');

-- ===================================
-- สิ้นสุดการเพิ่มข้อมูลตัวอย่าง
-- ===================================

SELECT 'Sample Data Inserted Successfully!' as Status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_places FROM places;
SELECT COUNT(*) as total_checkins FROM checkins;
SELECT COUNT(*) as total_reviews FROM reviews;
