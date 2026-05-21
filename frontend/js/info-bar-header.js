// Info Bar Header Real-time Updates
// ✅ CONNECTED TO REAL APIs - Thailand Government Data

class InfoBarHeader {
    constructor() {
        // API Configuration
        this.API_CONFIG = {
            // ========================================
            // 🇹🇭 WAQI (World Air Quality Index) API
            // ========================================
            // แหล่งข้อมูล: กรมควบคุมมลพิษ (Pollution Control Department)
            // เว็บไซต์: https://aqicn.org/
            // ข้อมูล: PM2.5, PM10, AQI แบบเรียลไทม์
            // ฟรี: 1,000 requests/second
            
            PM25_API: 'https://api.waqi.info/feed',
            PM25_TOKEN: 'b43f5d3e29f96181a99f3eb796951a6db702a306', // ✅ WAQI Token ของคุณ
            
            // สถานีวัดคุณภาพอากาศนครพนม
            // ชื่อ: Meteorological stations, Nakhon Phanom
            // ID: @13630
            // ที่มา: กรมอุตุนิยมวิทยา
            NAKHON_PHANOM_STATION: '@13630',
            
            // ========================================
            // 🌡️ OpenWeatherMap API
            // ========================================
            // เว็บไซต์: https://openweathermap.org/api
            // ข้อมูล: อุณหภูมิ, ความชื้น, สภาพอากาศ
            // ฟรี: 1,000 calls/วัน
            
            WEATHER_API: 'https://api.openweathermap.org/data/2.5/weather',
            WEATHER_API_KEY: '88474214df0769fa95ff82dc52946122', // ⚠️ ใส่ API Key ของคุณที่นี่
            
            // พิกัดนครพนม
            LOCATION: {
                lat: 17.4081,
                lon: 104.7695,
                name: 'Nakhon Phanom'
            }
        };
        
        this.RADIUS = 13; // Circle radius for progress ring
        
        this.init();
        this.startUpdates();
    }

    init() {
        this.updatePM25();
        this.updateTemperature();
        this.updateTraffic(); // ยังใช้ข้อมูลจำลอง
    }

