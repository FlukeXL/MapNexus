// Weather Page Controller
// จัดการข้อมูลทั้งหมดในหน้าพยากรณ์อากาศ

class WeatherPage {
    constructor() {
        this.API_KEY = '88474214df0769fa95ff82dc52946122';
        this.LOCATION = {
            lat: 17.4081,
            lon: 104.7695,
            name: 'นครพนม'
        };
        
        // อำเภอในจังหวัดนครพนม (12 อำเภอ)
        this.districts = [
            { name: 'เมืองนครพนม', lat: 17.4081, lon: 104.7695 },
            { name: 'ปลาปาก', lat: 17.2167, lon: 104.7167 },
            { name: 'ท่าอุเทน', lat: 17.6167, lon: 104.6167 },
            { name: 'บ้านแพง', lat: 17.3500, lon: 104.8167 },
            { name: 'ธาตุพนม', lat: 16.9333, lon: 104.7333 },
            { name: 'เรณูนคร', lat: 16.7167, lon: 104.6333 },
            { name: 'นาแก', lat: 17.3000, lon: 104.4667 },
            { name: 'ศรีสงคราม', lat: 17.5333, lon: 104.4833 },
            { name: 'นาหว้า', lat: 17.5167, lon: 104.8500 },
            { name: 'โพนสวรรค์', lat: 17.1833, lon: 104.5833 },
            { name: 'นาทม', lat: 17.7500, lon: 104.6500 },
            { name: 'วังยาง', lat: 17.8833, lon: 104.7167 }
        ];
        
        this.init();
    }
    
    async init() {
        console.log('🌤️ Weather Page initialized');
        
        // โหลดข้อมูลทั้งหมด
        await this.loadPM25AllDistricts();
        await this.loadCurrentWeather();
        await this.loadWeatherForecast();
        this.initTrafficSection();
        this.initRiverLevelSection();
        
        // Event Listeners
        this.setupEventListeners();
        
        // Auto refresh
        this.startAutoRefresh();
    }
    
    // ========================================
    // Helper: Create Circular Progress Bar
    // ========================================
    createCircularProgressBar(percentage, size = 'large', statusClass = '') {
        const dimensions = size === 'large' ? 
            { width: 120, radius: 50, strokeWidth: 8 } : 
            { width: 70, radius: 27, strokeWidth: 6 };
        
        const circumference = 2 * Math.PI * dimensions.radius;
        const offset = circumference - (percentage / 100) * circumference;
        
        return `
            <svg class="circular-progress ${size}" width="${dimensions.width}" height="${dimensions.width}">
                <circle class="progress-bg" 
                        cx="${dimensions.width/2}" 
                        cy="${dimensions.width/2}" 
                        r="${dimensions.radius}" 
                        stroke-width="${dimensions.strokeWidth}" />
                <circle class="progress-fill ${statusClass}" 
                        cx="${dimensions.width/2}" 
                        cy="${dimensions.width/2}" 
                        r="${dimensions.radius}"
                        stroke-width="${dimensions.strokeWidth}"
                        stroke-dasharray="${circumference}" 
                        stroke-dashoffset="${offset}" />
            </svg>
            <div class="progress-text">${percentage}%</div>
        `;
    }
    
    // ========================================
    // 1. PM2.5 ทุกอำเภอ
    // ========================================
    async loadPM25AllDistricts() {
        const container = document.getElementById('pm25-districts');
        if (!container) return;
        
        container.innerHTML = '<div class="loading-message">กำลังโหลดข้อมูล PM2.5...</div>';
        
        try {
            // TODO: เชื่อมต่อ API จริงสำหรับแต่ละอำเภอ
            // ตอนนี้ใช้ข้อมูลจำลอง
            
            const pm25Data = await Promise.all(
                this.districts.map(async (district) => {
                    // จำลองข้อมูล PM2.5
                    const pm25 = Math.floor(Math.random() * 250) + 20; // 20-270 µg/m³
                    const aqi = this.convertPM25ToAQI(pm25);
                    const status = this.getPM25Status(aqi);
                    
                    return {
                        district: district.name,
                        pm25: pm25,
                        aqi: aqi,
                        status: status.text,
                        class: status.class,
                        percent: status.percent,
                        updateTime: new Date().toLocaleTimeString('th-TH', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })
                    };
                })
            );
            
            this.displayPM25Districts(pm25Data);
            
            // Update time display
            const timeElement = document.getElementById('pm25-time');
            if (timeElement) {
                timeElement.textContent = new Date().toLocaleTimeString('th-TH', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            }
            
        } catch (error) {
            console.error('❌ Error loading PM2.5 data:', error);
            container.innerHTML = '<div class="error-message">ไม่สามารถโหลดข้อมูล PM2.5 ได้</div>';
        }
    }
    
