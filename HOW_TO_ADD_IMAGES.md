# 📸 วิธีใส่รูปเข้าโปรเจค MapNexus

## 🎯 สรุปสั้นๆ

1. วางรูปในโฟลเดอร์ `frontend/assets/images/places/`
2. แก้ไขไฟล์ `frontend/js/places-data.js`
3. Refresh หน้าเว็บ

---

## 📁 ขั้นตอนที่ 1: วางรูปในโฟลเดอร์

### โครงสร้างโฟลเดอร์:

```
frontend/assets/images/places/
├── temples/          ← วางรูปวัดที่นี่
├── cafes/            ← วางรูปคาเฟ่ที่นี่
├── hotels/           ← วางรูปโรงแรมที่นี่
├── nature/           ← วางรูปธรรมชาติที่นี่ ⭐ ใหม่!
└── README.md
```

### ตัวอย่างการวางรูป:

**วัด (4 รูป):**
```
frontend/assets/images/places/temples/
├── phra-that-phanom.jpg       ← รูปพระธาตุพนม
├── wat-pho-chai.jpg           ← รูปวัดโพธิ์ชัย
├── wat-mahathat.jpg           ← รูปวัดมหาธาตุ
└── wat-sri-thep.jpg           ← รูปวัดศรีเทพ
```

**คาเฟ่ (12 รูป):**
```
frontend/assets/images/places/cafes/
├── mekong-riverside-cafe.jpg
├── sunset-view-coffee.jpg
├── nakhon-phanom-loft.jpg
├── the-garden-cafe.jpg
├── indochina-coffee-house.jpg
├── baan-rim-nam-cafe.jpg
├── vintage-cafe-np.jpg
├── rooftop-cafe-bar.jpg
├── minimalist-cafe.jpg
├── artisan-coffee-lab.jpg
├── cozy-corner-cafe.jpg
└── mekong-breeze-cafe.jpg
```

**โรงแรม (4 รูป):**
```
frontend/assets/images/places/hotels/
├── the-river-hotel.jpg
├── grand-view-hotel.jpg
├── mekong-boutique-hotel.jpg
└── nakhon-phanom-resort.jpg
```

**ธรรมชาติ (ตามต้องการ):** ⭐ ใหม่!
```
frontend/assets/images/places/nature/
├── mekong-river.jpg           ← แม่น้ำโขง
├── mekong-sunset.jpg          ← พระอาทิตย์ตกริมโขง
├── phu-langka.jpg             ← ภูลังกา
├── renu-nakhon-lake.jpg       ← ทะเลสาบเรณูนคร
├── kaeng-kabao.jpg            ← แก่งกะเบา
└── ... (สถานที่ธรรมชาติอื่นๆ)
```

---

## ✏️ ขั้นตอนที่ 2: แก้ไขไฟล์ places-data.js

### เปิดไฟล์:
```
frontend/js/places-data.js
```

### ค้นหาและแก้ไข:

**ก่อนแก้ไข (ใช้ URL จาก Unsplash):**
```javascript
{
    id: 1,
    name: 'พระธาตุพนม',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    ...
}
```

**หลังแก้ไข (ใช้รูปของคุณ):**
```javascript
{
    id: 1,
    name: 'พระธาตุพนม',
    image: 'assets/images/places/temples/phra-that-phanom.jpg',
    ...
}
```

### ตัวอย่างการแก้ไขทั้งหมด:

```javascript
const PLACES_DATA = {
    temples: [
        {
            id: 1,
            name: 'พระธาตุพนม',
            image: 'assets/images/places/temples/phra-that-phanom.jpg', // ← แก้ไขตรงนี้
            ...
        },
        {
            id: 2,
            name: 'วัดโพธิ์ชัย',
            image: 'assets/images/places/temples/wat-pho-chai.jpg', // ← แก้ไขตรงนี้
            ...
        }
    ],
    
    cafes: [
        {
            id: 5,
            name: 'Mekong Riverside Café',
            image: 'assets/images/places/cafes/mekong-riverside-cafe.jpg', // ← แก้ไขตรงนี้
            ...
        }
    ],
    
    hotels: [
        {
            id: 17,
            name: 'The River Hotel Nakhon Phanom',
            image: 'assets/images/places/hotels/the-river-hotel.jpg', // ← แก้ไขตรงนี้
            ...
        }
    ]
};
```

---

## 🔄 ขั้นตอนที่ 3: Refresh หน้าเว็บ

1. บันทึกไฟล์ `places-data.js`
2. เปิดเบราว์เซอร์
3. กด **Ctrl + Shift + R** (Hard Refresh)
4. รูปใหม่จะแสดงขึ้นมา!

---

## 📏 ข้อกำหนดรูป

