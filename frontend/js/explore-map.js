// ========================================
// Explore Page — Map + Cards + Carousel
// ========================================

let map;
let markers = [];

// ---- Marker Icons ----
const markerIcons = {
    temple: {
        iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#d4af37" stroke="#fff" stroke-width="3"/></svg>'),
        iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36]
    },
    cafe: {
        iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#2196F3" stroke="#fff" stroke-width="3"/></svg>'),
        iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36]
    },
    hotel: {
        iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#4CAF50" stroke="#fff" stroke-width="3"/></svg>'),
        iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36]
    },
    nature: {
        iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#66BB6A" stroke="#fff" stroke-width="3"/></svg>'),
        iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36]
    }
};

// ========================================
// Map
// ========================================
function initMap() {
    const center = [17.4070, 104.7720];
    map = L.map('openstreet-map', { zoomControl: true }).setView(center, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(map);
    addPlacesToMap();
    setTimeout(() => {
        map.invalidateSize();
        if (markers.length > 0) {
            const group = L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.15));
        }
    }, 300);
}

function addPlacesToMap() {
    if (typeof PLACES_DATA === 'undefined') return;
    PLACES_DATA.temples.forEach(p => addMarker(p, 'temple'));
    PLACES_DATA.cafes.forEach(p => addMarker(p, 'cafe'));
    PLACES_DATA.hotels.forEach(p => addMarker(p, 'hotel'));
    if (PLACES_DATA.nature) PLACES_DATA.nature.forEach(p => addMarker(p, 'nature'));
}

function addMarker(place, type) {
    if (!place.lat || !place.lng) return;
    const icon = L.icon(markerIcons[type] || markerIcons.temple);
    const marker = L.marker([place.lat, place.lng], { icon }).addTo(map);
    const navUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + place.lat + ',' + place.lng;
    marker.bindPopup(
        '<div class="custom-info-window"><div class="info-window-content">' +
        '<img src="' + place.image + '" alt="' + place.name + '" class="info-window-image" loading="lazy">' +
        '<h4 class="info-window-title">' + place.name + '</h4>' +
        '<div class="info-window-rating"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
        '<span>' + place.rating + ' (' + place.reviews.toLocaleString() + ' รีวิว)</span></div>' +
        '<div class="info-window-location"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
        '<span>' + place.location + '</span></div>' +
        '<a href="' + navUrl + '" target="_blank" rel="noopener noreferrer" class="info-window-navigate">นำทางด้วย Google Maps</a>' +
        '</div></div>',
        { maxWidth: 280, className: 'custom-popup' }
    );
    markers.push(marker);
}

// ========================================
// Card Builder — ใช้ place-card เหมือนหน้าหลัก
// ========================================
function buildCard(place, badge) {
    const badgeHtml = badge ? '<span class="dest-badge">' + badge + '</span>' : '';
    const priceHtml = place.price ? '<div class="place-price">' + place.price + '</div>' : '';
    return '<div class="place-card">' +
        '<div class="place-image">' +
        '<img src="' + place.image + '" alt="' + place.name + '" loading="lazy">' +
        '<div class="place-overlay"></div>' +
        badgeHtml +
        '<span class="place-rating"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' + place.rating + '</span>' +
        '</div>' +
        '<div class="place-content">' +
        '<span class="place-category">' + place.category + '</span>' +
        '<h3 class="place-title">' + place.name + '</h3>' +
        '<p class="place-description">' + place.description + '</p>' +
        '<div class="place-footer">' +
        '<span class="place-location"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' + place.location + '</span>' +
        '<span class="place-reviews">' + place.reviews.toLocaleString() + ' รีวิว</span>' +
        '</div>' +
        priceHtml +
        '<a href="#" class="place-link"><span>ดูรายละเอียด</span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>' +
        '</div></div>';
}

// ========================================
// Render Carousels
// ========================================
function renderCarousels() {
    if (typeof PLACES_DATA === 'undefined') {
        console.error('PLACES_DATA not found');
        return;
    }

    const allPlaces = [
        ...PLACES_DATA.temples,
        ...(PLACES_DATA.nature || []),
        ...(PLACES_DATA.restaurants || []),
        ...PLACES_DATA.cafes,
        ...PLACES_DATA.hotels
    ];
    const recommended = [...allPlaces].sort((a, b) => b.rating - a.rating).slice(0, 10);

    renderCarousel('carousel-recommended', recommended, 'ยอดนิยม');
    renderCarousel('carousel-culture', PLACES_DATA.temples, null);
    renderCarousel('carousel-cafe', PLACES_DATA.cafes, null);
    renderCarousel('carousel-hotel', PLACES_DATA.hotels, null);
    renderCarousel('carousel-nature', PLACES_DATA.nature || [], null);

    setTimeout(() => {
        if (window.PlacesCarousel) {
            new window.PlacesCarousel('carousel-recommended', 'recommended-prev', 'recommended-next', 'recommended-indicators');
            new window.PlacesCarousel('carousel-culture', 'culture-prev', 'culture-next', 'culture-indicators');
            new window.PlacesCarousel('carousel-cafe', 'cafe-prev', 'cafe-next', 'cafe-indicators');
            new window.PlacesCarousel('carousel-hotel', 'hotel-prev', 'hotel-next', 'hotel-indicators');
            new window.PlacesCarousel('carousel-nature', 'nature-prev', 'nature-next', 'nature-indicators');
        } else {
            setupBasicNavs();
        }
    }, 200);
}

function renderCarousel(containerId, places, badge) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!places || places.length === 0) {
        container.innerHTML = '<p style="padding:1rem;color:#999;">ไม่มีข้อมูล</p>';
        return;
    }
    container.innerHTML = places.map(p => buildCard(p, badge)).join('');
}

function setupBasicNavs() {
    [
        ['carousel-recommended', 'recommended-prev', 'recommended-next'],
        ['carousel-culture', 'culture-prev', 'culture-next'],
        ['carousel-cafe', 'cafe-prev', 'cafe-next'],
        ['carousel-hotel', 'hotel-prev', 'hotel-next'],
        ['carousel-nature', 'nature-prev', 'nature-next']
    ].forEach(([id, prevId, nextId]) => {
        const c = document.getElementById(id);
        const p = document.getElementById(prevId);
        const n = document.getElementById(nextId);
        if (!c) return;
        if (p) p.addEventListener('click', () => c.scrollBy({ left: -340, behavior: 'smooth' }));
        if (n) n.addEventListener('click', () => c.scrollBy({ left: 340, behavior: 'smooth' }));
    });
}

// ========================================
// Filter Tabs
// ========================================
function setupFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    const sections = document.querySelectorAll('.explore-category-section');
    const sectionMap = { all: null, recommended: 'recommended', culture: 'culture', cafe: 'cafe', hotel: 'hotel', nature: 'nature', food: 'food' };
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const cat = tab.dataset.category;
            sections.forEach(sec => {
                sec.style.display = (cat === 'all' || sec.dataset.section === sectionMap[cat]) ? '' : 'none';
            });
        });
    });
}

// ========================================
// Init
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof L !== 'undefined') initMap();
    renderCarousels();
    setupFilterTabs();
});

console.log('Explore page script loaded');