    displayPM25Districts(data) {
        const container = document.getElementById('pm25-districts');
        if (!container) return;
        
        container.innerHTML = data.map(item => `
            <div class="pm25-card ${item.class}">
                <div class="pm25-card-header">
                    <h3 class="district-name">${item.district}</h3>
                    <span class="update-time">${item.updateTime}</span>
                </div>
                <div class="pm25-value-wrapper">
                    <div class="pm25-value">${item.pm25}</div>
                    <div class="pm25-unit">µg/m³</div>
                </div>
                <div class="pm25-status">${item.status} (AQI: ${item.aqi})</div>
                <div class="pm25-bar">
                    <div class="pm25-bar-fill" style="width: ${item.percent}%"></div>
                </div>
            </div>
        `).join('');
    }
    
    getPM25Status(aqi) {
        if (aqi <= 50) {
            return { text: 'ดี', class: 'good', percent: (aqi / 50) * 100 };
        } else if (aqi <= 100) {
            return { text: 'ปานกลาง', class: 'moderate', percent: ((aqi - 50) / 50) * 100 };
        } else {
            return { text: 'ไม่ดี', class: 'unhealthy', percent: 100 };
        }
    }
    
    // แปลงค่า PM2.5 (µg/m³) เป็น AQI
    convertPM25ToAQI(pm25) {
        // ตาม US EPA AQI Calculation
        if (pm25 <= 12.0) {
            return Math.round((50 / 12.0) * pm25);
        } else if (pm25 <= 35.4) {
            return Math.round(50 + ((100 - 50) / (35.4 - 12.1)) * (pm25 - 12.1));
        } else if (pm25 <= 55.4) {
            return Math.round(100 + ((150 - 100) / (55.4 - 35.5)) * (pm25 - 35.5));
        } else if (pm25 <= 150.4) {
            return Math.round(150 + ((200 - 150) / (150.4 - 55.5)) * (pm25 - 55.5));
        } else if (pm25 <= 250.4) {
            return Math.round(200 + ((300 - 200) / (250.4 - 150.5)) * (pm25 - 150.5));
        } else {
            return Math.round(300 + ((500 - 300) / (500.4 - 250.5)) * (pm25 - 250.5));
        }
    }
    
