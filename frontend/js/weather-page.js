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

        // Render charts หลังจาก DOM พร้อม
        setTimeout(() => {
            this.renderTrafficChart();
            this.renderWaterChart();
        }, 300);
        
        // Event Listeners
        this.setupEventListeners();
        
        // Auto refresh
        this.startAutoRefresh();
    }
    
    // ========================================
    // Helper: Create Circular Progress Bar
    // ========================================
    createCircularProgressBar(percentage, size = 'large', statusClass = '') {
        // ใช้ viewBox เพื่อให้ CSS resize ได้โดยไม่เบี้ยว
        const dim = size === 'large'
            ? { vb: 100, r: 40, sw: 8 }
            : { vb: 80,  r: 32, sw: 7 };

        const circumference = 2 * Math.PI * dim.r;
        const offset = circumference - (percentage / 100) * circumference;
        const half = dim.vb / 2;

        return `
            <svg class="circular-progress ${size}"
                 viewBox="0 0 ${dim.vb} ${dim.vb}"
                 xmlns="http://www.w3.org/2000/svg">
                <circle class="progress-bg"
                        cx="${half}" cy="${half}" r="${dim.r}"
                        stroke-width="${dim.sw}" />
                <circle class="progress-fill ${statusClass}"
                        cx="${half}" cy="${half}" r="${dim.r}"
                        stroke-width="${dim.sw}"
                        stroke-dasharray="${circumference.toFixed(2)}"
                        stroke-dashoffset="${offset.toFixed(2)}" />
            </svg>
            <div class="progress-text">${percentage}%</div>
        `;
    }
    
    // ========================================
    // 1. PM2.5 ทุกอำเภอ — ข้อมูลจริงจาก WAQI
    // ========================================
    async loadPM25AllDistricts() {
        const container = document.getElementById('pm25-districts');
        if (!container) return;
        
        container.innerHTML = '<div class="loading-message">กำลังโหลดข้อมูล PM2.5...</div>';
        
        try {
            // ดึงข้อมูลจริงจากสถานีนครพนม (@13630)
            const WAQI_TOKEN = 'b43f5d3e29f96181a99f3eb796951a6db702a306';
            const response = await fetch(`https://api.waqi.info/feed/@13630/?token=${WAQI_TOKEN}`);
            const data = await response.json();
            
            let basePM25 = 50; // fallback
            let baseAQI = 50;
            
            if (data.status === 'ok') {
                basePM25 = data.data.iaqi?.pm25?.v || parseInt(data.data.aqi);
                baseAQI = parseInt(data.data.aqi);
                console.log('✅ WAQI PM2.5 (นครพนม):', basePM25, 'µg/m³, AQI:', baseAQI);
            }
            
            // อำเภอเมืองใช้ค่าจริง อำเภออื่นประมาณ ±15% จากค่าจริง
            const pm25Data = this.districts.map((district, index) => {
                let pm25, aqi, isReal;
                
                if (index === 0) {
                    // อำเภอเมืองนครพนม — ข้อมูลจริง
                    pm25 = basePM25;
                    aqi = baseAQI;
                    isReal = true;
                } else {
                    // อำเภออื่น — ประมาณจากค่าจริง ±15%
                    const variation = 0.85 + (Math.sin(index * 1.7) * 0.5 + 0.5) * 0.30;
                    pm25 = Math.round(basePM25 * variation);
                    aqi = this.convertPM25ToAQI(pm25);
                    isReal = false;
                }
                
                const status = this.getPM25Status(aqi);
                
                return {
                    district: district.name,
                    pm25,
                    aqi,
                    status: status.text,
                    class: status.class,
                    percent: status.percent,
                    isReal,
                    updateTime: new Date().toLocaleTimeString('th-TH', { 
                        hour: '2-digit', minute: '2-digit' 
                    })
                };
            });
            
            this.displayPM25Districts(pm25Data);
            
            const timeElement = document.getElementById('pm25-time');
            if (timeElement) {
                timeElement.textContent = new Date().toLocaleTimeString('th-TH', { 
                    hour: '2-digit', minute: '2-digit' 
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
                    <span class="update-time" title="${item.isReal ? 'ข้อมูลจริงจากสถานีวัด' : 'ประมาณจากสถานีใกล้เคียง'}">
                        ${item.isReal ? '📡' : '~'} ${item.updateTime}
                    </span>
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
    // 5. ระดับน้ำแม่น้ำโขง (3D Gauge)
    // ========================================
    initRiverLevelSection() {
        // TODO: เชื่อมต่อ River Level API
        // ตอนนี้ใช้ข้อมูลจำลอง
        
        const waterLevel = (Math.random() * 4 + 6).toFixed(2); // 6-10 เมตร
        const waterLevelNum = parseFloat(waterLevel);
        
        // Get status and color
        const statusInfo = this.getWaterStatusInfo(waterLevelNum);
        
        // Calculate percentage for gauge (0-100%)
        // Range: 0-14 meters, display 0-100%
        const percent = Math.min(Math.max((waterLevelNum / 14) * 100, 0), 100);
        
        // Update 3D Gauge
        const gaugeContainer = document.getElementById('water-gauge');
        if (gaugeContainer) {
            gaugeContainer.innerHTML = this.createWaterGauge(waterLevel, percent, statusInfo.class);
        }
        
        // Update status badge
        const statusBadge = document.getElementById('water-status-badge');
        const statusIcon = document.getElementById('water-status-icon');
        const statusText = document.getElementById('water-status');
        
        if (statusIcon) statusIcon.textContent = statusInfo.icon;
        if (statusText) statusText.textContent = statusInfo.text;
        if (statusBadge) {
            statusBadge.style.background = `linear-gradient(135deg, ${statusInfo.color}22, ${statusInfo.color}44)`;
            statusBadge.style.color = statusInfo.color;
            statusBadge.style.borderLeft = `4px solid ${statusInfo.color}`;
        }
        
        // Update change indicator
        const changeElement = document.getElementById('water-change');
        const changeValue = (Math.random() * 30 - 10).toFixed(0); // -10 to +20 cm
        const isRising = changeValue > 0;
        
        if (changeElement) {
            changeElement.className = `level-change ${isRising ? 'up' : 'down'}`;
            changeElement.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="${isRising ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}"></polyline>
                </svg>
                <span>${isRising ? '+' : ''}${changeValue} ซม. จากเมื่อวาน</span>
            `;
        }
        
        // Update details
        this.updateElement('water-update-time', new Date().toLocaleTimeString('th-TH', { 
            hour: '2-digit', 
            minute: '2-digit' 
        }));
        this.updateElement('water-trend', isRising ? 'มีแนวโน้มสูงขึ้น' : 'มีแนวโน้มลดลง');
        
        // Display warning levels table
        this.displayWarningLevels(waterLevelNum);
    }
    
    getWaterStatusInfo(level) {
        const statuses = [
            { min: 12, text: 'น้ำวิกฤตรุนแรง', icon: '🔴', color: '#d32f2f', class: 'critical-high' },
            { min: 10, text: 'เฝ้าระวังน้ำล้นตลิ่ง', icon: '🟠', color: '#f57c00', class: 'warning' },
            { min: 8, text: 'น้ำเริ่มสูง', icon: '🟡', color: '#fbc02d', class: 'rising' },
            { min: 6, text: 'ระดับน้ำปกติ', icon: '🟢', color: '#388e3c', class: 'normal' },
            { min: 4, text: 'น้ำน้อย', icon: '🔵', color: '#1976d2', class: 'low' },
            { min: 2, text: 'น้ำน้อยมาก', icon: '🟣', color: '#7b1fa2', class: 'very-low' },
            { min: 0, text: 'น้ำน้อยขั้นวิกฤต', icon: '⚫', color: '#424242', class: 'critical-low' }
        ];
        
        for (const status of statuses) {
            if (level >= status.min) {
                return status;
            }
        }
        
        return statuses[statuses.length - 1];
    }
    
    createWaterGauge(value, percentage, statusClass) {
        const size = 140;
        const strokeWidth = 12;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        return `
            <svg class="gauge-circle"
                 viewBox="0 0 ${size} ${size}"
                 xmlns="http://www.w3.org/2000/svg">
                <circle class="gauge-bg"
                        cx="${size/2}"
                        cy="${size/2}"
                        r="${radius}"
                        stroke-width="${strokeWidth}" />
                <circle class="gauge-fill ${statusClass}"
                        cx="${size/2}"
                        cy="${size/2}"
                        r="${radius}"
                        stroke-width="${strokeWidth}"
                        stroke-dasharray="${circumference.toFixed(2)}"
                        stroke-dashoffset="${offset.toFixed(2)}" />
            </svg>
            <div class="gauge-center">
                <div class="gauge-value">${value}</div>
                <div class="gauge-unit">เมตร</div>
            </div>
        `;
    }
    
    displayWarningLevels(currentLevel) {
        const container = document.getElementById('warning-levels-grid');
        if (!container) return;
        
        const levels = [
            { text: 'น้ำวิกฤตรุนแรง', icon: '🔴', range: '>12 ม.', min: 12 },
            { text: 'เฝ้าระวังน้ำล้นตลิ่ง', icon: '🟠', range: '10-12 ม.', min: 10, max: 12 },
            { text: 'น้ำเริ่มสูง', icon: '🟡', range: '8-10 ม.', min: 8, max: 10 },
            { text: 'ระดับน้ำปกติ', icon: '🟢', range: '6-8 ม.', min: 6, max: 8 },
            { text: 'น้ำน้อย', icon: '🔵', range: '4-6 ม.', min: 4, max: 6 },
            { text: 'น้ำน้อยมาก', icon: '🟣', range: '2-4 ม.', min: 2, max: 4 },
            { text: 'น้ำน้อยขั้นวิกฤต', icon: '⚫', range: '<2 ม.', max: 2 }
        ];
        
        container.innerHTML = levels.map(level => {
            const isActive = (level.min !== undefined && level.max !== undefined) 
                ? (currentLevel >= level.min && currentLevel < level.max)
                : (level.min !== undefined) 
                    ? (currentLevel >= level.min)
                    : (currentLevel < level.max);
            
            return `
                <div class="warning-level-item ${isActive ? 'active' : ''}">
                    <span class="level-icon">${level.icon}</span>
                    <span class="level-text">${level.text}</span>
                    <span class="level-range">${level.range}</span>
                </div>
            `;
        }).join('');
    }
    
    getWaterStatus(level) {
        return this.getWaterStatusInfo(level).text;
    }
    
    displayWaterForecast() {
        // Removed - no longer needed for compact design
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

    // ========================================
    // Traffic Trend Chart — กราฟแท่งเทียนจราจร
    // ========================================
    renderTrafficChart() {
        const container = document.getElementById('traffic-trend-chart');
        if (!container) return;

        // ข้อมูลจำลอง 8 ช่วงเวลา (สมจริง)
        const data = [
            { time: '06:00', val: 15, status: 'smooth' },
            { time: '08:00', val: 75, status: 'heavy' },
            { time: '10:00', val: 45, status: 'moderate' },
            { time: '12:00', val: 55, status: 'moderate' },
            { time: '14:00', val: 30, status: 'smooth' },
            { time: '16:00', val: 80, status: 'heavy' },
            { time: '18:00', val: 65, status: 'moderate' },
            { time: '20:00', val: 25, status: 'smooth' }
        ];

        const W = container.clientWidth || 400;
        const H = 110;
        const padL = 28, padR = 8, padT = 10, padB = 28;
        const chartW = W - padL - padR;
        const chartH = H - padT - padB;
        const barW = Math.max(8, (chartW / data.length) * 0.55);
        const gap = chartW / data.length;

        const colorMap = { smooth: '#16a34a', moderate: '#d97706', heavy: '#dc2626' };

        // Grid lines
        let gridLines = '';
        [0, 25, 50, 75, 100].forEach(v => {
            const y = padT + chartH - (v / 100) * chartH;
            gridLines += `<line class="chart-grid-line" x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}"/>`;
            if (v % 50 === 0) {
                gridLines += `<text class="chart-value-label" x="${padL - 4}" y="${y + 3}" text-anchor="end">${v}</text>`;
            }
        });

        // Bars + labels
        let bars = '';
        data.forEach((d, i) => {
            const x = padL + i * gap + gap / 2;
            const barH = (d.val / 100) * chartH;
            const y = padT + chartH - barH;
            const color = colorMap[d.status];

            // แท่งหลัก
            bars += `<rect class="candle-body" x="${x - barW/2}" y="${y}" width="${barW}" height="${barH}" fill="${color}" rx="3" ry="3" opacity="0.85">
                <title>${d.time}: ${d.val}%</title>
            </rect>`;

            // เส้น wick บน
            const wickTop = Math.max(padT, y - 4);
            bars += `<line class="candle-wick" x1="${x}" y1="${wickTop}" x2="${x}" y2="${y}" stroke="${color}" opacity="0.5"/>`;

            // label เวลา
            bars += `<text class="chart-axis-label" x="${x}" y="${H - 4}" text-anchor="middle">${d.time.replace(':00','')}</text>`;
        });

        // เส้นปัจจุบัน (ชั่วโมงล่าสุด)
        const now = new Date().getHours();
        const currentIdx = data.findIndex(d => parseInt(d.time) >= now);
        let currentLine = '';
        if (currentIdx >= 0) {
            const cx = padL + currentIdx * gap + gap / 2;
            currentLine = `
                <line class="chart-current-line" x1="${cx}" y1="${padT}" x2="${cx}" y2="${padT + chartH}"/>
                <circle class="chart-current-dot" cx="${cx}" cy="${padT}" r="3"/>
                <text class="chart-axis-label" x="${cx + 4}" y="${padT + 8}" fill="#b8941e" font-size="8">ตอนนี้</text>
            `;
        }

        container.innerHTML = `
            <svg class="chart-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
                ${gridLines}
                ${bars}
                ${currentLine}
            </svg>
        `;
    }

    // ========================================
    // Water Level Trend Chart — กราฟแท่งเทียนระดับน้ำ 7 วัน
    // ========================================
    renderWaterChart() {
        const container = document.getElementById('water-trend-chart');
        if (!container) return;

        const days = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];
        // ข้อมูลจำลอง 7 วัน (เมตร) — สมจริงตามฤดูกาล
        const data = [
            { day: days[0], val: 6.8, open: 6.6, close: 6.8, high: 7.0, low: 6.5 },
            { day: days[1], val: 7.1, open: 6.8, close: 7.1, high: 7.3, low: 6.7 },
            { day: days[2], val: 7.4, open: 7.1, close: 7.4, high: 7.6, low: 7.0 },
            { day: days[3], val: 7.2, open: 7.4, close: 7.2, high: 7.5, low: 7.1 },
            { day: days[4], val: 7.5, open: 7.2, close: 7.5, high: 7.7, low: 7.1 },
            { day: days[5], val: 7.8, open: 7.5, close: 7.8, high: 8.0, low: 7.4 },
            { day: days[6], val: 7.6, open: 7.8, close: 7.6, high: 7.9, low: 7.5 }
        ];

        const W = container.clientWidth || 400;
        const H = 120;
        const padL = 32, padR = 8, padT = 10, padB = 24;
        const chartW = W - padL - padR;
        const chartH = H - padT - padB;

        const allVals = data.flatMap(d => [d.high, d.low]);
        const minV = Math.floor(Math.min(...allVals) * 10) / 10 - 0.2;
        const maxV = Math.ceil(Math.max(...allVals) * 10) / 10 + 0.2;
        const range = maxV - minV;

        const toY = v => padT + chartH - ((v - minV) / range) * chartH;
        const gap = chartW / data.length;
        const barW = Math.max(8, gap * 0.5);

        // Grid lines
        let gridLines = '';
        const steps = 4;
        for (let i = 0; i <= steps; i++) {
            const v = minV + (range / steps) * i;
            const y = toY(v);
            gridLines += `<line class="chart-grid-line" x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}"/>`;
            gridLines += `<text class="chart-value-label" x="${padL - 4}" y="${y + 3}" text-anchor="end">${v.toFixed(1)}</text>`;
        }

        // Candlestick bars
        let bars = '';
        data.forEach((d, i) => {
            const x = padL + i * gap + gap / 2;
            const isUp = d.close >= d.open;
            const color = isUp ? '#16a34a' : '#dc2626';
            const bodyTop = toY(Math.max(d.open, d.close));
            const bodyBot = toY(Math.min(d.open, d.close));
            const bodyH = Math.max(2, bodyBot - bodyTop);

            // Wick บน-ล่าง
            bars += `<line class="candle-wick" x1="${x}" y1="${toY(d.high)}" x2="${x}" y2="${bodyTop}" stroke="${color}" opacity="0.6"/>`;
            bars += `<line class="candle-wick" x1="${x}" y1="${bodyBot}" x2="${x}" y2="${toY(d.low)}" stroke="${color}" opacity="0.6"/>`;

            // แท่งหลัก
            bars += `<rect class="candle-body" x="${x - barW/2}" y="${bodyTop}" width="${barW}" height="${bodyH}" fill="${color}" rx="2" ry="2">
                <title>${d.day}: ${d.val.toFixed(2)} ม.</title>
            </rect>`;

            // label วัน
            bars += `<text class="chart-axis-label" x="${x}" y="${H - 4}" text-anchor="middle">${d.day}</text>`;

            // value บนแท่ง (วันล่าสุด)
            if (i === data.length - 1) {
                bars += `<text class="chart-axis-label" x="${x}" y="${bodyTop - 4}" text-anchor="middle" fill="${color}" font-weight="bold">${d.val.toFixed(1)}</text>`;
            }
        });

        // เส้นระดับปกติ (6-8 ม.)
        const normalLine = toY(7.0);
        const normalLineHtml = `
            <line x1="${padL}" y1="${normalLine}" x2="${W - padR}" y2="${normalLine}"
                  stroke="#16a34a" stroke-width="1" stroke-dasharray="5 3" opacity="0.4"/>
            <text class="chart-axis-label" x="${W - padR - 2}" y="${normalLine - 3}" text-anchor="end" fill="#16a34a" opacity="0.7">ปกติ</text>
        `;

        container.innerHTML = `
            <svg class="chart-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
                ${gridLines}
                ${normalLineHtml}
                ${bars}
            </svg>
        `;
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
