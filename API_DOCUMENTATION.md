# 📡 API Documentation - MapNexus

## ✅ API ที่เชื่อมต่อแล้ว

### 1. 🌫️ PM2.5 API - WAQI (World Air Quality Index)

**แหล่งข้อมูล:** กรมควบคุมมลพิษ (Pollution Control Department)  
**เว็บไซต์:** https://aqicn.org/  
**ฟรี:** 1,000 requests/second

#### Endpoint
```
https://api.waqi.info/feed/@13630/?token=YOUR_TOKEN
```

#### ข้อมูลที่ได้รับ
- **AQI** (Air Quality Index) - ดัชนีคุณภาพอากาศ
- **PM2.5** - ฝุ่นละอองขนาดเล็ก
- **PM10** - ฝุ่นละอองขนาดใหญ่
- **Temperature** - อุณหภูมิ (ถ้ามี)
- **Humidity** - ความชื้น (ถ้ามี)
- **Pressure** - ความกดอากาศ (ถ้ามี)

#### การใช้งาน
```javascript
// ดึงข้อมูล PM2.5 ล่าสุด
const pm25Data = window.infoBarHeader.getPM25Data();
console.log('AQI:', pm25Data.aqi);
console.log('PM2.5:', pm25Data.pm25);
console.log('Station:', pm25Data.station);
```

#### ตัวอย่างข้อมูล
```json
{
  "aqi": 32,
  "pm25": 12,
  "pm10": 18,
  "temperature": 28,
  "humidity": 65,
  "station": "Meteorological stations, Nakhon Phanom",
  "time": "2024-01-15T10:00:00+07:00",
  "source": "Pollution Control Department"
}
```

---

### 2. 🌡️ Weather API - OpenWeatherMap

**เว็บไซต์:** https://openweathermap.org/api  
**ฟรี:** 1,000 calls/วัน

#### Endpoint - Current Weather
```
https://api.openweathermap.org/data/2.5/weather?lat=17.4081&lon=104.7695&appid=YOUR_KEY&units=metric&lang=th
```

#### ข้อมูลที่ได้รับ
- **Temperature** - อุณหภูมิปัจจุบัน
- **Feels Like** - อุณหภูมิที่รู้สึก
- **Temp Min/Max** - อุณหภูมิต่ำสุด/สูงสุด
- **Humidity** - ความชื้น
- **Pressure** - ความกดอากาศ
- **Weather** - สภาพอากาศ (Clear, Clouds, Rain, etc.)
- **Description** - คำอธิบาย (ท้องฟ้าแจ่มใส, มีเมฆบางส่วน, ฝนตก)
- **Wind Speed** - ความเร็วลม
- **Clouds** - เปอร์เซ็นต์เมฆ
- **Visibility** - ทัศนวิสัย
- **Sunrise/Sunset** - เวลาพระอาทิตย์ขึ้น/ตก

#### การใช้งาน
```javascript
// ดึงข้อมูลสภาพอากาศล่าสุด
const weatherData = window.infoBarHeader.getWeatherData();
console.log('Temperature:', weatherData.temp + '°C');
console.log('Feels Like:', weatherData.feels_like + '°C');
console.log('Humidity:', weatherData.humidity + '%');
console.log('Weather:', weatherData.weather);
console.log('Description:', weatherData.description);
```

#### ตัวอย่างข้อมูล
```json
{
  "temp": 28,
  "feels_like": 30,
  "humidity": 65,
  "pressure": 1012,
  "weather": "Clear",
  "description": "ท้องฟ้าแจ่มใส",
  "icon": "01d",
  "clouds": 10,
  "wind_speed": 3.5,
  "rain": 0
}
```

---

### 3. 🌧️ Rain Forecast API - OpenWeatherMap

#### Endpoint - 5 Day Forecast
```
https://api.openweathermap.org/data/2.5/forecast?lat=17.4081&lon=104.7695&appid=YOUR_KEY&units=metric&lang=th
```

#### ข้อมูลที่ได้รับ
- **Will Rain** - จะมีฝนหรือไม่ (true/false)
- **Rain Chance** - โอกาสฝนตก (%)
- **Rain Time** - ฝนจะตกในกี่ชั่วโมง
- **Message** - ข้อความพยากรณ์

#### การใช้งาน
```javascript
// ดึงข้อมูลพยากรณ์ฝนล่าสุด
const rainData = window.infoBarHeader.getRainForecastData();
console.log('Will Rain:', rainData.willRain);
console.log('Rain Chance:', rainData.rainChance + '%');
console.log('Rain Time:', rainData.rainTime + ' hours');
console.log('Message:', rainData.message);
```

#### ตัวอย่างข้อมูล
```json
{
  "willRain": true,
  "rainChance": 75,
  "rainTime": 3,
  "message": "🌧️ ฝนจะตกใน 3 ชม."
}
```

#### ข้อความพยากรณ์
- `🌧️ กำลังฝนตก` - ฝนกำลังตก
- `🌧️ ฝนจะตกใน X ชม.` - ฝนจะตกภายใน 3 ชั่วโมง
- `☁️ มีโอกาสฝนตก X%` - โอกาสฝนตก 50-100%
- `⛅ อากาศแปรปรวน X%` - โอกาสฝนตก 30-50%
- `☀️ อากาศแจ่มใส` - โอกาสฝนตกต่ำกว่า 30%

---

### 4. 🚗 Traffic API (ยังไม่เชื่อมต่อ)

**สถานะ:** ใช้ข้อมูลจำลอง

#### ตัวเลือก API ที่แนะนำ:
1. **Google Maps Traffic API** (เสียเงิน)
2. **TomTom Traffic API** (เสียเงิน)
3. **HERE Traffic API** (เสียเงิน)