    // ========================================
    // 2. สภาพอากาศปัจจุบัน
    // ========================================
    async loadCurrentWeather() {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.LOCATION.lat}&lon=${this.LOCATION.lon}&appid=${this.API_KEY}&units=metric&lang=th`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            this.displayCurrentWeather(data);
            
        } catch (error) {
            console.error('❌ Error loading current weather:', error);
        }
    }
    
    displayCurrentWeather(data) {
        // Weather Icon
        const iconElement = document.getElementById('weather-icon');
        if (iconElement) {
            iconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
            iconElement.alt = data.weather[0].description;
        }
        
        // Temperature
        const tempElement = document.getElementById('current-temp');
        if (tempElement) {
            tempElement.textContent = Math.round(data.main.temp);
        }
        
        // Description
        const descElement = document.getElementById('weather-desc');
        if (descElement) {
            descElement.textContent = data.weather[0].description;
        }
        
        // Details
        this.updateElement('feels-like', Math.round(data.main.feels_like) + '°C');
        this.updateElement('humidity', data.main.humidity + '%');
        this.updateElement('wind-speed', data.wind.speed + ' m/s');
        this.updateElement('clouds', data.clouds.all + '%');
        this.updateElement('pressure', data.main.pressure + ' hPa');
        this.updateElement('visibility', (data.visibility / 1000).toFixed(1) + ' km');
    }
    
    // ========================================
    // 3. พยากรณ์อากาศ 5 วัน
    // ========================================
    async loadWeatherForecast() {
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.LOCATION.lat}&lon=${this.LOCATION.lon}&appid=${this.API_KEY}&units=metric&lang=th`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            this.displayForecast(data.list);
            this.checkRainAlert(data.list);
            
        } catch (error) {
            console.error('❌ Error loading forecast:', error);
        }
    }
    
    displayForecast(forecastList) {
        const container = document.getElementById('forecast-grid');
        if (!container) return;
        
        // จัดกลุ่มตามวัน (เอาแค่ 5 วันแรก)
        const dailyForecasts = this.groupForecastByDay(forecastList);
        const days = Object.keys(dailyForecasts).slice(0, 5);
        
        container.innerHTML = days.map(dayKey => {
            const day = dailyForecasts[dayKey];
            const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
            
            return `
                <div class="forecast-card">
                    <h3 class="forecast-day">${dayKey}</h3>
                    <img src="${iconUrl}" alt="${day.main_weather}" class="forecast-icon">
                    <p class="forecast-weather">${day.main_weather}</p>
                    <div class="forecast-temp">
                        <span class="temp-max">${day.temp_max}°</span>
                        <span class="temp-min">${day.temp_min}°</span>
                    </div>
                    <div class="forecast-details">
                        <span>💧 ${day.humidity_avg}%</span>
                        ${day.rain > 0 ? `<span>🌧️ ${day.rain.toFixed(1)}mm</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    groupForecastByDay(list) {
        const days = {};
        
        list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toLocaleDateString('th-TH', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short' 
            });
            
            if (!days[dayKey]) {
                days[dayKey] = {
                    date: date,
                    temps: [],
                    weather: [],
                    rain: 0,
                    humidity: []
                };
            }
            
            days[dayKey].temps.push(item.main.temp);
            days[dayKey].weather.push(item.weather[0]);
            days[dayKey].humidity.push(item.main.humidity);
            
            if (item.rain && item.rain['3h']) {
                days[dayKey].rain += item.rain['3h'];
            }
        });
        
        // คำนวณค่าเฉลี่ย
        Object.keys(days).forEach(key => {
            const day = days[key];
            day.temp_min = Math.round(Math.min(...day.temps));
            day.temp_max = Math.round(Math.max(...day.temps));
            day.humidity_avg = Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length);
            
            // หาสภาพอากาศที่พบบ่อยที่สุด
            const weatherCount = {};
            day.weather.forEach(w => {
                weatherCount[w.main] = (weatherCount[w.main] || 0) + 1;
            });
            const mostCommon = Object.keys(weatherCount).reduce((a, b) => 
                weatherCount[a] > weatherCount[b] ? a : b
            );
            day.main_weather = mostCommon;
            day.icon = day.weather.find(w => w.main === mostCommon).icon;
        });
        
        return days;
    }
    
    checkRainAlert(forecastList) {
        const alertElement = document.getElementById('rain-alert');
        const messageElement = document.getElementById('rain-alert-message');
        
        if (!alertElement || !messageElement) return;
        
        // ตรวจสอบ 24 ชั่วโมงข้างหน้า (8 รายการ x 3 ชม.)
        const next24Hours = forecastList.slice(0, 8);
        let willRain = false;
        let rainTime = null;
        
        next24Hours.forEach((forecast, index) => {
            const weather = forecast.weather[0].main;
            if ((weather === 'Rain' || weather === 'Drizzle' || weather === 'Thunderstorm') && !willRain) {
                willRain = true;
                rainTime = index * 3; // ชั่วโมง
            }
        });
        
        if (willRain) {
            alertElement.style.display = 'flex';
            if (rainTime === 0) {
                messageElement.textContent = '🌧️ กำลังฝนตกในขณะนี้';
            } else if (rainTime <= 3) {
                messageElement.textContent = `🌧️ ฝนจะตกภายใน ${rainTime} ชั่วโมง`;
            } else {
                messageElement.textContent = `☁️ มีโอกาสฝนตกภายใน ${rainTime} ชั่วโมง`;
            }
        } else {
            alertElement.style.display = 'none';
        }
    }
    
    // ========================================
    // 4. การจราจร (เตรียมไว้สำหรับ API)
    // ========================================
    initTrafficSection() {
        // TODO: เชื่อมต่อ Traffic API
        // ตอนนี้ใช้ข้อมูลจำลอง
        
        const trafficLevels = {
            'ราบรื่น': { percent: 20, class: 'smooth' },
            'ปานกลาง': { percent: 50, class: 'moderate' },
            'หนาแน่น': { percent: 80, class: 'heavy' }
        };
        
        const levelKeys = Object.keys(trafficLevels);
        const randomLevel = levelKeys[Math.floor(Math.random() * levelKeys.length)];
        const currentTraffic = trafficLevels[randomLevel];
        
        // Update current traffic with large circular progress bar
        const currentContainer = document.getElementById('traffic-current-visual');
        if (currentContainer) {
            currentContainer.innerHTML = this.createCircularProgressBar(
                currentTraffic.percent, 
                'large', 
                currentTraffic.class
            );
        }
        
        this.updateElement('traffic-level', randomLevel);
        this.updateElement('traffic-desc', 'รอเชื่อมต่อ Traffic API');
        this.updateElement('traffic-update-time', 'อัปเดต: ' + new Date().toLocaleTimeString('th-TH', { 
            hour: '2-digit', 
            minute: '2-digit' 
        }));
        
        // Update forecast with small circular progress bars
        const forecastData = [
            { time: '15min', level: 'ราบรื่น', percent: 25 },
            { time: '30min', level: 'ปานกลาง', percent: 40 },
            { time: '45min', level: 'ปานกลาง', percent: 55 },
            { time: '60min', level: 'หนาแน่น', percent: 70 }
        ];
        
        forecastData.forEach(item => {
            const container = document.getElementById(`traffic-${item.time}-visual`);
            const statusClass = item.percent <= 30 ? 'smooth' : item.percent <= 60 ? 'moderate' : 'heavy';
            
            if (container) {
                container.innerHTML = this.createCircularProgressBar(
                    item.percent, 
                    'small', 
                    statusClass
                );
            }
            
            this.updateElement(`traffic-${item.time}`, item.level);
        });
    }
    
    // ========================================
    // 5. ระดับน้ำแม่น้ำโขง (เตรียมไว้สำหรับ API)
    // ========================================
    initRiverLevelSection() {
        // TODO: เชื่อมต่อ River Level API
        // ตอนนี้ใช้ข้อมูลจำลอง
        
        const waterLevel = (Math.random() * 4 + 6).toFixed(2); // 6-10 เมตร
        const percent = ((waterLevel - 5) / 7) * 100; // 5-12 เมตร
        
        this.updateElement('water-level', waterLevel);
        this.updateElement('water-status', this.getWaterStatus(waterLevel));
        this.updateElement('water-change', '+15 ซม. จากเมื่อวาน');
        this.updateElement('water-update-time', new Date().toLocaleTimeString('th-TH', { 
            hour: '2-digit', 
            minute: '2-digit' 
        }));
        this.updateElement('water-trend', 'มีแนวโน้มสูงขึ้น');
        
        // Water fill animation
        const waterFillElement = document.getElementById('water-fill');
        if (waterFillElement) {
            waterFillElement.style.height = Math.min(percent, 100) + '%';
        }
        
        // Forecast list
        this.displayWaterForecast();
    }
    
    getWaterStatus(level) {
        if (level >= 12) return 'วิกฤต';
        if (level >= 10) return 'เฝ้าระวัง';
        if (level >= 8) return 'ปกติ';
        return 'ต่ำ';
    }
    
    displayWaterForecast() {
        const container = document.getElementById('water-forecast-list');
        if (!container) return;
        
        const days = ['วันนี้', 'พรุ่งนี้', 'มะรืนนี้', '+3 วัน', '+4 วัน', '+5 วัน', '+6 วัน'];
        let currentLevel = 8.5;
        
        container.innerHTML = days.map(day => {
            currentLevel += (Math.random() - 0.5) * 0.5;
            const trend = currentLevel > 8.5 ? '↑ สูงขึ้น' : '↓ ลดลง';
            
            return `
                <div class="forecast-day">
                    <span class="day-label">${day}</span>
                    <span class="day-level">${currentLevel.toFixed(2)} ม.</span>
                    <span class="day-trend">${trend}</span>
                </div>
            `;
        }).join('');
    }
    
    // ========================================
    // Helper Functions
    // ========================================
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    setupEventListeners() {
        // PM2.5 section auto-updates, no manual refresh button needed
        // Event listeners for other interactive elements can be added here
    }
    
    startAutoRefresh() {
        // Refresh PM2.5 every 5 minutes
        setInterval(() => {
            this.loadPM25AllDistricts();
        }, 5 * 60 * 1000);
        
        // Refresh weather every 10 minutes
        setInterval(() => {
            this.loadCurrentWeather();
            this.loadWeatherForecast();
        }, 10 * 60 * 1000);
        
        // Refresh traffic every 2 minutes
        setInterval(() => {
            this.initTrafficSection();
        }, 2 * 60 * 1000);
        
        // Refresh river level every 30 minutes
        setInterval(() => {
            this.initRiverLevelSection();
        }, 30 * 60 * 1000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.weatherPage = new WeatherPage();
    });
} else {
    window.weatherPage = new WeatherPage();
}

console.log('✅ Weather Page module loaded');
