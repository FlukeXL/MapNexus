// ===================================
// MapNexus — Event Notification Popup
// แสดงกิจกรรมของเมืองเมื่อเข้าหน้าเว็บ
// ===================================

(function () {
  'use strict';

  // แสดงกิจกรรมที่จะมาถึงภายในกี่วัน
  const UPCOMING_DAYS = 60;

  // ===== ตรวจสอบว่าควรแสดงหรือไม่ (แสดงแค่ครั้งแรกของ session เท่านั้น) =====
  function shouldShow() {
    return !sessionStorage.getItem('mapnexus_event_shown');
  }

  // ===== กรองกิจกรรมที่กำลังจะมาถึง =====
  function getUpcomingEvents() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const future = new Date(now);
    future.setDate(future.getDate() + UPCOMING_DAYS);

    return (window.CITY_EVENTS || []).filter(ev => {
      // กิจกรรมประจำ (recurring) แสดงเสมอ
      if (ev.recurring) return true;
      const start = new Date(ev.startDate);
      const end = new Date(ev.endDate);
      return end >= now && start <= future;
    }).sort((a, b) => {
      // กิจกรรมประจำขึ้นก่อน ตามด้วยกิจกรรมที่มีวันที่เรียงตามวัน
      if (a.recurring && !b.recurring) return -1;
      if (!a.recurring && b.recurring) return 1;
      if (a.recurring && b.recurring) return 0;
      return new Date(a.startDate) - new Date(b.startDate);
    });
  }

  // ===== Format วันที่ภาษาไทย =====
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  function formatDateRange(start, end) {
    const s = new Date(start);
    const e = new Date(end);
    if (start === end) return formatDate(start);
    if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
      return `${s.getDate()}–${e.getDate()} ${e.toLocaleDateString('th-TH', { month: 'short', year: 'numeric' })}`;
    }
    return `${formatDate(start)} – ${formatDate(end)}`;
  }

  // ===== นับวันที่เหลือ =====
  function getDaysUntil(dateStr) {
    const now = new Date(); now.setHours(0,0,0,0);
    const target = new Date(dateStr);
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return '🔴 กำลังจัดอยู่';
    if (diff === 1) return '⚡ พรุ่งนี้';
    if (diff <= 7) return `⚡ อีก ${diff} วัน`;
    return `📅 อีก ${diff} วัน`;
  }

  // ===== สร้าง HTML ของ popup =====
  function buildPopup(events) {
    const cards = events.map((ev, i) => `
      <div class="enp-card ${i === 0 ? 'active' : ''}" data-index="${i}">
        <div class="enp-card-type enp-type-${ev.type}">
          <span>${ev.emoji}</span>
          <span>${getTypeLabel(ev.type)}</span>
        </div>
        <h3 class="enp-card-title">${ev.title}</h3>
        <p class="enp-card-subtitle">${ev.subtitle}</p>
        <div class="enp-card-meta">
          <div class="enp-meta-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>${ev.recurring ? ev.recurringLabel : formatDateRange(ev.startDate, ev.endDate)}</span>
            ${!ev.recurring ? `<span class="enp-badge-days">${getDaysUntil(ev.startDate)}</span>` : '<span class="enp-badge-days">🔄 ประจำ</span>'}
          </div>
          <div class="enp-meta-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${ev.location} — ${ev.district}</span>
          </div>
        </div>
        <p class="enp-card-desc">${ev.description}</p>
        <div class="enp-card-highlight">${ev.highlight}</div>
        <div class="enp-card-footer">
          <span class="enp-price ${ev.isFree ? 'free' : 'paid'}">${ev.isFree ? '✅ ฟรี' : `🎟️ ${ev.ticketPrice || 'มีค่าใช้จ่าย'}`}</span>
          ${ev.link && ev.link !== '#' ? `<a href="${ev.link}" class="enp-btn-detail" target="_blank">ดูรายละเอียด →</a>` : ''}
        </div>
      </div>
    `).join('');

    const dots = events.length > 1 ? `
      <div class="enp-dots">
        ${events.map((_, i) => `<button type="button" class="enp-dot ${i === 0 ? 'active' : ''}" data-dot="${i}" aria-label="กิจกรรมที่ ${i+1}"></button>`).join('')}
      </div>
    ` : '';

    return `
      <div class="enp-overlay" id="enp-overlay" role="dialog" aria-modal="true" aria-label="กิจกรรมของเมือง">
        <div class="enp-modal">

          <!-- Header -->
          <div class="enp-header">
            <div class="enp-logo-center-wrap">
              <div class="enp-logo-circle">
                <img src="assets/images/Logo.png" alt="MapNexus Logo" class="enp-logo-img"
                     onerror="this.style.display='none';document.getElementById('enp-logo-fallback').style.display='flex'">
                <div class="enp-logo-fallback" id="enp-logo-fallback" style="display:none">
                  <span>M</span>
                </div>
              </div>
            </div>
            <div class="enp-header-text">
              <div class="enp-header-brand">MapNexus</div>
              <div class="enp-header-sub">การเดินทางที่มีระดับ</div>
            </div>
            <button type="button" class="enp-close" id="enp-close" aria-label="ปิด">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Title -->
          <div class="enp-title-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
              <circle cx="7" cy="17" r="2"/><circle cx="13" cy="17" r="2"/>
            </svg>
            <span>กิจกรรมที่กำลังจะมาถึง</span>
            <span class="enp-count">${events.length} กิจกรรม</span>
          </div>

          <!-- Cards -->
          <div class="enp-cards-wrap" id="enp-cards-wrap">
            ${cards}
          </div>

          <!-- Dots -->
          ${dots}

          <!-- Footer -->
          <div class="enp-footer">
            <button type="button" class="enp-btn-close-main" id="enp-close-main">
              ปิด
            </button>
          </div>

        </div>
      </div>
    `;
  }

  function getTypeLabel(type) {
    const labels = {
      festival: 'เทศกาล', culture: 'วัฒนธรรม', sport: 'กีฬา',
      food: 'อาหาร', music: 'ดนตรี', nature: 'ธรรมชาติ', community: 'ชุมชน'
    };
    return labels[type] || 'กิจกรรม';
  }

  // ===== Inject CSS =====
  function injectStyles() {
    const css = `
      /* ===== Event Notification Popup ===== */
      .enp-overlay {
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        padding: 1.25rem;
        animation: enp-fade-in 0.3s ease;
      }

      @keyframes enp-fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      /* Modal — compact กลางจอ ขอบโค้ง */
      .enp-modal {
        background: #fff;
        border-radius: 24px;
        width: 100%;
        max-width: 360px;
        max-height: 78vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(212,175,55,0.15);
        animation: enp-pop 0.4s cubic-bezier(0.34,1.56,0.64,1);
        overflow: hidden;
        position: relative;
      }

      @keyframes enp-pop {
        from { transform: scale(0.88) translateY(16px); opacity: 0; }
        to   { transform: scale(1) translateY(0); opacity: 1; }
      }

      /* Header — Logo เล็ก + ชื่อ + ปุ่มปิด */
      .enp-header {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        padding: 0.75rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.6rem;
        flex-shrink: 0;
        border-radius: 24px 24px 0 0;
      }

      .enp-logo-center-wrap {
        flex-shrink: 0;
      }

      .enp-logo-circle {
        width: 36px; height: 36px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        display: flex; align-items: center; justify-content: center;
        overflow: hidden;
        border: 2px solid rgba(212,175,55,0.5);
        flex-shrink: 0;
      }

      .enp-logo-img {
        width: 30px; height: 30px;
        object-fit: contain;
      }

      .enp-logo-fallback {
        width: 30px; height: 30px;
        background: linear-gradient(135deg, #b8941e, #d4af37);
        display: flex; align-items: center; justify-content: center;
        font-family: 'Noto Serif Thai', serif;
        font-size: 0.9rem; font-weight: 700; color: #1a1a1a;
        border-radius: 50%;
      }

      .enp-header-text {
        flex: 1;
        min-width: 0;
      }

      .enp-header-brand {
        font-family: 'Noto Serif Thai', serif;
        font-size: 0.82rem;
        font-weight: 700;
        background: linear-gradient(135deg, #f4e4c1, #d4af37);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1.2;
      }

      .enp-header-sub {
        font-size: 0.6rem;
        color: rgba(255,255,255,0.4);
        line-height: 1;
        margin-top: 0.1rem;
      }

      .enp-close {
        background: rgba(255,255,255,0.1);
        border: none;
        border-radius: 50%;
        width: 28px; height: 28px;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        color: rgba(255,255,255,0.6);
        transition: all 0.2s;
        flex-shrink: 0;
        -webkit-tap-highlight-color: transparent;
      }

      .enp-close:hover { background: rgba(255,255,255,0.2); color: #fff; }

      /* Title bar */
      .enp-title-bar {
        display: flex; align-items: center; gap: 0.4rem;
        padding: 0.55rem 1rem;
        background: #faf9f6;
        border-bottom: 1px solid #ede9e3;
        font-size: 0.72rem; font-weight: 700; color: #666;
        flex-shrink: 0;
        letter-spacing: 0.02em;
      }

      .enp-title-bar svg { color: #d4af37; flex-shrink: 0; }

      .enp-count {
        margin-left: auto;
        background: linear-gradient(135deg, #b8941e, #d4af37);
        color: #fff; font-size: 0.6rem; font-weight: 700;
        padding: 0.12rem 0.5rem; border-radius: 20px;
        letter-spacing: 0.03em;
      }

      /* Cards wrap — scrollable */
      .enp-cards-wrap {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        min-height: 0;
        -webkit-overflow-scrolling: touch;
      }

      .enp-cards-wrap::-webkit-scrollbar { width: 3px; }
      .enp-cards-wrap::-webkit-scrollbar-track { background: transparent; }
      .enp-cards-wrap::-webkit-scrollbar-thumb { background: #e8e6e1; border-radius: 2px; }

      /* Card */
      .enp-card {
        display: none;
        padding: 1rem;
      }

      .enp-card.active {
        display: block;
        animation: enp-card-in 0.22s ease;
      }

      @keyframes enp-card-in {
        from { opacity: 0; transform: translateX(10px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      /* Card type badge */
      .enp-card-type {
        display: inline-flex; align-items: center; gap: 0.3rem;
        font-size: 0.65rem; font-weight: 700;
        padding: 0.18rem 0.6rem;
        border-radius: 20px;
        margin-bottom: 0.5rem;
      }

      .enp-type-festival { background: #fff3e0; color: #e65100; }
      .enp-type-culture  { background: #f3e5f5; color: #6a1b9a; }
      .enp-type-sport    { background: #e8f5e9; color: #2e7d32; }
      .enp-type-food     { background: #fce4ec; color: #c62828; }
      .enp-type-music    { background: #e3f2fd; color: #1565c0; }
      .enp-type-nature   { background: #e0f2f1; color: #00695c; }
      .enp-type-community{ background: #f5f5f5; color: #424242; }

      .enp-card-title {
        font-family: 'Noto Serif Thai', serif;
        font-size: 1.05rem; font-weight: 700; color: #1a1a1a;
        margin-bottom: 0.15rem; line-height: 1.35;
      }

      .enp-card-subtitle {
        font-size: 0.72rem; color: #999;
        margin-bottom: 0.65rem; line-height: 1.4;
      }

      /* Meta rows */
      .enp-card-meta {
        display: flex; flex-direction: column; gap: 0.3rem;
        margin-bottom: 0.65rem;
        padding: 0.6rem 0.75rem;
        background: #faf9f6;
        border-radius: 10px;
        border: 1px solid #ede9e3;
      }

      .enp-meta-row {
        display: flex; align-items: center; gap: 0.35rem;
        font-size: 0.73rem; color: #555;
      }

      .enp-meta-row svg { color: #d4af37; flex-shrink: 0; }

      .enp-badge-days {
        margin-left: auto;
        font-size: 0.62rem; font-weight: 700;
        background: #fff8e1; color: #b8941e;
        padding: 0.08rem 0.45rem; border-radius: 20px;
        border: 1px solid rgba(212,175,55,0.25);
        white-space: nowrap;
      }

      /* Description */
      .enp-card-desc {
        font-size: 0.75rem; color: #666; line-height: 1.6;
        margin-bottom: 0.6rem;
      }

      /* Highlight */
      .enp-card-highlight {
        font-size: 0.68rem; color: #b8941e; font-weight: 600;
        background: #fffbf0;
        border-left: 3px solid #d4af37;
        padding: 0.35rem 0.6rem;
        border-radius: 0 8px 8px 0;
        margin-bottom: 0.65rem;
        line-height: 1.5;
      }

      /* Card footer */
      .enp-card-footer {
        display: flex; align-items: center; justify-content: space-between;
        gap: 0.5rem;
      }

      .enp-price {
        font-size: 0.7rem; font-weight: 700;
        padding: 0.22rem 0.6rem; border-radius: 20px;
      }

      .enp-price.free { background: #e8f5e9; color: #2e7d32; }
      .enp-price.paid { background: #fff3e0; color: #e65100; }

      .enp-btn-detail {
        font-size: 0.7rem; font-weight: 700; color: #b8941e;
        text-decoration: none; padding: 0.25rem 0.65rem;
        border: 1.5px solid rgba(212,175,55,0.35); border-radius: 20px;
        transition: all 0.2s;
        -webkit-tap-highlight-color: transparent;
      }

      .enp-btn-detail:active { background: #d4af37; color: #fff; }

      /* Dots */
      .enp-dots {
        display: flex; justify-content: center; gap: 0.35rem;
        padding: 0.5rem 0;
        border-top: 1px solid #f0ede8;
        flex-shrink: 0;
      }

      .enp-dot {
        width: 7px; height: 7px; border-radius: 50%;
        background: #e8e6e1; border: none; cursor: pointer;
        transition: all 0.2s; padding: 0;
        -webkit-tap-highlight-color: transparent;
      }

      .enp-dot.active { background: #d4af37; width: 20px; border-radius: 4px; }

      /* Footer */
      .enp-footer {
        padding: 0.65rem 1rem;
        border-top: 1px solid #ede9e3;
        flex-shrink: 0;
        background: #faf9f6;
        border-radius: 0 0 24px 24px;
      }

      .enp-btn-close-main {
        width: 100%; padding: 0.6rem;
        background: linear-gradient(135deg, #1a1a1a, #333);
        color: #fff; border: none; border-radius: 12px;
        font-family: inherit; font-size: 0.82rem; font-weight: 600;
        cursor: pointer; transition: all 0.2s;
        letter-spacing: 0.03em;
        -webkit-tap-highlight-color: transparent;
      }

      .enp-btn-close-main:active { background: linear-gradient(135deg, #333, #555); }

      /* Mobile — ยังคงเป็นกลางจอ ไม่ใช่ bottom sheet */
      @media (max-width: 480px) {
        .enp-overlay {
          padding: 1rem;
          align-items: center;
        }

        .enp-modal {
          max-width: 340px;
          max-height: 72vh;
          border-radius: 22px;
        }

        .enp-card { padding: 0.875rem; }
        .enp-card-title { font-size: 0.98rem; }
        .enp-card-desc { font-size: 0.72rem; }
      }

      @media (max-width: 375px) {
        .enp-modal {
          max-height: 68vh;
          border-radius: 20px;
        }
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ===== ปิด popup =====
  function closePopup() {
    const overlay = document.getElementById('enp-overlay');
    if (!overlay) return;
    overlay.style.animation = 'enp-fade-in 0.25s ease reverse';
    setTimeout(() => overlay.remove(), 240);
    sessionStorage.setItem('mapnexus_event_shown', '1');
  }

  // ===== Slide cards =====
  function goToCard(index, events) {
    const cards = document.querySelectorAll('.enp-card');
    const dots = document.querySelectorAll('.enp-dot');
    cards.forEach((c, i) => c.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  // ===== Init =====
  function init() {
    if (!shouldShow()) return;

    const events = getUpcomingEvents();
    if (events.length === 0) return;

    injectStyles();

    const container = document.createElement('div');
    container.innerHTML = buildPopup(events);
    document.body.appendChild(container.firstElementChild);

    let currentIndex = 0;

    // Close buttons
    document.getElementById('enp-close').addEventListener('click', () => closePopup());
    document.getElementById('enp-close-main').addEventListener('click', () => closePopup());

    // Click overlay to close
    document.getElementById('enp-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'enp-overlay') closePopup();
    });

    // Dots navigation
    document.querySelectorAll('.enp-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        currentIndex = parseInt(dot.dataset.dot);
        goToCard(currentIndex, events);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') { closePopup(false); document.removeEventListener('keydown', handler); }
      if (e.key === 'ArrowRight' && currentIndex < events.length - 1) { currentIndex++; goToCard(currentIndex, events); }
      if (e.key === 'ArrowLeft' && currentIndex > 0) { currentIndex--; goToCard(currentIndex, events); }
    });

    // Swipe support (mobile)
    let touchStartX = 0;
    const modal = document.querySelector('.enp-modal');
    modal.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    modal.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < events.length - 1) { currentIndex++; goToCard(currentIndex, events); }
        if (diff < 0 && currentIndex > 0) { currentIndex--; goToCard(currentIndex, events); }
      }
    }, { passive: true });
  }

  // รอให้ DOM โหลดเสร็จก่อน แล้วค่อยแสดง popup หลัง 1.5 วินาที
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 1500));
  } else {
    setTimeout(init, 1500);
  }

})();
