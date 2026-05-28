# 📁 Food Images

โฟลเดอร์สำหรับรูปภาพในหน้า Local Food

## โครงสร้าง

```
food/
├── musttry/      ← รูปเมนู MUSTTRY (อาหารต้องลอง)
├── foodtruck/    ← รูปเมนู FOODTRUCK (รถอาหารริมโขง)
└── streetfood/   ← รูปเมนู STREETFOOD (อาหารริมทาง)
```

## วิธีใช้งาน

ใส่รูปในโฟลเดอร์ที่ตรงกับหมวด แล้วอ้างอิง path ใน `food.html`

### ตัวอย่าง path ที่ใช้ใน SHOP_DATA:

```js
// MUSTTRY
images: [
    'assets/images/food/musttry/menu1.jpg',
    'assets/images/food/musttry/shop1.jpg',
    'assets/images/food/musttry/inside1.jpg'
]

// FOODTRUCK
images: [
    'assets/images/food/foodtruck/truck1.jpg',
    'assets/images/food/foodtruck/menu1.jpg'
]

// STREETFOOD
images: [
    'assets/images/food/streetfood/stall1.jpg',
    'assets/images/food/streetfood/food1.jpg'
]
```

## รูปแบบไฟล์ที่แนะนำ
- `.jpg` หรือ `.webp` — ขนาดเล็ก โหลดเร็ว
- ความละเอียดแนะนำ: **800×600px** ขึ้นไป
- ขนาดไฟล์: ไม่เกิน **500KB** ต่อรูป
