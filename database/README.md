# MapNexus Database Documentation

## 📋 ภาพรวม

ฐานข้อมูล MapNexus ออกแบบมาสำหรับระบบท่องเที่ยวนครพนม รองรับการจัดการข้อมูลผู้ใช้, สถานที่ท่องเที่ยว, การเช็คอิน, รีวิว และระบบสมาชิกพรีเมี่ยม

## 🗄️ โครงสร้างฐานข้อมูล

### ตารางหลัก (Core Tables)

#### 1. **users** - ข้อมูลผู้ใช้งาน
- เก็บข้อมูลผู้ใช้ทั้งหมด
- รองรับ 3 ระดับสมาชิก: Free, Premium, VIP
- มีระบบยืนยันตัวตน (verification)
- ติดตามการเข้าใช้งาน (login tracking)

**คอลัมน์สำคัญ:**
- `user_id` - รหัสผู้ใช้ (Primary Key)
- `username` - ชื่อผู้ใช้ (Unique)
- `email` - อีเมล (Unique)
- `membership_type` - ประเภทสมาชิก (free/premium/vip)
- `membership_end_date` - วันหมดอายุสมาชิก

#### 2. **premium_subscriptions** - การสมัครสมาชิกพรีเมี่ยม
- เก็บประวัติการสมัครสมาชิก
- รองรับแพ็กเกจ: รายเดือน, รายไตรมาส, รายปี
- ติดตามสถานะการชำระเงิน

**แพ็กเกจที่แนะนำ:**
- **Monthly Premium**: 99 บาท/เดือน
- **Quarterly Premium**: 249 บาท/3 เดือน (ประหยัด 15%)
- **Yearly Premium**: 899 บาท/ปี (ประหยัด 25%)
- **Yearly VIP**: 1,999 บาท/ปี (สิทธิพิเศษเต็มรูปแบบ)

#### 3. **places** - สถานที่ท่องเที่ยว
- เก็บข้อมูลสถานที่ทุกประเภท
- รองรับหลายภาษา (ไทย/อังกฤษ)
- มีระบบคะแนนและรีวิว
- เก็บพิกัด GPS

**หมวดหมู่:**
- `temple` - วัดและศาสนสถาน
- `cafe` - คาเฟ่และร้านกาแฟ
- `hotel` - โรงแรมและที่พัก
- `restaurant` - ร้านอาหาร
- `attraction` - สถานที่ท่องเที่ยว
- `shopping` - ช้อปปิ้ง
- `nature` - ธรรมชาติ

#### 4. **checkins** - การเช็คอิน
- บันทึกการเช็คอินของผู้ใช้
- สามารถแนบรูปภาพและคอมเมนต์
- เก็บพิกัดเช็คอิน

#### 5. **reviews** - รีวิวสถานที่
- รีวิวแบบละเอียด พร้อมคะแนนย่อย
- ระบบอนุมัติรีวิว (moderation)
- นับจำนวนคนที่เห็นว่ามีประโยชน์

#### 6. **favorites** - สถานที่โปรด
- บันทึกสถานที่โปรดของผู้ใช้
- สามารถจัดหมวดหมู่ได้
- เพิ่มโน้ตส่วนตัว

### ตารางเสริม (Supporting Tables)

#### 7. **events** - กิจกรรมและเทศกาล
- เก็บข้อมูลกิจกรรมต่างๆ
- รองรับกิจกรรมฟรีและมีค่าใช้จ่าย

#### 8. **weather_data** - ข้อมูลสภาพอากาศ
- เก็บข้อมูลอุณหภูมิ, ความชื้น
- ข้อมูล PM2.5 และ AQI

#### 9. **traffic_data** - ข้อมูลการจราจร
- ติดตามสถานะการจราจร
- เก็บความเร็วเฉลี่ย

#### 10. **notifications** - การแจ้งเตือน
- แจ้งเตือนผู้ใช้เกี่ยวกับกิจกรรมต่างๆ
- ติดตามสถานะการอ่าน

#### 11. **payment_transactions** - ประวัติการชำระเงิน
- บันทึกทุกธุรกรรม
- รองรับหลายช่องทางชำระเงิน

#### 12. **activity_logs** - บันทึกกิจกรรม
- ติดตามการใช้งานของผู้ใช้
- เก็บ IP และ User Agent

#### 13. **premium_features** - คุณสมบัติพรีเมี่ยม
- กำหนดฟีเจอร์สำหรับแต่ละระดับสมาชิก

#### 14. **user_sessions** - เซสชันผู้ใช้
- จัดการ session ของผู้ใช้
- ติดตามการหมดอายุ

## 🎯 คุณสมบัติพรีเมี่ยม

### Free Members (ฟรี)
- ดูสถานที่ท่องเที่ยวได้ 10 แห่ง/วัน
- บันทึกสถานที่โปรดได้ 5 แห่ง
- เช็คอินได้ไม่จำกัด
- เขียนรีวิวได้

### Premium Members (99 บาท/เดือน)
- ✅ ดูสถานที่ไม่จำกัด
- ✅ บันทึกสถานที่โปรดไม่จำกัด
- ✅ ดาวน์โหลดแผนที่ออฟไลน์
- ✅ ไม่มีโฆษณา
- ✅ สร้างแผนการเดินทางส่วนตัว

