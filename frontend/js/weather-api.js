// Weather API Integration
// แสดงข้อมูลสภาพอากาศแบบละเอียด

class WeatherAPI {
    constructor() {
        this.API_KEY = '88474214df0769fa95ff82dc52946122';
        this.LOCATION = {
            lat: 17.4081,
            lon: 104.7695,
            name: 'นครพนม'
        };
        
        this.init();
    }
    
    async init() {
        await this.loadCurrentWeather();
        await this.loadForecast();
        this.startAutoUpdate();
    }
    
    // ========================================
    // 🌡️ สภาพอากาศปัจจุบัน
    // ========================================
    async loadCurrentWeather() {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.LOCATION.lat}&lon=${this.LOCATION.lon}&appid=${this.API_KEY}&units=metric&lang=th`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            this.currentWeather = {
                temp: Math.round(data.main.temp),
                feels_like: Math.round(data.main.feels_like),
                temp_min: Math.round(data.main.temp_min),
                temp_max: Math.round(data.main.temp_max),
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                weather: data.weather[0].main,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                clouds: data.clouds.all,
                wind_speed: data.wind.speed,
                wind_deg: data.wind.deg,
                visibility: data.visibility / 1000, // แปลงเป็น km
                sunrise: new Date(data.sys.sunrise * 1000),
                sunset: new Date(data.sys.sunset * 1000)
            };
            
            console.log('✅ Current Weather:', this.currentWeather);
            this.displayCurrentWeather();
            
        } catch (error) {
            console.error('❌ Error loading current weather:', error);
        }
    }
    
    // ========================================
    // 📅 พยากรณ์อากาศ 5 วัน
    // ========================================
    async loadForecast() {
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.LOCATION.lat}&lon=${this.LOCATION.lon}&appid=${this.API_KEY}&units=metric&lang=th`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            // จัดกลุ่มตามวัน
            this.forecast = this.groupForecastByDay(data.list);
            
            console.log('✅ Forecast:', this.forecast);
            this.displayForecast();
            
        } catch (error) {
            console.error('❌ Error loading forecast:', error);
        }
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
            day.temp_avg = Math.round(day.temps.reduce((a, b) => a + b) / day.temps.length);
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
    
    // ========================================
    // 🎨 แสดงผลสภาพอากาศปัจจุบัน
    // ========================================
    displayCurrentWeather() {
        const container = document.getElementById('current-weather');
        if (!container) return;
        
        const weather = this.currentWeather;
        const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@4x.png`;
        
        container.innerHTML = `
            <div class="weather-current">
                <div class="weather-main">
                    <img src="${iconUrl}" alt="${weather.description}" class="weather-icon-large">
                    <div class="weather-temp-main">
                        <h1 class="temp-large">${weather.temp}°C</h1>
                        <p class="weather-desc">${weather.description}</p>
                        <p class="weather-location">📍 ${this.LOCATION.name}</p>
                    </div>
                </div>
                
                <div class="weather-details">
                    <div class="weather-detail-item">
                        <span class="detail-label">รู้สึกเหมือน</span>
                        <span class="detail-value">${weather.feels_like}°C</span>
                    </div>
                    <div class="weather-detail-item">
                        <span class="detail-label">ต่ำสุด / สูงสุด</span>
                        <span class="detail-value">${weather.temp_min}° / ${weather.temp_max}°</span>
                    </div>
                    <div class="weather-detail-item">
                        <span class="detail-label">ความชื้น</span>
                        <span class="detail-value">${weather.humidity}%</span>
                    </div>
                    <div class="weather-detail-item">
                        <span class="detail-label">ความกดอากาศ</span>
                        <span class="detail-value">${weather.pressure} hPa</span>
                    </div>
                    <div class="weather-detail-item">
                        <span class="detail-label">ความเร็วลม</span>
                        <span class="detail-value">${weather.wind_speed} m/s</span>
                    </div>
                    <div class="weather-detail-item">
                        <span class="detail-label">ทัศนวิสัย</span>
                        <span class="detail-value">${weather.visibility} km</span>
                    </div>
                    <div class="weather-detail-item">
                        <span class="detail-label">เมฆ</span>
                        <span class="detail-value">${weather.clouds}%</span>
                    </div>
                    <div class="weather-detail-item">
                        <span class="detail-label">พระอาทิตย์ขึ้น</span>
                        <span class="detail-value">${weather.sunrise.toLocaleTimeString('th-TH', {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                    <div class="weather-detail-item">
                        <span class="detail-label">พระอาทิตย์ตก</span>
                        <span class="detail-value">${weather.sunset.toLocaleTimeString('th-TH', {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    // ========================================
    // 📅 แสดงพยากรณ์อากาศ
    // ========================================
    displayForecast() {
        const container = document.getElementById('weather-forecast');
        if (!container) return;
        
        let html = '<div class="forecast-grid">';
        
        Object.keys(this.forecast).slice(0, 5).forEach(dayKey => {
            const day = this.forecast[dayKey];
            const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
            
            html += `
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
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    // ========================================
    // 🔄 อัปเดตอัตโนมัติ
    // ========================================
    startAutoUpdate() {
        // อัปเดตทุก 10 นาที
        setInterval(() => {
            this.loadCurrentWeather();
        }, 10 * 60 * 1000);
        
        // อัปเดตพยากรณ์ทุก 30 นาที
        setInterval(() => {
            this.loadForecast();
        }, 30 * 60 * 1000);
    }
    
    // ========================================
    // 📊 Public Methods
    // ========================================
    getCurrentWeather() {
        return this.currentWeather;
    }
    
    getForecast() {
        return this.forecast;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.weatherAPI = new WeatherAPI();
    });
} else {
    window.weatherAPI = new WeatherAPI();
}

console.log('✅ Weather API module loaded');