---

## 🔄 การอัปเดตอัตโนมัติ

### ความถี่ในการอัปเดต
- **PM2.5:** ทุก 5 นาที
- **Weather:** ทุก 10 นาที
- **Rain Forecast:** ทุก 30 นาที
- **Traffic:** ทุก 2 นาที (ข้อมูลจำลอง)

---

## 📊 วิธีใช้งาน API

### 1. ใน Info Bar Header (index.html)
```html
<!-- Info Bar จะแสดงข้อมูลอัตโนมัติ -->
<div class="info-bar-header">
    <div class="info-bar-container">
        <div class="info-bar-item">
            <span id="header-pm25">32</span> AQI
        </div>
        <div class="info-bar-item">
            <span id="header-temp">28</span>°C
        </div>
        <div class="info-bar-item">
            <span id="rain-forecast">☀️ อากาศแจ่มใส</span>
        </div>
    </div>
</div>
```

### 2. ใน JavaScript
```javascript
// รอให้ API โหลดเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    // ดึงข้อมูล PM2.5
    setTimeout(() => {
        const pm25 = window.infoBarHeader.getPM25Data();
        console.log('PM2.5 Data:', pm25);
    }, 2000);
    
    // ดึงข้อมูลสภาพอากาศ
    setTimeout(() => {
        const weather = window.infoBarHeader.getWeatherData();
        console.log('Weather Data:', weather);
    }, 2000);
    
    // ดึงข้อมูลพยากรณ์ฝน
    setTimeout(() => {
        const rain = window.infoBarHeader.getRainForecastData();
        console.log('Rain Forecast:', rain);
    }, 2000);
});
```

### 3. ในหน้า Weather (weather.html)
```html
<!-- เพิ่ม script -->
<script src="js/weather-api.js"></script>

<!-- Container สำหรับแสดงข้อมูล -->
<div id="current-weather"></div>
<div id="weather-forecast"></div>
```

---

## 🔑 API Keys

### WAQI Token
```
b43f5d3e29f96181a99f3eb796951a6db702a306
```
- **ฟรี:** 1,000 requests/second
- **ไม่จำกัด:** requests ต่อวัน

### OpenWeatherMap API Key
```
88474214df0769fa95ff82dc52946122
```
- **ฟรี:** 1,000 calls/วัน
- **Limit:** ~42 calls/ชั่วโมง

---

## 📍 Location - นครพนม

```javascript
{
    lat: 17.4081,
    lon: 104.7695,
    name: 'Nakhon Phanom'
}
```

### สถานีวัดคุณภาพอากาศ
- **ชื่อ:** Meteorological stations, Nakhon Phanom
- **ID:** @13630
- **แหล่งข้อมูล:** กรมอุตุนิยมวิทยา

---

## 🧪 การทดสอบ API

### 1. เปิด Console (F12)
```javascript
// ทดสอบ PM2.5
window.infoBarHeader.getPM25Data()

// ทดสอบ Weather
window.infoBarHeader.getWeatherData()

// ทดสอบ Rain Forecast
window.infoBarHeader.getRainForecastData()
```

### 2. ตรวจสอบ Network Tab
- ดู requests ไปยัง API
- ตรวจสอบ response data
- ดู status code (200 = สำเร็จ)

### 3. ตรวจสอบ Console Logs
```
✅ Info Bar Header initialized
🔄 Fetching PM2.5 data from WAQI...
✅ PM2.5 data received from: Meteorological stations, Nakhon Phanom
🔄 Fetching weather data from OpenWeatherMap...
✅ Weather data received
🔄 Fetching rain forecast from OpenWeatherMap...
✅ Forecast data received
🌧️ Rain Forecast: { willRain: true, rainChance: 75, ... }
```

---

## ⚠️ ข้อควรระวัง

### Rate Limits
- **WAQI:** ไม่จำกัด (1,000 req/sec)
- **OpenWeatherMap:** 1,000 calls/วัน (~42/ชั่วโมง)

### Error Handling
- API จะใช้ข้อมูลจำลองถ้าเชื่อมต่อไม่ได้
- ตรวจสอบ Console สำหรับ error messages
- ตรวจสอบ internet connection

### CORS Issues
- API ทั้งหมดรองรับ CORS
- ไม่ต้องใช้ proxy server

---

## 🚀 การใช้งานในอนาคต

### 1. เพิ่ม Traffic API
```javascript
// TODO: เชื่อมต่อ Google Maps Traffic API
async updateTraffic() {
    const url = `https://maps.googleapis.com/maps/api/...`;
    // Implementation here
}
```

### 2. เพิ่มการแจ้งเตือน
```javascript
// แจ้งเตือนเมื่อ PM2.5 สูง
if (pm25Data.aqi > 100) {
    showNotification('⚠️ คุณภาพอากาศไม่ดี!');
}

// แจ้งเตือนเมื่อจะมีฝน
if (rainData.willRain && rainData.rainTime <= 3) {
    showNotification('🌧️ ฝนจะตกใน ' + rainData.rainTime + ' ชม.');
}
```

### 3. บันทึกประวัติ
```javascript
// บันทึกข้อมูลลง localStorage
localStorage.setItem('weather_history', JSON.stringify({
    date: new Date(),
    pm25: pm25Data.aqi,
    temp: weatherData.temp,
    rain: rainData.rainChance
}));
```

---

## 📞 Support

หากมีปัญหาการเชื่อมต่อ API:
1. ตรวจสอบ API Keys ยังใช้งานได้
2. ตรวจสอบ internet connection
3. ดู Console สำหรับ error messages
4. ตรวจสอบ rate limits

---

**อัปเดตล่าสุด:** 2024
**เวอร์ชัน:** 1.0.0
