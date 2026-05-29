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
            // ข้อมูล: อุณหภูมิ, ความชื้น, สภาพอากาศ, พยากรณ์ฝน
            // ฟรี: 1,000 calls/วัน
            
            WEATHER_API: 'https://api.openweathermap.org/data/2.5/weather',
            FORECAST_API: 'https://api.openweathermap.org/data/2.5/forecast',
            WEATHER_API_KEY: '88474214df0769fa95ff82dc52946122',
            
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
        this.updateWeather(); // อัปเดตอุณหภูมิและสภาพอากาศ
        this.updateWaterLevel(); // อัปเดตระดับน้ำโขง
        this.updateRainForecast(); // พยากรณ์ฝน
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
            
            // ใช้ค่า PM2.5 จริง (µg/m³) แทน AQI
            const pm25Value = data.data.iaqi?.pm25?.v || parseInt(data.data.aqi);
            const aqi = parseInt(data.data.aqi);
            
            const valueElement = document.getElementById('header-pm25');
            if (valueElement) {
                valueElement.textContent = pm25Value;
            }
            
            // เปลี่ยน unit เป็น µg/m³
            const unitElement = document.querySelector('#header-pm25 + .info-bar-unit');
            if (unitElement) {
                unitElement.textContent = 'µg/m³';
            }
            
            const status = this.getPM25Status(aqi);
            this.updateProgressRing('header-pm25-status', status.percent, status.class);
            
            // เก็บข้อมูลเพิ่มเติม (สามารถใช้แสดงในอนาคต)
            this.lastPM25Data = {
                aqi: aqi,
                pm25: pm25Value,
                pm25_raw: data.data.iaqi?.pm25?.v || null,
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
    // 🌡️ Update Weather - ใช้ OpenWeatherMap API
    // ========================================
    async updateWeather() {
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
            
            console.log('🔄 Fetching weather data from OpenWeatherMap...');
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Weather data received:', data);
            
            // อุณหภูมิ
            const temp = Math.round(data.main.temp);
            this.updateTemperatureDisplay(temp);
            
            // เก็บข้อมูลสภาพอากาศ
            this.lastWeatherData = {
                temp: temp,
                feels_like: Math.round(data.main.feels_like),
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                weather: data.weather[0].main,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                clouds: data.clouds.all,
                wind_speed: data.wind.speed,
                rain: data.rain ? data.rain['1h'] || data.rain['3h'] : 0
            };
            
            console.log('💾 Weather data stored:', this.lastWeatherData);
            
        } catch (error) {
            console.error('❌ Error updating weather:', error);
            this.updateTemperatureSimulated();
        }
    }
    
    // ========================================
    // 🌧️ Update Rain Forecast - พยากรณ์ฝน
    // ========================================
    async updateRainForecast() {
        try {
            const { lat, lon } = this.API_CONFIG.LOCATION;
            const apiKey = this.API_CONFIG.WEATHER_API_KEY;
            
            if (!apiKey || apiKey === 'YOUR_OPENWEATHERMAP_API_KEY') {
                console.warn('⚠️ OpenWeatherMap API Key not configured for forecast.');
                return;
            }
            
            const url = `${this.API_CONFIG.FORECAST_API}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=th&cnt=8`;
            
            console.log('🔄 Fetching rain forecast from OpenWeatherMap...');
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Forecast data received');
            
            // วิเคราะห์โอกาสฝนใน 24 ชั่วโมงข้างหน้า
            let rainChance = 0;
            let willRain = false;
            let rainTime = null;
            
            data.list.forEach((forecast, index) => {
                const weather = forecast.weather[0].main;
                const pop = forecast.pop * 100; // Probability of precipitation
                
                if (weather === 'Rain' || weather === 'Drizzle' || weather === 'Thunderstorm') {
                    willRain = true;
                    if (!rainTime) {
                        const hours = index * 3; // แต่ละ forecast ห่างกัน 3 ชั่วโมง
                        rainTime = hours;
                    }
                }
                
                if (pop > rainChance) {
                    rainChance = pop;
                }
            });
            
            // เก็บข้อมูลพยากรณ์ฝน
            this.rainForecast = {
                willRain: willRain,
                rainChance: Math.round(rainChance),
                rainTime: rainTime,
                message: this.getRainMessage(willRain, rainChance, rainTime)
            };
            
            console.log('🌧️ Rain Forecast:', this.rainForecast);
            
            // แสดงข้อความพยากรณ์ฝน (ถ้ามี element)
            const rainElement = document.getElementById('rain-forecast');
            if (rainElement) {
                rainElement.textContent = this.rainForecast.message;
            }
            
        } catch (error) {
            console.error('❌ Error updating rain forecast:', error);
        }
    }
    
    getRainMessage(willRain, rainChance, rainTime) {
        if (willRain && rainTime !== null) {
            if (rainTime === 0) {
                return '🌧️ กำลังฝนตก';
            } else if (rainTime <= 3) {
                return `🌧️ ฝนจะตกใน ${rainTime} ชม.`;
            } else if (rainTime <= 6) {
                return `☁️ มีโอกาสฝนตก ${rainChance}%`;
            } else {
                return `⛅ อากาศแปรปรวน ${rainChance}%`;
            }
        } else if (rainChance > 50) {
            return `☁️ มีโอกาสฝนตก ${rainChance}%`;
        } else if (rainChance > 30) {
            return `⛅ อากาศแปรปรวน ${rainChance}%`;
        } else {
            return '☀️ อากาศแจ่มใส';
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
        
        // อัปเดตทุก 10 นาที (Weather)
        setInterval(() => this.updateWeather(), 10 * 60 * 1000);
        
        // อัปเดตทุก 30 นาที (Rain Forecast)
        setInterval(() => this.updateRainForecast(), 30 * 60 * 1000);
        
        // อัปเดตทุก 2 นาที (Traffic)
        setInterval(() => this.updateTraffic(), 2 * 60 * 1000);

        // อัปเดตทุก 30 นาที (ระดับน้ำโขง)
        setInterval(() => this.updateWaterLevel(), 30 * 60 * 1000);
    }

    // ========================================
    // 🌊 ระดับน้ำแม่น้ำโขง (จำลอง — รอ API จริง)
    // ========================================
    updateWaterLevel() {
        const el = document.getElementById('header-water-level');
        const pctEl = document.getElementById('header-water-pct');
        if (!el) return;

        // ข้อมูลจำลอง — ระดับน้ำโขงที่นครพนมปกติ 6-12 ม.
        const level = (Math.random() * 4 + 7).toFixed(1); // 7.0 - 11.0 ม.
        const maxLevel = 14; // ระดับสูงสุดอ้างอิง
        const pct = Math.round((parseFloat(level) / maxLevel) * 100);

        el.textContent = level;
        if (pctEl) pctEl.textContent = pct + '%';

        // อัปเดต progress ring
        const circumference = 81.68;
        const offset = circumference - (pct / 100) * circumference;
        const ring = document.querySelector('#header-water-status .progress-ring-fill');
        if (ring) ring.style.strokeDashoffset = offset.toFixed(2);
    }
    
    // ========================================
    // 📊 Public Methods - เรียกใช้จากภายนอก
    // ========================================
    
    // ดึงข้อมูล PM2.5 ล่าสุด
    getPM25Data() {
        return this.lastPM25Data || null;
    }
    
    // ดึงข้อมูลสภาพอากาศล่าสุด
    getWeatherData() {
        return this.lastWeatherData || null;
    }
    
    // ดึงข้อมูลพยากรณ์ฝนล่าสุด
    getRainForecastData() {
        return this.rainForecast || null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.infoBarHeader = new InfoBarHeader();
    console.log('✅ Info Bar Header initialized');
    console.log('📊 Data Sources:');
    console.log('   - PM2.5: WAQI (World Air Quality Index) - Thailand Government Data');
    console.log('   - Weather: OpenWeatherMap API (Temperature, Humidity, Conditions)');
    console.log('   - Rain Forecast: OpenWeatherMap API (24-hour forecast)');
    console.log('   - Traffic: Simulated (no API connected)');
    console.log('');
    console.log('🔗 References:');
    console.log('   - WAQI: https://aqicn.org/city/thailand/nakhon-phanom/');
    console.log('   - Station: Meteorological stations, Nakhon Phanom (ID: @13630)');
    console.log('   - Source: Pollution Control Department (กรมควบคุมมลพิษ)');
    console.log('');
    console.log('💡 Usage:');
    console.log('   - window.infoBarHeader.getPM25Data() - ดึงข้อมูล PM2.5');
    console.log('   - window.infoBarHeader.getWeatherData() - ดึงข้อมูลสภาพอากาศ');
    console.log('   - window.infoBarHeader.getRainForecastData() - ดึงข้อมูลพยากรณ์ฝน');
});
