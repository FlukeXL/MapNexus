# NAKHON PHANOM Tourism Website

เว็บไซต์ท่องเที่ยวนครพนม - เมืองแห่งมนต์เสน่ห์โขง

## 🌟 Features

- 🏛️ แสดงสถานที่ท่องเที่ยวในนครพนม (วัด, คาเฟ่, โรงแรม)
- 🗺️ แผนที่แบบ interactive
- ☁️ ข้อมูลสภาพอากาศและ PM2.5
- 📍 ระบบเช็คอิน
- 📱 รองรับ Progressive Web App (PWA)

## 🚀 Deploy บน Vercel

### วิธีที่ 1: Deploy ผ่าน Vercel CLI (แนะนำ)

1. ติดตั้ง Vercel CLI:
```bash
npm install -g vercel
```

2. Login เข้า Vercel:
```bash
vercel login
```

3. Deploy โปรเจกต์:
```bash
vercel
```

4. สำหรับ production:
```bash
vercel --prod
```

### วิธีที่ 2: Deploy ผ่าน Vercel Dashboard

1. ไปที่ [vercel.com](https://vercel.com)
2. เข้าสู่ระบบด้วย GitHub, GitLab หรือ Bitbucket
3. คลิก "Add New Project"
4. Import repository นี้
5. Vercel จะตรวจจับการตั้งค่าอัตโนมัติ
6. คลิก "Deploy"

### วิธีที่ 3: Deploy ผ่าน Git

1. Push โค้ดขึ้น GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. เชื่อมต่อ GitHub repo กับ Vercel
3. Vercel จะ auto-deploy ทุกครั้งที่ push

## 📁 โครงสร้างโปรเจกต์

```
.
├── frontend/           # Frontend files (HTML, CSS, JS)
│   ├── index.html     # หน้าหลัก
│   ├── explore.html   # หน้านำเที่ยว
│   ├── checkin.html   # หน้าเช็คอิน
│   ├── weather.html   # หน้าพยากรณ์อากาศ
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   ├── assets/        # รูปภาพและวิดีโอ
│   └── pwa/           # PWA manifest และ service worker
├── backend/           # Backend files (Node.js)
│   ├── server.js      # Express server
│   ├── routes/        # API routes
│   ├── controllers/   # Controllers และ Models
│   └── ai/            # AI models (Python)
├── vercel.json        # Vercel configuration
└── package.json       # Dependencies
```

## 🔧 การตั้งค่า

### Environment Variables (ถ้ามี)

ถ้าโปรเจกต์ต้องการ environment variables สามารถตั้งค่าใน Vercel Dashboard:

1. ไปที่ Project Settings
2. เลือก Environment Variables
3. เพิ่มตัวแปรที่จำเป็น เช่น:
   - `DATABASE_URL`
   - `API_KEY`
   - etc.

## 🌐 หลังจาก Deploy

เว็บไซต์จะได้ URL แบบนี้:
- Preview: `https://your-project-name-xxx.vercel.app`
- Production: `https://your-project-name.vercel.app`

คุณสามารถเชื่อมต่อ custom domain ได้ใน Vercel Dashboard

## 📝 หมายเหตุ

- Frontend จะถูก serve เป็น static files
- ถ้าต้องการใช้ backend API ควรแปลงเป็น Vercel Serverless Functions
- ไฟล์วิดีโอขนาดใหญ่ควรใช้ CDN หรือ cloud storage แทน

## 🛠️ Development

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev

# หรือใช้ Vercel CLI
vercel dev
```

## 📱 PWA Support

เว็บไซต์รองรับ Progressive Web App สามารถติดตั้งบนมือถือได้

## 📄 License

MIT License

---

Made with ❤️ for Nakhon Phanom Tourism
