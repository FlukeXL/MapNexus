# 🗺️ OpenStreetMap Setup Guide

## การใช้งาน OpenStreetMap (ไม่ต้อง API Key!)

MapNexus ใช้ **OpenStreetMap** ผ่าน **Leaflet.js** ซึ่ง:
- ✅ **ฟรี 100%** - ไม่ต้องสมัคร API Key
- ✅ **ไม่มีค่าใช้จ่าย** - ไม่มี quota limit
- ✅ **Open Source** - ใช้งานได้ทันที
- ✅ **นำทางด้วย Google Maps** - เมื่อคลิกปุ่มนำทาง

---

## 🎨 ฟีเจอร์ของแผนที่

### 1. **Custom Markers สีสันสวยงาม**
- 🟡 **วัดและศาสนสถาน** - สีทอง (#d4af37) + emoji 🛕
- 🔵 **คาเฟ่** - สีน้ำเงิน (#2196F3) + emoji ☕
- 🟢 **โรงแรม** - สีเขียว (#4CAF50) + emoji 🏨

### 2. **Popup Window**
เมื่อคลิกที่ Marker จะแสดง:
- รูปภาพสถานที่
- ชื่อสถานที่
- คะแนนรีวิว
- ที่ตั้ง
- **ปุ่มนำทาง** → เปิด Google Maps เพื่อนำทางจริง

### 3. **ปุ่ม Toggle**
- คลิกปุ่มแผนที่ในแถบ Filter เพื่อแสดง/ซ่อนแผนที่
- แผนที่จะซ่อนอยู่ตอนเริ่มต้น

### 4. **Auto Fit Bounds**
- แผนที่จะ zoom อัตโนมัติให้เห็นทุก markers
- ปรับระดับ zoom ให้เหมาะสม

---

## 📍 การอัพเดทพิกัด GPS

พิกัดปัจจุบันเป็นพิกัดประมาณของนครพนม คุณสามารถอัพเดทพิกัดจริงได้ที่:

**ไฟล์:** `frontend/js/places-data.js`

```javascript
{
    id: 1,
    name: 'พระธาตุพนม',
    lat: 16.9286,  // ← แก้ไขพิกัดจริงที่นี่
    lng: 104.7142, // ← แก้ไขพิกัดจริงที่นี่
    // ... ข้อมูลอื่นๆ
}
```

### วิธีหาพิกัด GPS:

1. **Google Maps:**
   - เปิด [Google Maps](https://maps.google.com)
   - คลิกขวาที่สถานที่
   - คลิกที่พิกัด (เช่น 17.4070, 104.7720)
   - คัดลอกพิกัด

2. **Google Maps URL:**
   - URL จะมีรูปแบบ: `https://maps.google.com/?q=17.4070,104.7720`
   - เลขคือ lat, lng

---

## 🧭 การนำทาง

เมื่อผู้ใช้คลิกปุ่ม "นำทางด้วย Google Maps" จะเปิด URL:

```
https://www.google.com/maps/dir/?api=1&destination=LAT,LNG
```

**ผลลัพธ์:**
- บนมือถือ → เปิด Google Maps App
- บนคอมพิวเตอร์ → เปิด Google Maps Web
- แสดงเส้นทางจากตำแหน่งปัจจุบันไปยังสถานที่

---

## 🎨 การปรับแต่ง

### เปลี่ยนสีของ Markers:

แก้ไขไฟล์ `frontend/js/explore-map.js`:

```javascript
const markerIcons = {
    temple: {
        // เปลี่ยนสีใน SVG
        fill="#d4af37"  // ← เปลี่ยนสีทอง
    },
    cafe: {
        fill="#2196F3"  // ← เปลี่ยนสีน้ำเงิน
    },
    hotel: {
        fill="#4CAF50"  // ← เปลี่ยนสีเขียว
    }
};
```

### เปลี่ยนขนาดของแผนที่:

แก้ไขไฟล์ `frontend/css/map.css`:

```css
.map-container {
    height: 500px; /* ← เปลี่ยนความสูง */
}
```

### เปลี่ยน Map Tiles:

แก้ไขไฟล์ `frontend/js/explore-map.js`:

```javascript
// OpenStreetMap (Default)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')

// CartoDB Positron (สีอ่อน)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png')

// CartoDB Dark Matter (สีเข้ม)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png')
```

---

## 🚀 การทดสอบ

1. เปิดไฟล์ `frontend/explore.html` ในเบราว์เซอร์
2. คลิกปุ่มแผนที่ในแถบ Filter
3. แผนที่จะแสดงพร้อม Markers ทั้งหมด
4. คลิกที่ Marker เพื่อดู Popup
5. คลิกปุ่ม "นำทางด้วย Google Maps" เพื่อทดสอบการนำทาง

---

## ⚠️ ข้อดีของ OpenStreetMap

- ✅ **ฟรี 100%** - ไม่มีค่าใช้จ่าย
- ✅ **ไม่ต้อง API Key** - ใช้งานได้ทันที
- ✅ **ไม่มี Quota** - ไม่จำกัดจำนวนครั้ง
- ✅ **Open Source** - ชุมชนใหญ่
- ✅ **นำทางด้วย Google Maps** - เมื่อต้องการนำทางจริง

---

## 📞 ติดต่อ

หากมีปัญหาหรือต้องการความช่วยเหลือ:
- อ่าน [Leaflet Documentation](https://leafletjs.com/)
- ดู [OpenStreetMap Wiki](https://wiki.openstreetmap.org/)