### VIP Members (1,999 บาท/ปี)
- ✅ สิทธิ์ทั้งหมดของ Premium
- ✅ ส่วนลดพิเศษจากร้านค้าพันธมิตร 10-30%
- ✅ บริการ Concierge 24/7
- ✅ จองล่วงหน้าพิเศษ
- ✅ เข้าร่วมกิจกรรมพิเศษ

## 📊 Views (มุมมองข้อมูล)

### 1. active_premium_users
แสดงรายชื่อสมาชิกพรีเมี่ยมที่ใช้งานอยู่

### 2. popular_places
แสดงสถานที่ยอดนิยม เรียงตามคะแนนและจำนวนรีวิว

### 3. user_statistics
สถิติการใช้งานของผู้ใช้แต่ละคน

## ⚙️ Stored Procedures

### 1. update_place_rating(place_id)
อัพเดทคะแนนเฉลี่ยของสถานที่จากรีวิวทั้งหมด

### 2. check_membership_expiry()
ตรวจสอบและอัพเดทสถานะสมาชิกที่หมดอายุ
**แนะนำ:** รันทุกวันเวลา 00:00 น. ด้วย Cron Job

## 🔔 Triggers

### 1. after_review_insert/update/delete
อัพเดทคะแนนสถานที่อัตโนมัติเมื่อมีการเพิ่ม/แก้ไข/ลบรีวิว

## 🚀 การติดตั้งและใช้งาน

### ขั้นตอนที่ 1: สร้างฐานข้อมูล

```bash
# เข้าสู่ MySQL/MariaDB
mysql -u root -p

# รันไฟล์ schema
source database/mapnexus_schema.sql
```

### ขั้นตอนที่ 2: เพิ่มข้อมูลตัวอย่าง (Optional)

```bash
# รันไฟล์ sample data
source database/sample_data.sql
```

### ขั้นตอนที่ 3: เชื่อมต่อกับ HibiSQL

1. เข้าไปที่ HibiSQL Dashboard
2. สร้าง Connection ใหม่:
   - **Host**: localhost (หรือ IP ของ server)
   - **Port**: 3306
   - **Database**: mapnexus
   - **Username**: your_username
   - **Password**: your_password

3. ทดสอบการเชื่อมต่อ

## 📝 ตัวอย่าง Queries

### ดูสมาชิกพรีเมี่ยมทั้งหมด
```sql
SELECT * FROM active_premium_users;
```

### ดูสถานที่ยอดนิยม Top 10
```sql
SELECT * FROM popular_places LIMIT 10;
```

### ดูรีวิวล่าสุด
```sql
SELECT 
    r.review_id,
    u.username,
    p.name as place_name,
    r.rating,
    r.title,
    r.content,
    r.created_at
FROM reviews r
JOIN users u ON r.user_id = u.user_id
JOIN places p ON r.place_id = p.place_id
ORDER BY r.created_at DESC
LIMIT 10;
```

### ตรวจสอบสมาชิกที่ใกล้หมดอายุ (7 วัน)
```sql
SELECT 
    user_id,
    username,
    email,
    membership_type,
    membership_end_date,
    DATEDIFF(membership_end_date, NOW()) as days_remaining
FROM users
WHERE membership_type IN ('premium', 'vip')
AND membership_end_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY)
ORDER BY membership_end_date ASC;
```

### สถิติรายได้จากสมาชิก
```sql
SELECT 
    DATE_FORMAT(payment_date, '%Y-%m') as month,
    COUNT(*) as total_transactions,
    SUM(amount) as total_revenue,
    AVG(amount) as average_transaction
FROM payment_transactions
WHERE status = 'completed'
GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
ORDER BY month DESC;
```

## 🔒 Security Best Practices

1. **Password Hashing**: ใช้ bcrypt สำหรับเข้ารหัสรหัสผ่าน
2. **SQL Injection**: ใช้ Prepared Statements เสมอ
3. **API Keys**: เก็บใน Environment Variables
4. **Session Management**: ตั้งเวลาหมดอายุที่เหมาะสม
5. **HTTPS**: ใช้ HTTPS สำหรับการสื่อสารทั้งหมด

## 📈 Performance Optimization

1. **Indexes**: มี indexes ครบถ้วนสำหรับ queries ที่ใช้บ่อย
2. **Full-Text Search**: ใช้สำหรับค้นหาสถานที่และกิจกรรม
3. **Caching**: แนะนำใช้ Redis สำหรับ cache ข้อมูลที่เข้าถึงบ่อย
4. **Connection Pooling**: ใช้ connection pool สำหรับ database connections

## 🔄 Maintenance Tasks

### รายวัน
- รัน `check_membership_expiry()` เพื่ออัพเดทสถานะสมาชิก
- Backup ฐานข้อมูล

### รายสัปดาห์
- ตรวจสอบและลบ sessions ที่หมดอายุ
- วิเคราะห์ slow queries

### รายเดือน
- ตรวจสอบและ optimize tables
- วิเคราะห์สถิติการใช้งาน

## 📞 Support

หากมีปัญหาหรือข้อสงสัย กรุณาติดต่อ:
- Email: support@mapnexus.com
- GitHub Issues: [MapNexus Repository]

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ

---

**Version**: 1.0.0  
**Last Updated**: 2026-05-22  
**Database Engine**: MySQL 8.0+ / MariaDB 10.5+
