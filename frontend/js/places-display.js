// แสดงผลสถานที่ท่องเที่ยวในหน้าแรก

class PlacesDisplay {
    constructor() {
        this.init();
    }

    init() {
        this.renderTemples();
        this.renderCafes();
        this.renderHotels();
    }

    // สร้าง HTML สำหรับ card
    createPlaceCard(place) {
        return `
            <div class="place-card" data-id="${place.id}">
                <div class="place-image">
                    <img src="${place.image}" alt="${place.name}" loading="lazy">
                    <div class="place-overlay"></div>
                    <span class="place-rating">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        ${place.rating}
                    </span>
                </div>
                <div class="place-content">
                    <span class="place-category">${place.category}</span>
                    <h3 class="place-title">${place.name}</h3>
                    <p class="place-description">${place.description}</p>
                    <div class="place-footer">
                        <span class="place-location">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            ${place.location}
                        </span>
                        <span class="place-reviews">${place.reviews.toLocaleString()} รีวิว</span>
                    </div>
                    ${place.price ? `<div class="place-price">${place.price}</div>` : ''}
                    <a href="explore.html?id=${place.id}" class="place-link">
                        <span>ดูรายละเอียด</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </a>
                </div>
            </div>
        `;
    }

    // แสดงวัด
    renderTemples() {
        const container = document.getElementById('temples-grid');
        if (!container) return;

        const html = PLACES_DATA.temples.map(temple => this.createPlaceCard(temple)).join('');
        container.innerHTML = html;
    }

    // แสดงคาเฟ่
    renderCafes() {
        const container = document.getElementById('cafes-grid');
        if (!container) return;

        const html = PLACES_DATA.cafes.map(cafe => this.createPlaceCard(cafe)).join('');
        container.innerHTML = html;
    }

    // แสดงโรงแรม
    renderHotels() {
        const container = document.getElementById('hotels-grid');
        if (!container) return;

        const html = PLACES_DATA.hotels.map(hotel => this.createPlaceCard(hotel)).join('');
        container.innerHTML = html;
    }
}

// เริ่มต้นเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    new PlacesDisplay();
    console.log('✅ Places Display initialized');
});
