// ========================================
// Explore Page — Map + Cards + Carousel
// ========================================

let map;
let markers = [];

// ---- Marker Icons ----
const markerIcons = {
    temple: {
        iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#d4af37" stroke="#fff" stroke-width="3"/><text x="18" y="24" font-size="16" text-anchor="middle" fill="#fff">🛕</text></svg>'),
        iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36]
    },
    cafe: {
        iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#2196F3" stroke="#fff" stroke-width="3"/><text x="18" y="24" font-size="16" text-anchor="middle" fill="#fff">☕</text></svg>'),
        iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36]
    },
    hotel: {
        iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#4CAF50" stroke="#fff" stroke-width="3"/><text x="18" y="24" font-size="16" text-anchor="middle" fill="#fff">🏨</text></svg>'),
        iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36]
    }
};

// ---- Init Map ----
function initMap() {
    const center = [17.4070, 104.7720];
    map = L.map('openstreet-map', { zoomControl: true }).setView(center, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(map);

    addPlacesToMap();

    // Invalidate size after render
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
}

function addMarker(place, type) {
    if (!place.lat || !place.lng) return;
    const icon = L.icon(markerIcons[type]);
    const marker = L.marker([place.lat, place.lng], { icon }).addTo(map);
    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    marker.bindPopup(`
        <div class="custom-info-window">
            <div class="info-window-content">
                <img src="${place.image}" alt="${place.name}" class="info-window-image" loading="lazy">
                <h4 class="info-window-title">${place.name}</h4>
                <div class="info-window-rating">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span>${place.rating} (${place.reviews.toLocaleString()} รีวิว)</span>
                </div>
                <div class="info-window-location">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>${place.location}</span>
                </div>
                <a href="${navUrl}" target="_blank" rel="noopener noreferrer" class="info-window-navigate">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    นำทางด้วย Google Maps
                </a>
            </div>
        </div>
    `, { maxWidth: 280, className: 'custom-popup' });
    markers.push(marker);
}

// ========================================
// Card Builder — ตรงกับภาพที่ต้องการ
// rating badge บนรูป, category เป็น pill สีทอง
// ========================================
function buildCard(place, badge) {
    const imagesJson = JSON.stringify([place.image]);
    const badgeHtml = badge
        ? `<span class="epc-badge">${badge}</span>`
        : '';

    return `
        <article class="epc-card">
            <div class="epc-image">
                <img src="${place.image}" alt="${place.name}" loading="lazy">
                ${badgeHtml}
                <div class="epc-rating-badge">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    ${place.rating}
                </div>
                <button type="button" class="epc-fav" aria-label="เพิ่มในรายการโปรด">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </button>
            </div>
            <div class="epc-body">
                <span class="epc-category">${place.category}</span>
                <h3 class="epc-title">${place.name}</h3>
                <p class="epc-desc">${place.description}</p>
                <div class="epc-footer">
                    <div class="epc-location">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        ${place.location}
                    </div>
                    <span class="epc-reviews">${place.reviews.toLocaleString()} รีวิว</span>
                </div>
                <a href="#" class="epc-link">
                    ดูรายละเอียด
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
        </article>
    `;
}

// ========================================
// Render Carousels
// ========================================
function renderCarousels() {
    if (typeof PLACES_DATA === 'undefined') return;

    // แนะนำ — top rated จากทุกหมวด
    const recommended = [
        ...PLACES_DATA.temples,
        ...PLACES_DATA.cafes,
        ...PLACES_DATA.hotels
    ].sort((a, b) => b.rating - a.rating).slice(0, 8);

    renderCarousel('carousel-recommended', recommended, 'ยอดนิยม');

    // วัฒนธรรม — temples
    renderCarousel('carousel-culture', PLACES_DATA.temples, null);

    // คาเฟ่
    renderCarousel('carousel-cafe', PLACES_DATA.cafes, null);

    // โรงแรม
    renderCarousel('carousel-hotel', PLACES_DATA.hotels, null);

    // ธรรมชาติ — ใช้ temples + nature places
    const nature = [
        ...PLACES_DATA.temples.slice(0, 2),
        ...PLACES_DATA.cafes.slice(0, 2)
    ];
    renderCarousel('carousel-nature', nature, null);

    // Setup carousel nav buttons
    setupCarouselNavs();

    // Setup favorites + gallery
    setupFavorites();
    setupGallery();
}

function renderCarousel(containerId, places, badge) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = places.map(p => buildCard(p, badge)).join('');

    // เพิ่ม dot indicators
    const wrapper = container.closest('.explore-carousel-wrapper');
    if (!wrapper) return;

    // ลบ dots เก่าถ้ามี
    const oldDots = wrapper.parentElement.querySelector('.epc-dots');
    if (oldDots) oldDots.remove();

    // คำนวณจำนวน pages (แสดง 4 การ์ดต่อหน้า)
    const cardsPerPage = 4;
    const totalPages = Math.ceil(places.length / cardsPerPage);
    if (totalPages <= 1) return;

    const dotsEl = document.createElement('div');
    dotsEl.className = 'epc-dots';
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.className = 'epc-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `หน้า ${i + 1}`);
        dot.addEventListener('click', () => {
            container.scrollTo({ left: i * (300 + 24) * cardsPerPage, behavior: 'smooth' });
            dotsEl.querySelectorAll('.epc-dot').forEach((d, idx) => {
                d.classList.toggle('active', idx === i);
            });
        });
        dotsEl.appendChild(dot);
    }
    wrapper.parentElement.appendChild(dotsEl);

    // อัปเดต dot เมื่อ scroll
    container.addEventListener('scroll', () => {
        const scrollLeft = container.scrollLeft;
        const cardWidth = 300 + 24;
        const currentPage = Math.round(scrollLeft / (cardWidth * cardsPerPage));
        dotsEl.querySelectorAll('.epc-dot').forEach((d, idx) => {
            d.classList.toggle('active', idx === currentPage);
        });
    }, { passive: true });
}

