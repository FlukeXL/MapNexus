# 🚀 MapNexus - คู่มือการติดตั้งและใช้งาน

## 📋 สารบัญ

1. [ข้อกำหนดระบบ](#ข้อกำหนดระบบ)
2. [การติดตั้ง](#การติดตั้ง)
3. [การตั้งค่าฐานข้อมูล](#การตั้งค่าฐานข้อมูล)
4. [การตั้งค่า Backend](#การตั้งค่า-backend)
5. [การตั้งค่า Frontend](#การตั้งค่า-frontend)
6. [การตั้งค่า Payment Gateway](#การตั้งค่า-payment-gateway)
7. [การ Deploy](#การ-deploy)
8. [การทดสอบ](#การทดสอบ)

---

## ข้อกำหนดระบบ

### Software Requirements:
- **Node.js** >= 16.0.0
- **MySQL** >= 8.0 หรือ **MariaDB** >= 10.5
- **npm** >= 8.0.0
- **Git**

### Optional:
- **HibiSQL** - สำหรับจัดการฐานข้อมูล
- **Postman** - สำหรับทดสอบ API
- **VS Code** - แนะนำสำหรับ development

---

## การติดตั้ง

### 1. Clone Repository

```bash
git clone https://github.com/FlukeXL/Mapnexus.git
cd Mapnexus
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

---

## การตั้งค่าฐานข้อมูล

### 1. สร้างฐานข้อมูล

```bash
# เข้าสู่ MySQL
mysql -u root -p

# รันคำสั่งสร้างฐานข้อมูล
source database/mapnexus_schema.sql

# (Optional) เพิ่มข้อมูลตัวอย่าง
source database/sample_data.sql

# ออกจาก MySQL
exit
```

### 2. เชื่อมต่อกับ HibiSQL (Optional)

1. เปิด HibiSQL
2. คลิก "New Connection"
3. กรอกข้อมูล:
   - **Host**: localhost
   - **Port**: 3306
   - **Database**: mapnexus
   - **Username**: your_username
   - **Password**: your_password
4. คลิก "Test Connection"
5. คลิก "Save"

---

## การตั้งค่า Backend

### 1. สร้างไฟล์ .env

```bash
# คัดลอกไฟล์ตัวอย่าง
cp .env.example .env
```

### 2. แก้ไขไฟล์ .env

```env
# Server
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5500

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=mapnexus

# JWT Secret (สร้างใหม่ด้วยคำสั่งด้านล่าง)
JWT_SECRET=your_generated_secret_here
```

### 3. สร้าง JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

คัดลอกผลลัพธ์ไปใส่ใน `JWT_SECRET`

### 4. รัน Backend Server

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Server จะรันที่: `http://localhost:3000`

### 5. ทดสอบ Backend

เปิดเบราว์เซอร์ไปที่:
```
http://localhost:3000/health
```

ควรเห็น:
```json
{
  "status": "OK",
  "message": "MapNexus API is running",
  "timestamp": "2026-05-22T..."
}
```

---

## การตั้งค่า Frontend

### 1. แก้ไข API URL

เปิดไฟล์ `frontend/js/api.js` และแก้ไข:

```javascript
// สำหรับ Development
const API_BASE_URL = 'http://localhost:3000/api';

// สำหรับ Production
// const API_BASE_URL = 'https://your-domain.com/api';
```

### 2. รัน Frontend

#### วิธีที่ 1: ใช้ Live Server (VS Code)

1. ติดตั้ง Extension "Live Server"
2. คลิกขวาที่ `frontend/index.html`
3. เลือก "Open with Live Server"

#### วิธีที่ 2: ใช้ Python

```bash
cd frontend
python -m http.server 5500
```

#### วิธีที่ 3: ใช้ Node.js http-server

```bash
npm install -g http-server
cd frontend
http-server -p 5500
```

Frontend จะรันที่: `http://localhost:5500`

---

## การตั้งค่า Payment Gateway

### 1. PromptPay

#### ขั้นตอน:

1. เตรียมเบอร์โทรหรือ Tax ID สำหรับรับเงิน
2. แก้ไขไฟล์ `.env`:

```env
PROMPTPAY_ID=0812345678
# หรือใช้ Tax ID
# PROMPTPAY_ID=1234567890123
```

3. ทดสอบ:

```bash
curl -X POST http://localhost:3000/api/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "subscription_id": 1,
    "payment_method": "promptpay",
    "amount": 99.00
  }'
```

### 2. Stripe (Credit Card)

#### ขั้นตอน:

1. สมัครบัญชี Stripe: https://stripe.com
2. รับ API Keys จาก Dashboard
3. แก้ไขไฟล์ `.env`:

```env
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

4. ติดตั้ง Stripe package:

```bash
npm install stripe
```

5. แก้ไขไฟล์ `backend/routes/payments.js`:

```javascript
// Uncomment Stripe code
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

### 3. Bank Transfer

#### ขั้นตอน:

1. เตรียมข้อมูลบัญชีธนาคาร
2. แก้ไขไฟล์ `.env`:

```env
BANK_ACCOUNT_NUMBER=123-4-56789-0
BANK_ACCOUNT_NAME=MapNexus Co., Ltd.
BANK_NAME=ธนาคารกสิกรไทย
```

---

## การ Deploy

### Deploy Backend (Vercel/Railway/Heroku)

#### Vercel:

```bash
# ติดตั้ง Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Railway:

1. ไปที่ https://railway.app
2. เชื่อมต่อ GitHub repository
3. เลือก "Deploy from GitHub"
4. ตั้งค่า Environment Variables
5. Deploy

### Deploy Frontend (Vercel)

```bash
# Deploy frontend
cd frontend
vercel --prod
```

### Deploy Database

#### Option 1: PlanetScale (แนะนำ)

1. สมัครที่ https://planetscale.com
2. สร้าง Database ใหม่
3. Import schema จาก `database/mapnexus_schema.sql`
4. รับ Connection String
5. อัพเดท `.env`

#### Option 2: Railway

1. ไปที่ https://railway.app
2. สร้าง MySQL Database
3. Import schema
4. รับ Connection String

---

## การทดสอบ

### 1. ทดสอบ Backend API

#### ทดสอบ Register:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "phone": "0812345678"
  }'
```

#### ทดสอบ Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### ทดสอบ Get Places:

```bash
curl http://localhost:3000/api/places
```

### 2. ทดสอบ Frontend

1. เปิด `http://localhost:5500`
2. ทดสอบ Register
3. ทดสอบ Login
4. ทดสอบดูสถานที่
5. ทดสอบเช็คอิน
6. ทดสอบสมัครสมาชิก

### 3. ทดสอบ Payment

#### PromptPay:

1. สมัครสมาชิก Premium
2. เลือก PromptPay
3. สแกน QR Code
4. ยืนยันการชำระเงิน

#### Credit Card:

1. สมัครสมาชิก Premium
2. เลือก Credit Card
3. ใช้ Test Card: `4242 4242 4242 4242`
4. ยืนยันการชำระเงิน

---

## 🎯 Flow การใช้งาน

### 1. ผู้ใช้ทั่วไป (Free)

```
Register → Login → ดูสถานที่ → เช็คอิน → เขียนรีวิว
```

### 2. สมัครสมาชิก Premium

```
Login → ดูแพ็กเกจ → เลือกแพ็กเกจ → ชำระเงิน → ยืนยัน → ใช้งานฟีเจอร์พรีเมี่ยม
```

### 3. Admin

```
Login → จัดการสถานที่ → อนุมัติรีวิว → ดูสถิติ
```

---

## 🔧 Troubleshooting

### ปัญหา: Database connection failed

**แก้ไข:**
1. ตรวจสอบ MySQL service รันอยู่หรือไม่
2. ตรวจสอบ username/password ใน `.env`
3. ตรวจสอบ port 3306 ว่าง

### ปัญหา: CORS error

**แก้ไข:**
1. ตรวจสอบ `FRONTEND_URL` ใน `.env`
2. ตรวจสอบ CORS configuration ใน `backend/server.js`

### ปัญหา: JWT token expired

**แก้ไข:**
1. Login ใหม่
2. หรือเพิ่มเวลา expiration ใน `backend/routes/auth.js`

### ปัญหา: Payment not working

**แก้ไข:**
1. ตรวจสอบ API keys ใน `.env`
2. ตรวจสอบ webhook configuration
3. ดู logs ใน console

---

## 📚 เอกสารเพิ่มเติม

- [Backend API Documentation](backend/README.md)
- [Database Schema](database/README.md)
- [Frontend API Client](frontend/js/api.js)

---

## 🤝 Support

หากมีปัญหาหรือข้อสงสัย:

- **Email**: support@mapnexus.com
- **GitHub Issues**: https://github.com/FlukeXL/Mapnexus/issues
- **Discord**: [MapNexus Community]

---

## ✅ Checklist การติดตั้ง

- [ ] ติดตั้ง Node.js และ MySQL
- [ ] Clone repository
- [ ] ติดตั้ง dependencies (`npm install`)
- [ ] สร้างฐานข้อมูล
- [ ] สร้างและแก้ไขไฟล์ `.env`
- [ ] รัน backend server
- [ ] ทดสอบ API
- [ ] รัน frontend
- [ ] ทดสอบการใช้งาน
- [ ] ตั้งค่า Payment Gateway
- [ ] ทดสอบการชำระเงิน
- [ ] Deploy (ถ้าต้องการ)

---

**เรียบร้อย! ตอนนี้คุณพร้อมใช้งาน MapNexus แล้ว 🎉**

---

**Version**: 1.0.0  
**Last Updated**: 2026-05-22  
**Author**: MapNexus Team
