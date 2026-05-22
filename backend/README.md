# MapNexus Backend API

## 📋 ภาพรวม

Backend API สำหรับ MapNexus - ระบบท่องเที่ยวนครพนมพร้อมระบบสมาชิกพรีเมี่ยม

## 🚀 การติดตั้ง

### ขั้นตอนที่ 1: ติดตั้ง Dependencies

```bash
npm install
```

### ขั้นตอนที่ 2: ตั้งค่า Environment Variables

```bash
# คัดลอกไฟล์ .env.example
cp .env.example .env

# แก้ไขไฟล์ .env และกรอกค่าจริง
```

### ขั้นตอนที่ 3: สร้างฐานข้อมูล

```bash
# เข้าสู่ MySQL
mysql -u root -p

# รันไฟล์ schema
source database/mapnexus_schema.sql

# รันไฟล์ sample data (ถ้าต้องการ)
source database/sample_data.sql
```

### ขั้นตอนที่ 4: รัน Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server จะรันที่ `http://localhost:3000`

## 📚 API Documentation

### Authentication

#### POST /api/auth/register
สมัครสมาชิกใหม่

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "0812345678"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "membership_type": "free"
  }
}
```

#### POST /api/auth/login
เข้าสู่ระบบ

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
ดูข้อมูลผู้ใช้ปัจจุบัน (ต้อง login)

**Headers:**
```
Authorization: Bearer <token>
```

### Places

#### GET /api/places
ดูสถานที่ทั้งหมด

**Query Parameters:**
- `category` - หมวดหมู่ (temple, cafe, hotel, etc.)
- `limit` - จำนวนต่อหน้า (default: 20)
- `offset` - เริ่มต้นที่ (default: 0)
- `sort` - เรียงตาม (rating, reviews, name)
- `search` - ค้นหา

**Example:**
```
GET /api/places?category=cafe&limit=10&sort=rating
```

#### GET /api/places/:id
ดูรายละเอียดสถานที่

#### GET /api/places/category/:category
ดูสถานที่ตามหมวดหมู่

#### GET /api/places/featured/list
ดูสถานที่แนะนำ

### Check-ins

#### POST /api/checkins
เช็คอิน (ต้อง login)

**Request Body:**
```json
{
  "place_id": 1,
  "comment": "สถานที่สวยมาก",
  "rating": 5,
  "latitude": 17.4100,
  "longitude": 104.7900,
  "images": ["image1.jpg", "image2.jpg"]
}
```

#### GET /api/checkins/my
ดูประวัติเช็คอินของตัวเอง (ต้อง login)

#### GET /api/checkins/place/:place_id
ดูเช็คอินของสถานที่

#### DELETE /api/checkins/:id
ลบเช็คอิน (ต้อง login)

### Reviews

#### POST /api/reviews
เขียนรีวิว (ต้อง login)

**Request Body:**
```json
{
  "place_id": 1,
  "rating": 5,
  "title": "สถานที่ยอดเยี่ยม",
  "content": "บรรยากาศดี บริการเยี่ยม",
  "cleanliness_rating": 5,
  "service_rating": 5,
  "value_rating": 4,
  "images": ["review1.jpg"]
}
```

#### GET /api/reviews/place/:place_id
ดูรีวิวของสถานที่

### Favorites

#### POST /api/favorites
เพิ่มสถานที่โปรด (ต้อง login)

**Request Body:**
```json
{
  "place_id": 1,
  "category": "must_visit",
  "notes": "ต้องมาอีก"
}
```

#### GET /api/favorites
ดูสถานที่โปรดทั้งหมด (ต้อง login)

#### DELETE /api/favorites/:place_id
ลบสถานที่โปรด (ต้อง login)

### Subscriptions

#### GET /api/subscriptions/plans
ดูแพ็กเกจทั้งหมด

**Response:**
```json
{
  "success": true,
  "plans": [
    {
      "plan_id": "monthly_premium",
      "plan_name": "Premium Monthly",
      "price": 99.00,
      "duration_months": 1,
      "features": [...]
    }
  ]
}
```

#### POST /api/subscriptions/subscribe
สมัครสมาชิก (ต้อง login)

**Request Body:**
```json
{
  "plan_id": "monthly_premium",
  "payment_method": "promptpay"
}
```

#### GET /api/subscriptions/my
ดูสมาชิกของตัวเอง (ต้อง login)

#### POST /api/subscriptions/cancel
ยกเลิกสมาชิก (ต้อง login)

### Payments

#### POST /api/payments/create
สร้างการชำระเงิน (ต้อง login)

**Request Body:**
```json
{
  "subscription_id": 1,
  "payment_method": "promptpay",
  "amount": 99.00
}
```

**Response (PromptPay):**
```json
{
  "success": true,
  "transaction_id": 1,
  "payment_method": "promptpay",
  "amount": 99.00,
  "payment_details": {
    "promptpay_id": "0812345678",
    "qr_code_url": "https://promptpay.io/0812345678/99.00.png",
    "reference": "TXN1"
  }
}
```

#### POST /api/payments/confirm
ยืนยันการชำระเงิน (ต้อง login)

**Request Body:**
```json
{
  "transaction_id": 1,
  "gateway_transaction_id": "PP123456789",
  "payment_proof": "slip.jpg"
}
```

#### GET /api/payments/history
ประวัติการชำระเงิน (ต้อง login)

### Users

#### GET /api/users/profile
ดูโปรไฟล์ (ต้อง login)

#### PUT /api/users/profile
อัพเดทโปรไฟล์ (ต้อง login)

**Request Body:**
```json
{
  "full_name": "John Doe Updated",
  "phone": "0898765432",
  "profile_image": "profile.jpg"
}
```

#### GET /api/users/stats
สถิติผู้ใช้ (ต้อง login)

### Events

#### GET /api/events
ดูกิจกรรมทั้งหมด

**Query Parameters:**
- `upcoming` - แสดงเฉพาะกิจกรรมที่กำลังจะมาถึง (default: true)

#### GET /api/events/:id
ดูรายละเอียดกิจกรรม

### Weather

#### GET /api/weather/current
ดูสภาพอากาศปัจจุบัน

#### GET /api/weather/forecast
พยากรณ์อากาศ 7 วัน

### Traffic

#### GET /api/traffic/current
ดูสถานะการจราจรปัจจุบัน

## 🔐 Authentication

API ใช้ JWT (JSON Web Token) สำหรับ authentication

### การใช้งาน:

1. Login หรือ Register เพื่อรับ token
2. ส่ง token ใน header ของทุก request ที่ต้อง authentication:

```
Authorization: Bearer <your_token_here>
```

### Token Expiration:

Token จะหมดอายุใน 7 วัน

## 💳 Payment Gateway

### PromptPay

1. สร้างการชำระเงินด้วย `POST /api/payments/create`
2. แสดง QR Code ให้ผู้ใช้สแกน
3. รอ webhook จาก PromptPay หรือให้ผู้ใช้ยืนยันด้วย `POST /api/payments/confirm`

### Credit Card (Stripe)

1. สร้างการชำระเงินด้วย `POST /api/payments/create`
2. ใช้ Stripe.js ในฝั่ง frontend
3. ยืนยันการชำระเงินด้วย `POST /api/payments/confirm`

### Bank Transfer

1. สร้างการชำระเงินด้วย `POST /api/payments/create`
2. แสดงรายละเอียดบัญชีธนาคาร
3. ให้ผู้ใช้อัพโหลดสลิปและยืนยันด้วย `POST /api/payments/confirm`

## 🔧 Configuration

### Environment Variables

ดูไฟล์ `.env.example` สำหรับตัวอย่าง

**สำคัญ:**
- `JWT_SECRET` - ต้องเปลี่ยนในการใช้งานจริง
- `DB_PASSWORD` - รหัสผ่านฐานข้อมูล
- Payment Gateway Keys - API keys จาก payment providers

## 🧪 Testing

### ทดสอบ API ด้วย cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Places
curl http://localhost:3000/api/places

# Get Places (with auth)
curl http://localhost:3000/api/places \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### ทดสอบด้วย Postman

Import collection จาก `postman_collection.json` (ถ้ามี)

## 📊 Database

### Schema

ดูไฟล์ `database/mapnexus_schema.sql`

### Migrations

ในอนาคตจะใช้ migration tools เช่น Knex.js หรือ Sequelize

## 🚨 Error Handling

API จะ return error ในรูปแบบ:

```json
{
  "success": false,
  "message": "Error message here"
}
```

### HTTP Status Codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 📝 Logging

API ใช้ Morgan สำหรับ logging

Logs จะแสดงใน console ในรูปแบบ:

```
GET /api/places 200 45.123 ms - 1234
```

## 🔒 Security

- Helmet.js สำหรับ security headers
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Password hashing ด้วย bcrypt
- JWT token authentication
- SQL injection protection (prepared statements)

## 📦 Dependencies

### Production:
- express - Web framework
- mysql2 - MySQL client
- bcrypt - Password hashing
- jsonwebtoken - JWT authentication
- dotenv - Environment variables
- cors - CORS middleware
- helmet - Security headers
- express-rate-limit - Rate limiting
- morgan - HTTP request logger

### Development:
- nodemon - Auto-reload server

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License

## 📞 Support

หากมีปัญหาหรือข้อสงสัย:
- Email: support@mapnexus.com
- GitHub Issues: [MapNexus Repository]

---

**Version**: 1.0.0  
**Last Updated**: 2026-05-22