// ========================================
// Carousel Navigation
// ========================================
function setupCarouselNavs() {
    document.querySelectorAll('.explore-carousel-wrapper').forEach(wrapper => {
        const carousel = wrapper.querySelector('.explore-carousel');
        const prevBtn = wrapper.querySelector('.explore-nav.prev');
        const nextBtn = wrapper.querySelector('.explore-nav.next');
        if (!carousel || !prevBtn || !nextBtn) return;

        const scrollAmount = 320;

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    });
}

// ========================================
// Favorites
// ========================================
function setupFavorites() {
    document.querySelectorAll('.epc-fav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.classList.toggle('active');
            btn.setAttribute('aria-label',
                btn.classList.contains('active') ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'
            );
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

    document.querySelectorAll('.explore-gallery-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const name = btn.dataset.name || 'รูปภาพ';
            const images = JSON.parse(btn.dataset.images || '[]');
            if (!images.length) return;

            titleEl.textContent = name;
            mainImg.src = images[0];
            mainImg.alt = name;

            thumbsContainer.innerHTML = images.map((src, i) =>
                `<img src="${src}" alt="${name} ${i+1}" class="gallery-thumb ${i===0?'active':''}" data-index="${i}" loading="lazy">`
            ).join('');

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

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

// ========================================
// Filter Tabs — ซ่อน/แสดง section
// ========================================
function setupFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    const sections = document.querySelectorAll('.explore-category-section');

    const sectionMap = {
        all: null,
        recommended: 'recommended',
        culture: 'culture',
        cafe: 'cafe',
        hotel: 'hotel',
        nature: 'nature',
        food: 'food'
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const cat = tab.dataset.category;

            sections.forEach(sec => {
                if (cat === 'all') {
                    sec.style.display = '';
                } else {
                    sec.style.display = sec.dataset.section === sectionMap[cat] ? '' : 'none';
                }
            });
        });
    });
}

// ========================================
// Init
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Map
    if (typeof L !== 'undefined') {
        initMap();
    } else {
        console.error('❌ Leaflet.js not loaded');
    }

    // Cards
    renderCarousels();

    // Filter
    setupFilterTabs();
});

console.log('✅ Explore page loaded');
