# 🗺️ Google Maps Setup Guide

## การตั้งค่า Google Maps API

### ขั้นตอนที่ 1: สร้าง API Key

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้างโปรเจกต์ใหม่หรือเลือกโปรเจกต์ที่มีอยู่
3. ไปที่ **APIs & Services** > **Credentials**
4. คลิก **Create Credentials** > **API Key**
5. คัดลอก API Key ที่ได้

### ขั้นตอนที่ 2: เปิดใช้งาน Google Maps JavaScript API

1. ไปที่ **APIs & Services** > **Library**
2. ค้นหา **Maps JavaScript API**
3. คลิก **Enable**

### ขั้นตอนที่ 3: ใส่ API Key ในโค้ด

แก้ไขไฟล์ `frontend/explore.html` บรรทัดที่มี:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
```

เปลี่ยน `YOUR_API_KEY` เป็น API Key ของคุณ:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&callback=initMap" async defer></script>
```

---

## 🎨 ฟีเจอร์ของแผนที่

### 1. **Custom Markers สีสันสวยงาม**
- 🟡 **วัดและศาสนสถาน** - สีทอง (#d4af37)
- 🔵 **คาเฟ่** - สีน้ำเงิน (#2196F3)
- 🟢 **โรงแรม** - สีเขียว (#4CAF50)

### 2. **Info Window**
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
function getMarkerColor(type) {
    const colors = {
        temple: '#d4af37', // ← เปลี่ยนสีทอง
        cafe: '#2196F3',   // ← เปลี่ยนสีน้ำเงิน
        hotel: '#4CAF50'   // ← เปลี่ยนสีเขียว
    };
    return colors[type] || '#9E9E9E';
}
```

### เปลี่ยนขนาดของแผนที่:

แก้ไขไฟล์ `frontend/css/map.css`:

```css
.map-container {
    height: 500px; /* ← เปลี่ยนความสูง */
}
```

---

## 🚀 การทดสอบ

1. เปิดไฟล์ `frontend/explore.html` ในเบราว์เซอร์
2. คลิกปุ่มแผนที่ในแถบ Filter
3. แผนที่จะแสดงพร้อม Markers ทั้งหมด
4. คลิกที่ Marker เพื่อดู Info Window
5. คลิกปุ่ม "นำทางด้วย Google Maps" เพื่อทดสอบการนำทาง

---

## ⚠️ หมายเหตุ

- **API Key ฟรี:** Google ให้ใช้ฟรี $200/เดือน (ประมาณ 28,000 ครั้ง)
- **Quota:** ตรวจสอบ quota ที่ Google Cloud Console
- **Security:** ควรจำกัด API Key ให้ใช้ได้เฉพาะโดเมนของคุณ

---

## 📞 ติดต่อ

หากมีปัญหาหรือต้องการความช่วยเหลือ:
- อ่าน [Google Maps Documentation](https://developers.google.com/maps/documentation/javascript)
- ดู [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