    // ========================================
    // 📊 Update PM2.5 - ใช้ WAQI API (ข้อมูลจริงจากกรมควบคุมมลพิษ)
    // ========================================
    async updatePM25() {
        try {
            const station = this.API_CONFIG.NAKHON_PHANOM_STATION;
            const token = this.API_CONFIG.PM25_TOKEN;
            const url = `${this.API_CONFIG.PM25_API}/${station}/?token=${token}`;
            
            console.log('🔄 Fetching PM2.5 data from WAQI (Thailand Government)...');
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status !== 'ok') {
                throw new Error(`API error: ${data.data || 'Unknown error'}`);
            }
            
            console.log('✅ PM2.5 data received from:', data.data.city.name);
            console.log('📍 Station:', data.data.city.name);
            console.log('📊 AQI:', data.data.aqi);
            console.log('🏛️ Source:', data.data.attributions[0]?.name || 'Government');
            console.log('📈 Full Data:', data.data);
            
            // ใช้ AQI ที่ได้จาก API
            const aqi = parseInt(data.data.aqi);
            
            const valueElement = document.getElementById('header-pm25');
            if (valueElement) {
                valueElement.textContent = aqi;
            }
            
            const status = this.getPM25Status(aqi);
            this.updateProgressRing('header-pm25-status', status.percent, status.class);
            
            // เก็บข้อมูลเพิ่มเติม (สามารถใช้แสดงในอนาคต)
            this.lastPM25Data = {
                aqi: aqi,
                pm25: data.data.iaqi?.pm25?.v || null,
                pm10: data.data.iaqi?.pm10?.v || null,
                temperature: data.data.iaqi?.t?.v || null,
                humidity: data.data.iaqi?.h?.v || null,
                pressure: data.data.iaqi?.p?.v || null,
                wind: data.data.iaqi?.w?.v || null,
                station: data.data.city.name,
                time: data.data.time.s,
                source: data.data.attributions[0]?.name || 'Pollution Control Department',
                dominentpol: data.data.dominentpol
            };
            
            console.log('💾 Stored data:', this.lastPM25Data);
            
            // ถ้ามีข้อมูลอุณหภูมิจาก WAQI ให้ใช้เลย (ไม่ต้องเรียก OpenWeatherMap)
            if (this.lastPM25Data.temperature) {
                console.log('🌡️ Using temperature from WAQI:', this.lastPM25Data.temperature + '°C');
                this.updateTemperatureFromWAQI(this.lastPM25Data.temperature);
            }
            
        } catch (error) {
            console.error('❌ Error updating PM2.5:', error);
            console.warn('⚠️ Using fallback data. Please check:');
            console.warn('   1. Internet connection');
            console.warn('   2. WAQI API Token is correct');
            console.warn('   3. Station ID is correct (@13630 for Nakhon Phanom)');
            
            const valueElement = document.getElementById('header-pm25');
            if (valueElement) valueElement.textContent = '--';
        }
    }

    getPM25Status(aqi) {
        let percent, cssClass;
        
        // ตามมาตรฐาน US EPA AQI
        if (aqi <= 50) {
            // Good (0-50)
            percent = Math.round((aqi / 50) * 100);
            cssClass = 'good';
        } else if (aqi <= 100) {
            // Moderate (51-100)
            percent = Math.round(((aqi - 50) / 50) * 100);
            cssClass = 'moderate';
        } else if (aqi <= 150) {
            // Unhealthy for Sensitive Groups (101-150)
            percent = 100;
            cssClass = 'unhealthy';
        } else if (aqi <= 200) {
            // Unhealthy (151-200)
            percent = 100;
            cssClass = 'unhealthy';
        } else if (aqi <= 300) {
            // Very Unhealthy (201-300)
            percent = 100;
            cssClass = 'unhealthy';
        } else {
            // Hazardous (300+)
            percent = 100;
            cssClass = 'unhealthy';
        }
        
        return { percent, class: cssClass };
    }

    // ========================================
    // 🚗 Update Traffic - ยังใช้ข้อมูลจำลอง
    // ========================================
    async updateTraffic() {
        try {
            // TODO: เชื่อมต่อกับ Traffic API จริง
            // ตัวเลือก:
            // - Google Maps Traffic API (เสียเงิน)
            // - TomTom Traffic API (เสียเงิน)
            // - HERE Traffic API (เสียเงิน)
            
            const trafficLevels = [
                { text: 'ราบรื่น', percent: 20, class: 'smooth' },
                { text: 'ปานกลาง', percent: 55, class: 'moderate' },
                { text: 'หนาแน่น', percent: 85, class: 'unhealthy' }
            ];
            
            const randomStatus = trafficLevels[Math.floor(Math.random() * trafficLevels.length)];
            
            const valueElement = document.getElementById('header-traffic');
            if (valueElement) {
                valueElement.textContent = randomStatus.text;
            }
            
            this.updateProgressRing('header-traffic-status', randomStatus.percent, randomStatus.class);
            
        } catch (error) {
            console.error('❌ Error updating traffic:', error);
            const valueElement = document.getElementById('header-traffic');
            if (valueElement) valueElement.textContent = '--';
        }
    }

    // ========================================
    // 🌡️ Update Temperature - ใช้ OpenWeatherMap API
    // ========================================
    async updateTemperature() {
        try {
            const { lat, lon } = this.API_CONFIG.LOCATION;
            const apiKey = this.API_CONFIG.WEATHER_API_KEY;
            
            // ตรวจสอบว่ามี API Key หรือไม่
            if (!apiKey || apiKey === 'YOUR_OPENWEATHERMAP_API_KEY') {
                console.warn('⚠️ OpenWeatherMap API Key not configured.');
                console.warn('   Get free API Key at: https://openweathermap.org/api');
                console.warn('   Using simulated data...');
                this.updateTemperatureSimulated();
                return;
            }
            
            const url = `${this.API_CONFIG.WEATHER_API}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=th`;
            
            console.log('🔄 Fetching temperature data from OpenWeatherMap...');
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Temperature data received:', data.main.temp + '°C');
            
            const temp = Math.round(data.main.temp);
            
            this.updateTemperatureDisplay(temp);
            
        } catch (error) {
            console.error('❌ Error updating temperature:', error);
            this.updateTemperatureSimulated();
        }
    }

    // ใช้อุณหภูมิจาก WAQI (ถ้ามี)
    updateTemperatureFromWAQI(temp) {
        const temperature = Math.round(temp);
        this.updateTemperatureDisplay(temperature);
    }

    // แสดงอุณหภูมิ
    updateTemperatureDisplay(temp) {
        const valueElement = document.getElementById('header-temp');
        if (valueElement) {
            valueElement.textContent = temp;
        }
        
        let status = { percent: 25, class: 'good' };
        if (temp >= 35) {
            status = { percent: 80, class: 'hot' };
        } else if (temp >= 30) {
            status = { percent: Math.round(((temp - 25) / 15) * 100), class: 'warm' };
        } else {
            status = { percent: Math.round((temp / 30) * 50), class: 'good' };
        }
        
        this.updateProgressRing('header-temp-status', status.percent, status.class);
    }

    // Fallback: ใช้ข้อมูลจำลองถ้า API ไม่พร้อม
    updateTemperatureSimulated() {
        const temp = Math.floor(Math.random() * 15) + 25;
        this.updateTemperatureDisplay(temp);
    }

    updateProgressRing(elementId, percent, cssClass) {
        const statusElement = document.getElementById(elementId);
        if (statusElement) {
            const percentElement = statusElement.querySelector('.progress-percent');
            if (percentElement) {
                percentElement.textContent = `${percent}%`;
            }
            
            const progressFill = statusElement.querySelector('.progress-ring-fill');
            if (progressFill) {
                const circumference = 2 * Math.PI * this.RADIUS;
                const offset = circumference - (percent / 100) * circumference;
                progressFill.style.strokeDasharray = circumference;
                progressFill.style.strokeDashoffset = offset;
            }
            
            statusElement.className = `info-bar-progress ${cssClass}`;
        }
    }

    startUpdates() {
        // อัปเดตทุก 5 นาที (PM2.5)
        setInterval(() => this.updatePM25(), 5 * 60 * 1000);
        
        // อัปเดตทุก 2 นาที (Traffic)
        setInterval(() => this.updateTraffic(), 2 * 60 * 1000);
        
        // อัปเดตทุก 10 นาที (Temperature)
        setInterval(() => this.updateTemperature(), 10 * 60 * 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InfoBarHeader();
    console.log('✅ Info Bar Header initialized');
    console.log('📊 Data Sources:');
    console.log('   - PM2.5: WAQI (World Air Quality Index) - Thailand Government Data');
    console.log('   - Temperature: OpenWeatherMap API');
    console.log('   - Traffic: Simulated (no API connected)');
    console.log('');
    console.log('🔗 References:');
    console.log('   - WAQI: https://aqicn.org/city/thailand/nakhon-phanom/');
    console.log('   - Station: Meteorological stations, Nakhon Phanom (ID: @13630)');
    console.log('   - Source: Pollution Control Department (กรมควบคุมมลพิษ)');
});
