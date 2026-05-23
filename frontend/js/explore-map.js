// ========================================
// OpenStreetMap Integration for Explore Page
// Using Leaflet.js (No API Key Required!)
// ========================================

let map;
let markers = [];

// Custom Marker Icons (สีสันสวยงาม)
const markerIcons = {
    temple: {
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" fill="#d4af37" stroke="#ffffff" stroke-width="3"/>
                <text x="16" y="21" font-size="16" text-anchor="middle" fill="#ffffff" font-weight="bold">🛕</text>
            </svg>
        `),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    },
    cafe: {
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" fill="#2196F3" stroke="#ffffff" stroke-width="3"/>
                <text x="16" y="21" font-size="16" text-anchor="middle" fill="#ffffff" font-weight="bold">☕</text>
            </svg>
        `),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    },
    hotel: {
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" fill="#4CAF50" stroke="#ffffff" stroke-width="3"/>
                <text x="16" y="21" font-size="16" text-anchor="middle" fill="#ffffff" font-weight="bold">🏨</text>
            </svg>
        `),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    }
};

// Initialize Map
function initMap() {
    console.log('🗺️ Initializing OpenStreetMap...');

    // Center of Nakhon Phanom
    const nakhonPhanom = [17.4070, 104.7720];

    // Create Map with OpenStreetMap tiles
    map = L.map('openstreet-map').setView(nakhonPhanom, 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 10
    }).addTo(map);

    // Add all places to map
    addPlacesToMap();

    // Setup toggle button
    setupToggleButton();

    console.log('✅ OpenStreetMap initialized successfully');
}

// Add all places to map
function addPlacesToMap() {
    // Clear existing markers
    clearMarkers();

    // Add temples
    PLACES_DATA.temples.forEach(place => {
        addMarker(place, 'temple');
    });

    // Add cafes
    PLACES_DATA.cafes.forEach(place => {
        addMarker(place, 'cafe');
    });

    // Add hotels
    PLACES_DATA.hotels.forEach(place => {
        addMarker(place, 'hotel');
    });

    // Fit bounds to show all markers
    fitMapToMarkers();
}

// Add marker to map
function addMarker(place, type) {
    if (!place.lat || !place.lng) {
        console.warn(`⚠️ Missing coordinates for ${place.name}`);
        return;
    }

    const position = [place.lat, place.lng];

    // Create custom icon
    const icon = L.icon(markerIcons[type]);

    // Create marker
    const marker = L.marker(position, { icon: icon }).addTo(map);

    // Create popup content
    const popupContent = createPopupContent(place);

    // Bind popup
    marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
    });

    markers.push(marker);
}

// Create popup content
function createPopupContent(place) {
    const navigateUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    
    return `
        <div class="custom-info-window">
            <div class="info-window-content">
                <img src="${place.image}" alt="${place.name}" class="info-window-image" loading="lazy">
                <h4 class="info-window-title">${place.name}</h4>
                <div class="info-window-rating">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>${place.rating} (${place.reviews.toLocaleString()} รีวิว)</span>
                </div>
                <div class="info-window-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>${place.location}</span>
                </div>
                <a href="${navigateUrl}" target="_blank" rel="noopener noreferrer" class="info-window-navigate">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                    </svg>
                    <span>นำทางด้วย Google Maps</span>
                </a>
            </div>
        </div>
    `;
}

// Clear all markers
function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}

// Fit map to show all markers
function fitMapToMarkers() {
    if (markers.length === 0) return;

    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
}

// Setup toggle button — ลบออก แผนที่แสดงเลย
function setupToggleButton() {
    // ไม่ต้องใช้ toggle แล้ว แผนที่แสดงตลอด
    // Trigger resize เพื่อให้แผนที่แสดงผลถูกต้อง
    setTimeout(() => {
        if (map) {
            map.invalidateSize();
            fitMapToMarkers();
        }
    }, 200);
}

// ========================================
// Favorites — กดได้จริง
// ========================================
function setupFavorites() {
    document.querySelectorAll('.dest-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.classList.toggle('active');
            const isActive = btn.classList.contains('active');
            btn.setAttribute('aria-label', isActive ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด');
        });
    });
}

// ========================================
// Gallery Modal
// ========================================
function setupGallery() {
    const modal = document.getElementById('gallery-modal');
    const closeBtn = document.getElementById('gallery-modal-close');
    const mainImg = document.getElementById('gallery-main-image');
    const thumbsContainer = document.getElementById('gallery-thumbnails');
    const titleEl = document.getElementById('gallery-modal-title');

    if (!modal) return;

    // เปิด modal เมื่อกดปุ่ม gallery
    document.querySelectorAll('.dest-gallery-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const name = btn.dataset.name || 'รูปภาพ';
            const images = JSON.parse(btn.dataset.images || '[]');

            if (images.length === 0) return;

            titleEl.textContent = name;
            mainImg.src = images[0];
            mainImg.alt = name;

            // สร้าง thumbnails
            thumbsContainer.innerHTML = images.map((src, i) => `
                <img src="${src}" alt="${name} ${i + 1}" class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}" loading="lazy">
            `).join('');

            // กด thumbnail เปลี่ยนรูปหลัก
            thumbsContainer.querySelectorAll('.gallery-thumb').forEach(thumb => {
                thumb.addEventListener('click', () => {
                    mainImg.src = images[parseInt(thumb.dataset.index)];
                    thumbsContainer.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });
            });

            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    // ปิด modal
    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// ========================================
// Filter Tabs
// ========================================
function setupFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.destination-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.dataset.category;

            cards.forEach(card => {
                if (category === 'all') {
                    card.style.display = '';
                } else {
                    const cardCategories = card.dataset.category || '';
                    card.style.display = cardCategories.includes(category) ? '' : 'none';
                }
            });
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (typeof L !== 'undefined') {
        initMap();
    } else {
        console.error('❌ Leaflet.js not loaded');
    }
    setupFavorites();
    setupGallery();
    setupFilterTabs();
});

console.log('✅ Explore Map script loaded (OpenStreetMap)');

