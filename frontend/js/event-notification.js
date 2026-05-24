// ===================================
// MapNexus — Event Notification Popup
// แสดงกิจกรรมของเมืองเมื่อเข้าหน้าเว็บ
// ===================================

(function () {
  'use strict';

  // แสดงกิจกรรมที่จะมาถึงภายในกี่วัน
  const UPCOMING_DAYS = 60;

  // ===== ตรวจสอบว่าควรแสดงหรือไม่ (แสดงแค่ครั้งแรกครั้งเดียว) =====
  function shouldShow() {
    return !localStorage.getItem('mapnexus_event_popup_shown');
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
            <button type="button" class="enp-close" id="enp-close" aria-label="ปิด">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
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
            <button type="button" class="enp-btn-dismiss" id="enp-dismiss">
              ไม่แสดงอีก
            </button>
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
        background: rgba(0,0,0,0.65);
        backdrop-filter: blur(6px);
        display: flex; align-items: center; justify-content: center;
        padding: 1rem;
        animation: enp-fade-in 0.35s ease;
      }
      @keyframes enp-fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .enp-modal {
        background: #fff;
        border-radius: 28px;
        width: 100%; max-width: 460px;
        max-height: 90vh;
        display: flex; flex-direction: column;
        box-shadow: 0 24px 64px rgba(0,0,0,0.3);
        animation: enp-slide-up 0.35s cubic-bezier(0.34,1.56,0.64,1);
        margin-top: 50px;
        position: relative;
        overflow: visible;
      }
      /* clip เฉพาะ content ข้างใน ไม่ให้ล้นขอบ modal */
      .enp-modal > *:not(.enp-logo-center-wrap) {
        overflow: hidden;
      }
      /* ทำให้มุมโค้งของ header ทำงานได้ */
      .enp-header {
        overflow: hidden;
      }
      /* ทำให้มุมล่างของ footer โค้งด้วย */
      .enp-footer {
        border-radius: 0 0 28px 28px;
        overflow: hidden;
      }
      /* ส่วนที่ scroll ได้ต้องซ่อน overflow เฉพาะ content */
      .enp-cards-wrap {
        overflow-y: auto;
        overflow-x: hidden;
      }
      @keyframes enp-slide-up {
        from { transform: translateY(40px) scale(0.96); opacity: 0; }
        to   { transform: translateY(0) scale(1); opacity: 1; }
      }

      /* Header */
      .enp-header {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        padding: 0 1.25rem 0.6rem;
        padding-top: 2.25rem;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        position: relative;
        flex-shrink: 0;
        border-radius: 28px 28px 28px 28px;
      }
      .enp-logo-center-wrap {
        position: absolute;
        top: 0; left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
      }
      .enp-logo-circle {
        width: 100px; height: 100px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 0 0 4px rgba(212,175,55,0.4);
        display: flex; align-items: center; justify-content: center;
        overflow: hidden;
        border: 3px solid rgba(212,175,55,0.6);
      }
      .enp-logo-img {
        width: 88px; height: 88px;
        object-fit: contain;
      }
      .enp-logo-fallback {
        width: 88px; height: 88px;
        background: linear-gradient(135deg, #b8941e, #d4af37);
        display: flex; align-items: center; justify-content: center;
        font-family: 'Noto Serif Thai', serif;
        font-size: 2.5rem; font-weight: 700; color: #1a1a1a;
        border-radius: 50%;
      }
      .enp-close {
        background: rgba(255,255,255,0.1); border: none; border-radius: 8px;
        width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
        cursor: pointer; color: rgba(255,255,255,0.7); transition: all 0.2s;
        flex-shrink: 0;
      }
      .enp-close:hover { background: rgba(255,255,255,0.2); color: #fff; }

      /* Title bar */
      .enp-title-bar {
        display: flex; align-items: center; gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        background: #faf9f6; border-bottom: 1px solid #e8e6e1;
        font-size: 0.82rem; font-weight: 600; color: #555;
        flex-shrink: 0;
      }
      .enp-title-bar svg { color: #d4af37; flex-shrink: 0; }
      .enp-count {
        margin-left: auto;
        background: linear-gradient(135deg, #b8941e, #d4af37);
        color: #fff; font-size: 0.68rem; font-weight: 700;
        padding: 0.15rem 0.55rem; border-radius: 20px;
      }

      /* Cards */
      .enp-cards-wrap {
        flex: 1; overflow: hidden; position: relative;
        min-height: 0;
      }
      .enp-card {
        display: none; padding: 1.25rem;
        overflow-y: auto; max-height: 100%;
      }
      .enp-card.active { display: block; animation: enp-card-in 0.25s ease; }
      @keyframes enp-card-in {
        from { opacity: 0; transform: translateX(12px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      /* Card type badge */
      .enp-card-type {
        display: inline-flex; align-items: center; gap: 0.35rem;
        font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.65rem;
        border-radius: 20px; margin-bottom: 0.65rem;
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
        font-size: 1.2rem; font-weight: 700; color: #1a1a1a;
        margin-bottom: 0.2rem; line-height: 1.3;
      }
      .enp-card-subtitle {
        font-size: 0.78rem; color: #888; margin-bottom: 0.85rem;
      }

      /* Meta */
      .enp-card-meta { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.85rem; }
      .enp-meta-row {
        display: flex; align-items: center; gap: 0.4rem;
        font-size: 0.78rem; color: #555;
      }
      .enp-meta-row svg { color: #d4af37; flex-shrink: 0; }
      .enp-badge-days {
        margin-left: auto; font-size: 0.7rem; font-weight: 700;
        background: #fff8e1; color: #b8941e;
        padding: 0.1rem 0.5rem; border-radius: 20px;
        border: 1px solid rgba(212,175,55,0.3);
        white-space: nowrap;
      }

      .enp-card-desc {
        font-size: 0.8rem; color: #666; line-height: 1.6;
        margin-bottom: 0.75rem;
      }
      .enp-card-highlight {
        font-size: 0.72rem; color: #b8941e; font-weight: 600;
        background: #fffbf0; border-left: 3px solid #d4af37;
        padding: 0.4rem 0.65rem; border-radius: 0 6px 6px 0;
        margin-bottom: 0.85rem;
      }
      .enp-card-footer {
        display: flex; align-items: center; justify-content: space-between;
        gap: 0.5rem;
      }
      .enp-price {
        font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.65rem;
        border-radius: 20px;
      }
      .enp-price.free { background: #e8f5e9; color: #2e7d32; }
      .enp-price.paid { background: #fff3e0; color: #e65100; }
      .enp-btn-detail {
        font-size: 0.75rem; font-weight: 700; color: #b8941e;
        text-decoration: none; padding: 0.3rem 0.75rem;
        border: 1.5px solid rgba(212,175,55,0.4); border-radius: 20px;
        transition: all 0.2s;
      }
      .enp-btn-detail:hover { background: #d4af37; color: #fff; border-color: #d4af37; }

      /* Dots */
      .enp-dots {
        display: flex; justify-content: center; gap: 0.4rem;
        padding: 0.6rem 0; flex-shrink: 0;
        border-top: 1px solid #f0ede8;
      }
      .enp-dot {
        width: 8px; height: 8px; border-radius: 50%;
        background: #e8e6e1; border: none; cursor: pointer;
        transition: all 0.2s; padding: 0;
      }
      .enp-dot.active { background: #d4af37; width: 22px; border-radius: 4px; }

      /* Footer */
      .enp-footer {
        display: flex; gap: 0.5rem; padding: 0.85rem 1.25rem;
        border-top: 1px solid #e8e6e1; flex-shrink: 0;
        background: #faf9f6;
      }
      .enp-btn-dismiss {
        flex: 1; padding: 0.55rem; border: 1.5px solid #e8e6e1;
        border-radius: 8px; background: #fff; color: #999;
        font-family: inherit; font-size: 0.75rem; cursor: pointer;
        transition: all 0.2s;
      }
      .enp-btn-dismiss:hover { border-color: #ccc; color: #666; }
      .enp-btn-close-main {
        flex: 1; padding: 0.55rem;
        background: linear-gradient(135deg, #1a1a1a, #333);
        color: #fff; border: none; border-radius: 8px;
        font-family: inherit; font-size: 0.8rem; font-weight: 600;
        cursor: pointer; transition: all 0.2s;
      }
      .enp-btn-close-main:hover { background: linear-gradient(135deg, #333, #555); }

      @media (max-width: 480px) {
        .enp-modal { border-radius: 16px 16px 0 0; max-height: 95vh; }
        .enp-overlay { align-items: flex-end; padding: 0; }
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ===== ปิด popup =====
  function closePopup(saveTimestamp) {
    const overlay = document.getElementById('enp-overlay');
    if (!overlay) return;
    overlay.style.animation = 'enp-fade-in 0.25s ease reverse';
    setTimeout(() => overlay.remove(), 240);
    if (saveTimestamp) {
      localStorage.setItem('mapnexus_event_popup_shown', Date.now().toString());
    }
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
    document.getElementById('enp-close').addEventListener('click', () => closePopup(false));
    document.getElementById('enp-close-main').addEventListener('click', () => closePopup(false));
    document.getElementById('enp-dismiss').addEventListener('click', () => closePopup(true));

    // Click overlay to close
    document.getElementById('enp-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'enp-overlay') closePopup(false);
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
