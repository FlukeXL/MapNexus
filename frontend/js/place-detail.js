// ===================================
// MapNexus — Place Detail Popup
// Mobile Only (≤768px)
// ===================================

(function () {
  'use strict';

  // ===== CSS Inject =====
  function injectStyles() {
    if (document.getElementById('place-detail-styles')) return;
    const style = document.createElement('style');
    style.id = 'place-detail-styles';
    style.textContent = `
      /* ===== Place Detail — Mobile Only ===== */
      @media (max-width: 768px) {

        .pd-overlay {
          position: fixed; inset: 0; z-index: 99990;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: pd-fade-in 0.25s ease;
        }

        @keyframes pd-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .pd-sheet {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 99991;
          background: #fff;
          border-radius: 24px 24px 0 0;
          max-height: 88vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: pd-slide-up 0.35s cubic-bezier(0.34,1.56,0.64,1);
          padding-bottom: calc(env(safe-area-inset-bottom) + 80px);
        }

        @keyframes pd-slide-up {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }

        .pd-sheet.closing {
          animation: pd-slide-down 0.28s ease forwards;
        }

        @keyframes pd-slide-down {
          from { transform: translateY(0); }
          to   { transform: translateY(100%); }
        }

        /* Handle bar */
        .pd-handle {
          width: 40px; height: 4px;
          background: #e0ddd8;
          border-radius: 2px;
          margin: 10px auto 0;
          flex-shrink: 0;
        }

        /* Gallery */
        .pd-gallery {
          position: relative;
          flex-shrink: 0;
          height: 220px;
          overflow: hidden;
        }

        .pd-gallery-scroll {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          height: 100%;
          scrollbar-width: none;
        }

        .pd-gallery-scroll::-webkit-scrollbar { display: none; }

        .pd-gallery-img {
          flex: 0 0 100%;
          scroll-snap-align: start;
          object-fit: cover;
          width: 100%;
          height: 220px;
        }

        /* Rating badge */
        .pd-rating-badge {
          position: absolute;
          top: 12px; right: 12px;
          background: rgba(255,255,255,0.95);
          border-radius: 20px;
          padding: 0.3rem 0.65rem;
          display: flex; align-items: center; gap: 0.25rem;
          font-size: 0.85rem; font-weight: 700;
          color: #b8941e;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        /* Close button */
        .pd-close {
          position: absolute;
          top: 12px; left: 12px;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(0,0,0,0.45);
          border: none;
          display: flex; align-items: center; justify-content: center;
          color: #fff; cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        /* Dots */
        .pd-dots {
          position: absolute;
          bottom: 10px; left: 50%;
          transform: translateX(-50%);
          display: flex; gap: 5px;
        }

        .pd-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          transition: all 0.2s;
        }

        .pd-dot.active {
          background: #fff;
          width: 16px;
          border-radius: 3px;
        }

        /* Content scroll */
        .pd-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 1.1rem 1rem;
          -webkit-overflow-scrolling: touch;
        }

        /* Header */
        .pd-category {
          display: inline-block;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #b8941e;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 12px;
          padding: 0.18rem 0.6rem;
          margin-bottom: 0.4rem;
        }

        .pd-name {
          font-family: 'Noto Serif Thai', serif;
          font-size: 1.2rem; font-weight: 700;
          color: #1a1a1a; line-height: 1.3;
          margin-bottom: 0.3rem;
        }

        .pd-meta {
          display: flex; align-items: center; gap: 0.75rem;
          font-size: 0.75rem; color: #888;
          margin-bottom: 0.875rem;
          flex-wrap: wrap;
        }

        .pd-meta-item {
          display: flex; align-items: center; gap: 0.25rem;
        }

        .pd-meta-item svg { color: #d4af37; flex-shrink: 0; }

        /* Divider */
        .pd-divider {
          height: 1px;
          background: #f0ede8;
          margin: 0.75rem 0;
        }

        /* Info rows */
        .pd-info-row {
          display: flex; align-items: flex-start; gap: 0.6rem;
          margin-bottom: 0.65rem;
        }

        .pd-info-icon {
          width: 28px; height: 28px;
          border-radius: 8px;
          background: rgba(212,175,55,0.1);
          display: flex; align-items: center; justify-content: center;
          color: #b8941e; flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .pd-info-content { flex: 1; }

        .pd-info-label {
          font-size: 0.65rem; font-weight: 700;
          color: #aaa; text-transform: uppercase;
          letter-spacing: 0.06em; margin-bottom: 0.15rem;
        }

        .pd-info-text {
          font-size: 0.82rem; color: #444;
          line-height: 1.55;
        }

        .pd-phone-link {
          color: #b8941e; text-decoration: none; font-weight: 600;
        }

        /* Price badge */
        .pd-price {
          display: inline-flex; align-items: center; gap: 0.35rem;
          background: linear-gradient(135deg, rgba(184,148,30,0.12), rgba(212,175,55,0.08));
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 10px;
          padding: 0.4rem 0.75rem;
          font-size: 0.82rem; font-weight: 700;
          color: #b8941e;
          margin-bottom: 0.65rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ===== Find place by id =====
  function findPlace(id) {
    if (typeof PLACES_DATA === 'undefined') return null;
    const all = [
      ...(PLACES_DATA.temples || []),
      ...(PLACES_DATA.cafes || []),
      ...(PLACES_DATA.hotels || [])
    ];
    return all.find(p => p.id === parseInt(id)) || null;
  }

  // ===== Open Popup =====
  function openPlaceDetail(id) {
    if (window.innerWidth > 768) return; // mobile only
    const place = findPlace(id);
    if (!place) return;

    injectStyles();

    // Remove existing
    closePlaceDetail(true);

    const gallery = place.gallery || [place.image];
    const dots = gallery.map((_, i) => `<span class="pd-dot ${i === 0 ? 'active' : ''}"></span>`).join('');
    const imgs = gallery.map(src => `<img class="pd-gallery-img" src="${src}" alt="${place.name}" loading="lazy">`).join('');

    const overlay = document.createElement('div');
    overlay.className = 'pd-overlay';
    overlay.id = 'pd-overlay';

    const sheet = document.createElement('div');
    sheet.className = 'pd-sheet';
    sheet.id = 'pd-sheet';
    sheet.innerHTML = `
      <div class="pd-handle"></div>
      <div class="pd-gallery">
        <div class="pd-gallery-scroll" id="pd-gallery-scroll">${imgs}</div>
        <button type="button" class="pd-close" id="pd-close" aria-label="ปิด">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="pd-rating-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#d4af37"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          ${place.rating}
        </div>
        <div class="pd-dots" id="pd-dots">${dots}</div>
      </div>
      <div class="pd-content">
        <span class="pd-category">${place.category}</span>
        <h2 class="pd-name">${place.name}</h2>
        <div class="pd-meta">
          <span class="pd-meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${place.location}
          </span>
          <span class="pd-meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            ${place.reviews.toLocaleString()} รีวิว
          </span>
        </div>
        ${place.price ? `<div class="pd-price"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>${place.price}</div>` : ''}
        <div class="pd-divider"></div>
        ${place.openYear ? `
        <div class="pd-info-row">
          <div class="pd-info-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
          <div class="pd-info-content"><div class="pd-info-label">เปิดตั้งแต่</div><div class="pd-info-text">${place.openYear}</div></div>
        </div>` : ''}
        ${place.history ? `
        <div class="pd-info-row">
          <div class="pd-info-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
          <div class="pd-info-content"><div class="pd-info-label">ประวัติความเป็นมา</div><div class="pd-info-text">${place.history}</div></div>
        </div>` : ''}
        ${place.about ? `
        <div class="pd-info-row">
          <div class="pd-info-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
          <div class="pd-info-content"><div class="pd-info-label">เกี่ยวกับ</div><div class="pd-info-text">${place.about}</div></div>
        </div>` : ''}
        ${place.phone ? `
        <div class="pd-info-row">
          <div class="pd-info-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/></svg></div>
          <div class="pd-info-content"><div class="pd-info-label">เบอร์โทรศัพท์</div><div class="pd-info-text"><a href="tel:${place.phone}" class="pd-phone-link">${place.phone}</a></div></div>
        </div>` : ''}
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(sheet);
    document.body.style.overflow = 'hidden';

    // Gallery dots sync
    const galleryScroll = document.getElementById('pd-gallery-scroll');
    const dotsEl = document.getElementById('pd-dots');
    if (galleryScroll && dotsEl) {
      galleryScroll.addEventListener('scroll', () => {
        const idx = Math.round(galleryScroll.scrollLeft / galleryScroll.clientWidth);
        dotsEl.querySelectorAll('.pd-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
      }, { passive: true });
    }

    // Close events
    document.getElementById('pd-close').addEventListener('click', closePlaceDetail);
    overlay.addEventListener('click', closePlaceDetail);

    // Swipe down to close
    let startY = 0;
    sheet.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
    sheet.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].clientY - startY;
      if (diff > 80) closePlaceDetail();
    }, { passive: true });
  }

  // ===== Close Popup =====
  function closePlaceDetail(instant) {
    const sheet = document.getElementById('pd-sheet');
    const overlay = document.getElementById('pd-overlay');
    if (!sheet) return;

    if (instant) {
      sheet.remove();
      if (overlay) overlay.remove();
      document.body.style.overflow = '';
      return;
    }

    sheet.classList.add('closing');
    overlay.style.animation = 'pd-fade-in 0.25s ease reverse';
    setTimeout(() => {
      sheet.remove();
      if (overlay) overlay.remove();
      document.body.style.overflow = '';
    }, 280);
  }

  // ===== Attach events to cards =====
  function attachCardEvents() {
    if (window.innerWidth > 768) return;

    // place-card (index.html)
    document.querySelectorAll('.place-card[data-id]').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        e.preventDefault();
        openPlaceDetail(card.dataset.id);
      });
    });

    // place-link inside place-card
    document.querySelectorAll('.place-card .place-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const card = link.closest('.place-card');
        if (card) openPlaceDetail(card.dataset.id);
      });
    });

    // ec-card (explore.html) — ผูกผ่าน data-id
    document.querySelectorAll('[data-place-id]').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        e.preventDefault();
        openPlaceDetail(card.dataset.placeId);
      });
    });

    // ec-link
    document.querySelectorAll('.ec-link, .ec-card-landscape .ec-link, .ec-card-portrait .ec-link').forEach(link => {
      link.addEventListener('click', e => {
        if (window.innerWidth > 768) return;
        e.preventDefault();
        const card = link.closest('[data-place-id]');
        if (card) openPlaceDetail(card.dataset.placeId);
      });
    });
  }

  // expose
  window.openPlaceDetail = openPlaceDetail;
  window.closePlaceDetail = closePlaceDetail;

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(attachCardEvents, 600);
  });

  // Re-attach after dynamic render
  window.attachPlaceCardEvents = attachCardEvents;

})();
