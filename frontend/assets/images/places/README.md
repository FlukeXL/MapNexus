# 📸 คู่มือการใส่รูปสถานที่

## 📁 โครงสร้างโฟลเดอร์

```
frontend/assets/images/places/
├── temples/          # รูปวัด
├── cafes/            # รูปคาเฟ่
├── hotels/           # รูปโรงแรม
├── nature/           # รูปธรรมชาติ (แม่น้ำโขง, ภูเขา, ทะเลสาบ)
└── README.md         # ไฟล์นี้
```

---

## 🖼️ วิธีใส่รูปเข้าโปรเจค

### ขั้นตอนที่ 1: เตรียมรูป

1. **ขนาดรูปที่แนะนำ:**
   - ความกว้าง: 800-1200px
   - อัตราส่วน: 4:3 หรือ 16:9
   - ไฟล์: JPG หรือ PNG
   - ขนาดไฟล์: ไม่เกิน 500KB

2. **ตั้งชื่อไฟล์:**
   - ใช้ภาษาอังกฤษ ไม่มีช่องว่าง
   - ตัวอย่าง: `phra-that-phanom.jpg`, `mekong-cafe.jpg`, `mekong-river.jpg`

### ขั้นตอนที่ 2: วางรูปในโฟลเดอร์

**สำหรับวัด:**
```
frontend/assets/images/places/temples/
├── phra-that-phanom.jpg
├── wat-pho-chai.jpg
├── wat-mahathat.jpg
└── wat-sri-thep.jpg
```

**สำหรับคาเฟ่:**
```
frontend/assets/images/places/cafes/
├── mekong-riverside-cafe.jpg
├── sunset-view-coffee.jpg
├── nakhon-phanom-loft.jpg
└── ... (คาเฟ่อื่นๆ)
```

**สำหรับโรงแรม:**
```
frontend/assets/images/places/hotels/
├── the-river-hotel.jpg
├── grand-view-hotel.jpg
└── ... (โรงแรมอื่นๆ)
```

**สำหรับธรรมชาติ:** ⭐ ใหม่!
```
frontend/assets/images/places/nature/
├── mekong-river.jpg
├── phu-langka.jpg
├── renu-nakhon-lake.jpg
├── sunset-mekong.jpg
└── ... (สถานที่ธรรมชาติอื่นๆ)
```

### ขั้นตอนที่ 3: แก้ไขไฟล์ `places-data.js`

เปิดไฟล์ `frontend/js/places-data.js` และแก้ไข `image` จาก URL เป็น path ของรูปที่คุณวาง:

**ก่อนแก้ไข:**
```javascript
{
    id: 1,
    name: 'พระธาตุพนม',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    ...
}
```

**หลังแก้ไข:**
```javascript
{
    id: 1,
    name: 'พระธาตุพนม',
    image: 'assets/images/places/temples/phra-that-phanom.jpg',
    ...
}
```

---

## 📝 ตัวอย่างการแก้ไขทั้งหมด

### วัด (Temples)

```javascript
temples: [
    {
        id: 1,
        name: 'พระธาตุพนม',
        image: 'assets/images/places/temples/phra-that-phanom.jpg',
        ...
    },
    {
        id: 2,
        name: 'วัดโพธิ์ชัย',
        image: 'assets/images/places/temples/wat-pho-chai.jpg',
        ...
    }
]
```

### คาเฟ่ (Cafes)

```javascript
cafes: [
    {
        id: 5,
        name: 'Mekong Riverside Café',
        image: 'assets/images/places/cafes/mekong-riverside-cafe.jpg',
        ...
    },
    {
        id: 6,
        name: 'Sunset View Coffee',
        image: 'assets/images/places/cafes/sunset-view-coffee.jpg',
        ...
    }
]
```

### โรงแรม (Hotels)

```javascript
hotels: [
    {
        id: 17,
        name: 'The River Hotel Nakhon Phanom',
        image: 'assets/images/places/hotels/the-river-hotel.jpg',
        ...
    }
]
```