### ขนาดที่แนะนำ:
- **ความกว้าง**: 800-1200px
- **อัตราส่วน**: 4:3 หรือ 16:9
- **ไฟล์**: JPG, PNG, หรือ WebP
- **ขนาดไฟล์**: ไม่เกิน 500KB

### การตั้งชื่อไฟล์:
- ✅ ใช้ภาษาอังกฤษ
- ✅ ใช้ตัวพิมพ์เล็ก
- ✅ ใช้ `-` แทนช่องว่าง
- ❌ ไม่ใช้ภาษาไทย
- ❌ ไม่ใช้ช่องว่าง

**ตัวอย่างที่ดี:**
- `mekong-riverside-cafe.jpg` ✅
- `sunset-view-coffee.jpg` ✅
- `the-river-hotel.jpg` ✅

**ตัวอย่างที่ไม่ดี:**
- `คาเฟ่ริมโขง.jpg` ❌
- `Sunset View Coffee.jpg` ❌
- `TheRiverHotel.JPG` ❌

---

## 🎨 เคล็ดลับการถ่ายรูป

### 1. แสงสว่าง
- ถ่ายในเวลา 8:00-10:00 น. หรือ 15:00-17:00 น.
- หลีกเลี่ยงแสงแดดจ้าเที่ยง

### 2. มุมกล้อง
- ถ่ายให้เห็นบรรยากาศของสถานที่
- ใช้มุมกว้างสำหรับภายใน
- ใช้มุมสูงสำหรับภายนอก

### 3. องค์ประกอบ
- ใส่คนในภาพเพื่อให้มีชีวิตชีวา
- แสดงรายละเอียดที่น่าสนใจ
- หลีกเลี่ยงสิ่งรบกวน

---

## 🔧 เครื่องมือแก้ไขรูป (ฟรี)

### ลดขนาดไฟล์:
- **TinyPNG**: https://tinypng.com
- **Squoosh**: https://squoosh.app

### ตัดแต่งรูป:
- **Canva**: https://canva.com
- **Photopea**: https://photopea.com (เหมือน Photoshop)

### ปรับสี:
- **Snapseed** (มือถือ)
- **VSCO** (มือถือ)

---

## ❓ แก้ปัญหา

### รูปไม่แสดง?

**ตรวจสอบ:**
1. ✅ Path ถูกต้องหรือไม่?
   ```javascript
   // ถูกต้อง
   image: 'assets/images/places/cafes/mekong-cafe.jpg'
   
   // ผิด
   image: 'assets/images/cafes/mekong-cafe.jpg'  // ขาด places/
   ```

2. ✅ ชื่อไฟล์ตรงกันหรือไม่? (case-sensitive)
   ```javascript
   // ถ้าไฟล์ชื่อ: Mekong-Cafe.jpg
   image: 'assets/images/places/cafes/Mekong-Cafe.jpg'  // ต้องตรงทุกตัวอักษร
   ```

3. ✅ ไฟล์อยู่ในโฟลเดอร์ที่ถูกต้องหรือไม่?

4. ✅ Hard Refresh แล้วหรือยัง? (Ctrl + Shift + R)

### รูปโหลดช้า?

**แก้ไข:**
1. ลดขนาดไฟล์ด้วย TinyPNG
2. ลดความละเอียดเหลือ 800px
3. แปลงเป็น WebP format

---

## 📋 Checklist

- [ ] วางรูปในโฟลเดอร์ที่ถูกต้อง
- [ ] ตั้งชื่อไฟล์เป็นภาษาอังกฤษ
- [ ] แก้ไข `places-data.js`
- [ ] ตรวจสอบ path ว่าถูกต้อง
- [ ] บันทึกไฟล์
- [ ] Hard Refresh เบราว์เซอร์
- [ ] ตรวจสอบว่ารูปแสดงถูกต้อง

---

## 💡 เคล็ดลับเพิ่มเติม

### ใช้รูปจาก URL ภายนอก

ถ้าไม่อยากวางรูปในโปรเจค สามารถใช้ URL ได้เลย:

```javascript
{
    id: 1,
    name: 'พระธาตุพนม',
    image: 'https://your-website.com/images/temple.jpg',
    ...
}
```

### ใช้ Placeholder ชั่วคราว

ถ้ายังไม่มีรูป ใช้ placeholder ก่อน:

```javascript
{
    id: 1,
    name: 'พระธาตุพนม',
    image: 'https://via.placeholder.com/800x600?text=พระธาตุพนม',
    ...
}
```

---

## 📞 ต้องการความช่วยเหลือ?

หากมีปัญหาหรือข้อสงสัย สามารถถามได้เลยครับ!

---

**สร้างโดย MapNexus Team 🚀**
