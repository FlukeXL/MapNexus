# 📹 วิธีใส่วิดีโอพื้นหลัง Hero Section

## ขั้นตอนการใส่วิดีโอ

1. **วางไฟล์วิดีโอของคุณในโฟลเดอร์นี้**
   - ชื่อไฟล์: `hero-video.mp4` (หรือชื่ออื่นก็ได้)
   - รูปแบบที่แนะนำ: MP4 (H.264) หรือ WebM

2. **ถ้าชื่อไฟล์ไม่ใช่ `hero-video.mp4`**
   - เปิดไฟล์ `frontend/index.html`
   - ค้นหาบรรทัด: `<source src="assets/videos/hero-video.mp4" type="video/mp4">`
   - เปลี่ยนชื่อไฟล์ให้ตรงกับวิดีโอของคุณ

## 📋 ข้อมูลวิดีโอที่แนะนำ

### ขนาดและความละเอียด
- **ความละเอียด**: 1920x1080 (Full HD) หรือ 1280x720 (HD)
- **อัตราส่วน**: 16:9 (แนวนอน)
- **ขนาดไฟล์**: 10-30 MB (สำหรับวิดีโอ 1 นาที)

### รูปแบบไฟล์
- **MP4** (H.264 codec) - รองรับทุก browser ✅
- **WebM** (VP9 codec) - ขนาดเล็กกว่า, รองรับ Chrome, Firefox

### การบีบอัดวิดีโอ
ถ้าไฟล์วิดีโอใหญ่เกินไป (>30 MB) แนะนำให้บีบอัดก่อน:

**ใช้ FFmpeg (ฟรี):**
```bash
# บีบอัดเป็น MP4 ขนาดเล็ก
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k hero-video.mp4

# แปลงเป็น WebM (ขนาดเล็กกว่า)
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus hero-video.webm
```

**ใช้เว็บไซต์ออนไลน์:**
- https://www.freeconvert.com/video-compressor
- https://www.videosmaller.com/
- https://cloudconvert.com/

## 🎬 ตัวอย่างโครงสร้างไฟล์

```
frontend/assets/videos/
├── hero-video.mp4      ← วิดีโอหลัก (MP4)
├── hero-video.webm     ← วิดีโอสำรอง (WebM) - ไม่บังคับ
└── README.md           ← ไฟล์นี้
```

## 🔧 การปรับแต่งเพิ่มเติม

### เปลี่ยนความเร็วการเล่น
เพิ่ม attribute `playbackRate` ใน JavaScript:
```javascript
document.querySelector('.hero-video').playbackRate = 0.75; // เล่นช้า 75%
```

### เพิ่มปุ่มควบคุม (Play/Pause)
เพิ่ม attribute `controls`:
```html
<video class="hero-video" autoplay muted loop playsinline controls>
```

### ปิดการเล่นอัตโนมัติ
ลบ attribute `autoplay`:
```html
<video class="hero-video" muted loop playsinline>
```

## ⚠️ ข้อควรระวัง

1. **ขนาดไฟล์**: วิดีโอขนาดใหญ่จะทำให้เว็บโหลดช้า
2. **Mobile Data**: ผู้ใช้มือถืออาจเสียค่าใช้จ่าย data
3. **Performance**: ควรใช้วิดีโอที่บีบอัดแล้ว
4. **Autoplay**: บาง browser อาจบล็อก autoplay ถ้าไม่มี `muted`

## 📱 การทดสอบ

ทดสอบวิดีโอใน:
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Internet connection: Fast & Slow

## 🆘 แก้ปัญหา

**วิดีโอไม่เล่น:**
- ตรวจสอบชื่อไฟล์และ path ให้ถูกต้อง
- ตรวจสอบรูปแบบไฟล์ (ต้องเป็น MP4 หรือ WebM)
- เปิด Console (F12) ดู error message

**วิดีโอโหลดช้า:**
- บีบอัดวิดีโอให้เล็กลง
- ใช้ CDN หรือ hosting ที่เร็ว
- เพิ่ม `preload="metadata"` แทน `preload="auto"`

**วิดีโอไม่เต็มจอ:**
- ตรวจสอบ CSS class `.hero-video` ใน `frontend/css/style.css`