### ธรรมชาติ (Nature) ⭐ ใหม่!

```javascript
nature: [
    {
        id: 21,
        name: 'แม่น้ำโขง',
        category: 'ธรรมชาติ',
        description: 'ชมพระอาทิตย์ตกริมโขงที่สวยงามที่สุด',
        image: 'assets/images/places/nature/mekong-river.jpg',
        location: 'เมืองนครพนม',
        rating: 4.9,
        reviews: 3200
    },
    {
        id: 22,
        name: 'ภูลังกา',
        category: 'ธรรมชาติ',
        description: 'ภูเขาสวยงาม ชมทะเลหมอก',
        image: 'assets/images/places/nature/phu-langka.jpg',
        location: 'อำเภอบ้านแพง',
        rating: 4.8,
        reviews: 1800
    }
]
```

---

## 🎨 เคล็ดลับการถ่ายรูป

### สำหรับธรรมชาติ:
1. **Golden Hour:** ถ่ายในช่วงพระอาทิตย์ขึ้น/ตก
2. **Blue Hour:** ถ่ายก่อนพระอาทิตย์ขึ้น/หลังตก
3. **ใช้ Foreground:** ใส่ต้นไม้หรือหินเป็นฉากหน้า
4. **Rule of Thirds:** แบ่งภาพเป็น 3 ส่วน

### สำหรับแม่น้ำโขง:
- ถ่ายตอนเช้า (6:00-8:00 น.)
- ถ่ายตอนเย็น (17:00-19:00 น.)
- ใส่เรือหรือคนในภาพ

---

## 🔧 การ Optimize รูป (ถ้าต้องการ)

### ใช้เครื่องมือออนไลน์:
- **TinyPNG**: https://tinypng.com (ลดขนาดไฟล์)
- **Squoosh**: https://squoosh.app (ปรับขนาดและคุณภาพ)
- **Canva**: https://canva.com (ตัดแต่งรูป)

### ขนาดที่แนะนำ:
- **Card Image**: 800x600px (4:3)
- **Hero Image**: 1920x1080px (16:9)
- **Thumbnail**: 400x300px (4:3)

---

## ❓ คำถามที่พบบ่อย

**Q: รูปไม่แสดง?**
- ตรวจสอบ path ว่าถูกต้องหรือไม่
- ตรวจสอบชื่อไฟล์ว่าตรงกันหรือไม่ (case-sensitive)
- Hard refresh (Ctrl + Shift + R)

**Q: รูปโหลดช้า?**
- ลดขนาดไฟล์ด้วย TinyPNG
- ใช้ format WebP แทน JPG

**Q: ต้องการใช้รูปจาก URL ภายนอก?**
- ใช้ได้เลย แค่ใส่ URL เต็มใน `image` field
- ตัวอย่าง: `image: 'https://example.com/image.jpg'`

---

## 📞 ต้องการความช่วยเหลือ?

หากมีปัญหาหรือข้อสงสัย สามารถถามได้เลยครับ!

---

**Happy Coding! 🚀**

---

## 🖼️ วิธีใส่รูปเข้าโปรเจค

### ขั้นตอนที่ 1: เตรียมรูป

1. **ขนาดรูปที่แนะนำ:**
   - ความกว้าง: 800-1200px
   - อัตราส่วน: 4:3 หรือ 16:9
   - ไฟล์: JPG หรือ PNG
   - ขนาดไฟล์: ไม่เกิน 500KB

2. **ตั้งชื่อไฟล์:**
   - ใช้ภาษาอังกฤษ ไม่มีช่องว่าง
   - ตัวอย่าง: `phra-that-phanom.jpg`, `mekong-cafe.jpg`

### ขั้นตอนที่ 2: วางรูปในโฟลเดอร์

**สำหรับวัด:**
```
frontend/assets/images/places/temples/
├── phra-that-phanom.jpg
├── wat-pho-chai.jpg
├── wat-mahathat.jpg
└── wat-sri-thep.jpg
```

