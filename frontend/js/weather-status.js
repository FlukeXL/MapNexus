// Weather Status Real-time Updates
class WeatherStatus {
    constructor() {
        this.init();
        this.startUpdates();
    }

    init() {
        this.updatePM25();
        this.updateTraffic();
        this.updateTemperature();
    }

    // Update PM2.5 (น้อย = ดี, มาก = ไม่ดี)
    async updatePM25() {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/pm25');
            // const data = await response.json();
            
            // Simulated data
            const pm25Raw = Math.floor(Math.random() * 100); // 0-100 µg/m³
            const aqi = this.calculateAQI(pm25Raw);
            
            // คำนวณเปอร์เซ็นต์ (0-100%, น้อย = ดี)
            const percentage = Math.min(Math.round((aqi / 500) * 100), 100);
            
            // Update values
            document.getElementById('pm25-value').textContent = percentage;
            document.getElementById('pm25-aqi').textContent = aqi;
            document.getElementById('pm25-raw').textContent = `${pm25Raw} µg/m³`;
            
            // Update status text and color
            const status = this.getPM25Status(aqi);
            document.getElementById('pm25-status').textContent = status.text;
            
            // Update ring
            const ring = document.querySelector('.pm25-ring');
            ring.className = `progress-ring-circle pm25-ring ${status.class}`;
            this.animateRing(ring, percentage);
            
        } catch (error) {
            console.error('Error updating PM2.5:', error);
        }
    }

    // Calculate AQI from PM2.5
    calculateAQI(pm25) {
        if (pm25 <= 12) return Math.round(pm25 * 4.17);
        if (pm25 <= 35.4) return Math.round(((pm25 - 12.1) / 23.3) * 49 + 51);
        if (pm25 <= 55.4) return Math.round(((pm25 - 35.5) / 19.9) * 49 + 101);
        if (pm25 <= 150.4) return Math.round(((pm25 - 55.5) / 94.9) * 99 + 151);
        if (pm25 <= 250.4) return Math.round(((pm25 - 150.5) / 99.9) * 99 + 201);
        return Math.round(((pm25 - 250.5) / 99.9) * 99 + 301);
    }

    // Get PM2.5 Status
    getPM25Status(aqi) {
        if (aqi <= 50) return { text: 'ดี', class: '' };
        if (aqi <= 100) return { text: 'ปานกลาง', class: 'moderate' };
        return { text: 'ไม่ดี', class: 'unhealthy' };
    }

    // Update Traffic (น้อย = ดี, มาก = ไม่ดี)
    async updateTraffic() {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/traffic');
            // const data = await response.json();
            
            // Simulated data
            const statuses = [
                { text: 'ราบรื่น', textDisplay: 'ปกติ', percentage: 20, class: '' },
                { text: 'ปานกลาง', textDisplay: 'ปานกลาง', percentage: 55, class: 'moderate' },
                { text: 'หนาแน่น', textDisplay: 'หนาแน่น', percentage: 85, class: 'heavy' }
            ];
            
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            // Update values
            document.getElementById('traffic-value').textContent = randomStatus.percentage;
            document.getElementById('traffic-status').textContent = randomStatus.text;
            document.getElementById('traffic-text').textContent = randomStatus.textDisplay;
            
            // Update ring
            const ring = document.querySelector('.traffic-ring');
            ring.className = `progress-ring-circle traffic-ring ${randomStatus.class}`;
            this.animateRing(ring, randomStatus.percentage);
            
        } catch (error) {
            console.error('Error updating traffic:', error);
        }
    }

    // Update Temperature (น้อย = สบาย, มาก = ร้อน)
    async updateTemperature() {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/weather');
            // const data = await response.json();
            
            // Simulated data
            const temp = Math.floor(Math.random() * 15) + 25; // 25-40°C
            const humidity = Math.floor(Math.random() * 30) + 50;
            
            // คำนวณเปอร์เซ็นต์ (25°C = 0%, 40°C = 100%)
            const minTemp = 25;
            const maxTemp = 40;
            const percentage = Math.min(Math.round(((temp - minTemp) / (maxTemp - minTemp)) * 100), 100);
            
            // Get status
            let status = { text: 'เย็นสบาย', class: '' };
            if (temp >= 35) {
                status = { text: 'ร้อนจัด', class: 'hot' };
            } else if (temp >= 30) {
                status = { text: 'อบอุ่น', class: 'warm' };
            }
            
            // Update values
            document.getElementById('temp-value').textContent = percentage;
            document.getElementById('temp-status').textContent = status.text;
            document.getElementById('temp-celsius').textContent = `${temp}°C`;
            document.getElementById('temp-humidity').textContent = `${humidity}%`;
            
            // Update ring
            const ring = document.querySelector('.temp-ring');
            ring.className = `progress-ring-circle temp-ring ${status.class}`;
            this.animateRing(ring, percentage);
            
        } catch (error) {
            console.error('Error updating temperature:', error);
        }
    }

    // Animate circular progress ring
    animateRing(ring, percentage) {
        const circumference = 534.07; // 2 * PI * 85
        const offset = circumference - (percentage / 100) * circumference;
        ring.style.strokeDashoffset = offset;
    }

    // Start periodic updates
    startUpdates() {
        // Update PM2.5 every 5 minutes
        setInterval(() => this.updatePM25(), 5 * 60 * 1000);
        
        // Update traffic every 2 minutes
        setInterval(() => this.updateTraffic(), 2 * 60 * 1000);
        
        // Update temperature every 10 minutes
        setInterval(() => this.updateTemperature(), 10 * 60 * 1000);
    }
}

// Initialize Weather Status when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherStatus();
});
