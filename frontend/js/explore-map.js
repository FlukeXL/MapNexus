// ========================================
// Google Maps Integration for Explore Page
// ========================================

let map;
let markers = [];
let infoWindows = [];

// Custom Marker Icons (สีสันสวยงาม)
const markerIcons = {
    temple: {
        path: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
        fillColor: '#d4af37',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 1.5,
        anchor: new google.maps.Point(12, 12)
    },
    cafe: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#2196F3',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 10
    },
    hotel: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#4CAF50',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 10
    }
};

// Initialize Map
function initMap() {
    console.log('🗺️ Initializing Google Maps...');

    // Center of Nakhon Phanom
    const nakhonPhanom = { lat: 17.4070, lng: 104.7720 };

    // Create Map
    map = new google.maps.Map(document.getElementById('google-map'), {
        center: nakhonPhanom,
        zoom: 13,
        styles: getMapStyles(),
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
    });

    // Add all places to map
    addPlacesToMap();

    // Setup toggle button
    setupToggleButton();

    console.log('✅ Google Maps initialized successfully');
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

    const position = { lat: place.lat, lng: place.lng };

    // Create marker with custom icon
    const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: place.name,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: getMarkerColor(type),
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
            scale: 12
        },
        animation: google.maps.Animation.DROP
    });

    // Create info window
    const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(place)
    });

    // Add click listener
    marker.addListener('click', () => {
        // Close all other info windows
        closeAllInfoWindows();
        
        // Open this info window
        infoWindow.open(map, marker);
        
        // Bounce animation
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 750);
    });

    markers.push(marker);
    infoWindows.push(infoWindow);
}

// Get marker color based on type
function getMarkerColor(type) {
    const colors = {
        temple: '#d4af37', // Gold
        cafe: '#2196F3',   // Blue
        hotel: '#4CAF50'   // Green
    };
    return colors[type] || '#9E9E9E';
}

// Create info window content
function createInfoWindowContent(place) {
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

// Close all info windows
function closeAllInfoWindows() {
    infoWindows.forEach(infoWindow => infoWindow.close());
}

// Clear all markers
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    infoWindows = [];
}

// Fit map to show all markers
function fitMapToMarkers() {
    if (markers.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    markers.forEach(marker => {
        bounds.extend(marker.getPosition());
    });
    map.fitBounds(bounds);

    // Adjust zoom if too close
    google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        if (map.getZoom() > 15) {
            map.setZoom(15);
        }
    });
}

// Setup toggle button
function setupToggleButton() {
    const toggleBtn = document.getElementById('toggle-map-btn');
    const mapSection = document.getElementById('map-section');

    if (!toggleBtn || !mapSection) return;

    toggleBtn.addEventListener('click', () => {
        mapSection.classList.toggle('active');
        toggleBtn.classList.toggle('active');

        // Trigger resize event to fix map rendering
        if (mapSection.classList.contains('active')) {
            setTimeout(() => {
                google.maps.event.trigger(map, 'resize');
                fitMapToMarkers();
            }, 100);
        }
    });
}

// Custom map styles (Gold theme)
function getMapStyles() {
    return [
        {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": [{ "color": "#f5f5f5" }]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#c9e6f2" }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#2c5f7c" }]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#ffffff" }]
        },
        {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#d4d4d4" }]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{ "color": "#e5f3e0" }]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#757575" }]
        }
    ];
}

// Export for global access
window.initMap = initMap;

console.log('✅ Explore Map script loaded');