**สำหรับคาเฟ่:**
```
frontend/assets/images/places/cafes/
├── mekong-riverside-cafe.jpg
├── sunset-view-coffee.jpg
├── nakhon-phanom-loft.jpg
└── ... (คาเฟ่อื่นๆ)
```

**สำหรับโรงแรม:**
```
frontend/assets/images/places/hotels/
├── the-river-hotel.jpg
├── grand-view-hotel.jpg
└── ... (โรงแรมอื่นๆ)
```

### ขั้นตอนที่ 3: แก้ไขไฟล์ `places-data.js`

เปิดไฟล์ `frontend/js/places-data.js` และแก้ไข `image` จาก URL เป็น path ของรูปที่คุณวาง:

**ก่อนแก้ไข:**
```javascript
{
    id: 1,
    name: 'พระธาตุพนม',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    ...
}
```

**หลังแก้ไข:**
```javascript
{
    id: 1,
    name: 'พระธาตุพนม',
    image: 'assets/images/places/temples/phra-that-phanom.jpg',
    ...
}
```

---

## 📝 ตัวอย่างการแก้ไขทั้งหมด

### วัด (Temples)

```javascript
temples: [
    {
        id: 1,
        name: 'พระธาตุพนม',
        image: 'assets/images/places/temples/phra-that-phanom.jpg',
        ...
    },
    {
        id: 2,
        name: 'วัดโพธิ์ชัย',
        image: 'assets/images/places/temples/wat-pho-chai.jpg',
        ...
    }
]
```

### คาเฟ่ (Cafes)

```javascript
cafes: [
    {
        id: 5,
        name: 'Mekong Riverside Café',
        image: 'assets/images/places/cafes/mekong-riverside-cafe.jpg',
        ...
    },
    {
        id: 6,
        name: 'Sunset View Coffee',
        image: 'assets/images/places/cafes/sunset-view-coffee.jpg',
        ...
    }
]
```

### โรงแรม (Hotels)

```javascript
hotels: [
    {
        id: 17,
        name: 'The River Hotel Nakhon Phanom',
        image: 'assets/images/places/hotels/the-river-hotel.jpg',
        ...
    }
]
```

---

## 🎨 เคล็ดลับการถ่ายรูป

1. **แสงสว่าง:** ถ่ายในเวลาที่แสงดี (เช้า หรือ บ่าย)
2. **มุมกล้อง:** ถ่ายให้เห็นบรรยากาศของสถานที่
3. **ความคมชัด:** ตรวจสอบว่ารูปไม่เบลอ
4. **สีสัน:** ปรับสีให้สวยงาม แต่ไม่เกินจริง

---

## 🔧 การ Optimize รูป (ถ้าต้องการ)

### ใช้เครื่องมือออนไลน์:
- **TinyPNG**: https://tinypng.com (ลดขนาดไฟล์)
- **Squoosh**: https://squoosh.app (ปรับขนาดและคุณภาพ)
- **Canva**: https://canva.com (ตัดแต่งรูป)

### ขนาดที่แนะนำ:
- **Card Image**: 800x600px (4:3)
- **Hero Image**: 1920x1080px (16:9)
- **Thumbnail**: 400x300px (4:3)

---

## ❓ คำถามที่พบบ่อย

**Q: รูปไม่แสดง?**
- ตรวจสอบ path ว่าถูกต้องหรือไม่
- ตรวจสอบชื่อไฟล์ว่าตรงกันหรือไม่ (case-sensitive)
- Hard refresh (Ctrl + Shift + R)

**Q: รูปโหลดช้า?**
- ลดขนาดไฟล์ด้วย TinyPNG
- ใช้ format WebP แทน JPG

**Q: ต้องการใช้รูปจาก URL ภายนอก?**
- ใช้ได้เลย แค่ใส่ URL เต็มใน `image` field
- ตัวอย่าง: `image: 'https://example.com/image.jpg'`

---

## 📞 ต้องการความช่วยเหลือ?

หากมีปัญหาหรือข้อสงสัย สามารถถามได้เลยครับ!

---

**Happy Coding! 🚀**
