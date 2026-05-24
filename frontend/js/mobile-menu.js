// ===== MapNexus — Mobile Menu + Bottom Nav =====
(function () {
  'use strict';

  // ===== Hamburger Menu =====
  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu   = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    function injectMobileAuth() {
      if (menu.querySelector('.nav-menu-mobile-auth')) return;
      const authDiv = document.createElement('div');
      authDiv.className = 'nav-menu-mobile-auth';
      const navActions = document.getElementById('nav-actions');
      if (navActions && navActions.innerHTML.trim()) {
        authDiv.innerHTML = navActions.innerHTML;
      } else {
        authDiv.innerHTML = `
          <a href="login.html?tab=register" class="btn-register">สมัครบัญชี</a>
          <a href="login.html" class="btn-secondary">เข้าสู่ระบบ</a>
        `;
      }
      menu.appendChild(authDiv);
    }

    function openMenu() {
      menu.classList.add('mobile-open');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      injectMobileAuth();
    }

    function closeMenu() {
      menu.classList.remove('mobile-open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      menu.classList.contains('mobile-open') ? closeMenu() : openMenu();
    });

    menu.addEventListener('click', function (e) {
      if (e.target.classList.contains('nav-link')) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // ===== Bottom Navigation =====
    injectBottomNav();
    updateBottomNavWeather();

    // ===== Fixed Status Widget (ทุกหน้า) =====
    injectFixedStatusWidget();
    setTimeout(fetchAllStatusData, 1000);
  });

  // ===== สร้าง Bottom Nav =====
  function injectBottomNav() {
    if (document.querySelector('.mobile-bottom-nav')) return;

    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    function isActive(p) {
      if (p === 'index.html' && (page === 'index.html' || page === '')) return 'active';
      if (p !== 'index.html' && page === p) return 'active';
      return '';
    }

    const nav = document.createElement('nav');
    nav.className = 'mobile-bottom-nav';
    nav.setAttribute('aria-label', 'เมนูหลัก');
    nav.innerHTML = `
      <div class="mobile-bottom-nav-items">

        <!-- นำเที่ยว -->
        <a href="explore.html" class="mobile-nav-item ${isActive('explore.html')}" aria-label="นำเที่ยว">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
          </svg>
          <span class="mobile-nav-label">นำเที่ยว</span>
        </a>

        <!-- เช็คอิน -->
        <a href="checkin.html" class="mobile-nav-item ${isActive('checkin.html')}" aria-label="เช็คอิน">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span class="mobile-nav-label">เช็คอิน</span>
        </a>

        <!-- Logo วงกลม — หน้าหลัก (กลาง) -->
        <a href="index.html" class="mobile-nav-item mobile-nav-logo-btn ${isActive('index.html')}" aria-label="หน้าหลัก">
          <div class="mobile-nav-logo-circle">
            <img src="assets/images/Logo.png" alt="MapNexus"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="mobile-nav-logo-fallback" style="display:none">M</div>
          </div>
        </a>

        <!-- อากาศ -->
        <a href="weather.html" class="mobile-nav-item ${isActive('weather.html')}" aria-label="พยากรณ์อากาศ">
          <div class="mobile-nav-weather">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:22px;height:22px">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
            </svg>
            <span class="mobile-nav-weather-val" id="bnav-pm25">--</span>
            <span class="mobile-nav-weather-label">PM2.5</span>
          </div>
        </a>

        <!-- เข้าสู่ระบบ / โปรไฟล์ -->
        <div class="mobile-nav-item mobile-nav-auth" id="bnav-auth" aria-label="บัญชีของฉัน">
          <div class="bnav-auth-icon" id="bnav-auth-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <span class="mobile-nav-label" id="bnav-auth-label">เข้าสู่ระบบ</span>
        </div>

      </div>
    `;

    document.body.appendChild(nav);

    // ผูก event กับปุ่ม auth
    setupBnavAuth();
  }

  // ===== Setup Bottom Nav Auth Button =====
  function setupBnavAuth() {
    const bnavAuth = document.getElementById('bnav-auth');
    if (!bnavAuth) return;

    // ตรวจสอบ login state จาก localStorage
    const uid = localStorage.getItem('uid');
    const email = localStorage.getItem('email');

    if (uid && email) {
      // Login แล้ว — แสดง avatar
      updateBnavToProfile(email);
    } else {
      // ยังไม่ login — ไปหน้า login
      bnavAuth.style.cursor = 'pointer';
      bnavAuth.addEventListener('click', () => {
        window.location.href = 'login.html';
      });
    }
  }

  // อัปเดต bottom nav เป็น profile
  function updateBnavToProfile(email) {
    const icon = document.getElementById('bnav-auth-icon');
    const label = document.getElementById('bnav-auth-label');
    const btn = document.getElementById('bnav-auth');
    if (!icon || !label || !btn) return;

    const name = email.split('@')[0];
    const shortName = name.length > 6 ? name.substring(0, 6) + '…' : name;

    // เปลี่ยน icon เป็น avatar ทอง
    icon.innerHTML = `
      <div class="bnav-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span class="bnav-online-dot"></span>
      </div>
    `;
    label.textContent = shortName;
    label.style.color = '#d4af37';

    // สร้าง popup ถ้ายังไม่มี
    if (!document.getElementById('bnav-profile-popup')) {
      createBnavProfilePopup(email, name);
    }

    // ผูก event กดปุ่ม
    btn.style.cursor = 'pointer';
    // ลบ event เก่าก่อน (clone)
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    document.getElementById('bnav-auth').addEventListener('click', (e) => {
      e.stopPropagation();
      const popup = document.getElementById('bnav-profile-popup');
      if (!popup) return;
      const isOpen = popup.classList.contains('open');
      popup.classList.toggle('open', !isOpen);
    });

    // ปิดเมื่อคลิกที่อื่น
    document.addEventListener('click', (e) => {
      const popup = document.getElementById('bnav-profile-popup');
      const authBtn = document.getElementById('bnav-auth');
      if (popup && authBtn && !authBtn.contains(e.target) && !popup.contains(e.target)) {
        popup.classList.remove('open');
      }
    });
  }

  // สร้าง Profile Popup สำหรับ Bottom Nav
  function createBnavProfilePopup(email, name) {
    const popup = document.createElement('div');
    popup.id = 'bnav-profile-popup';
    popup.innerHTML = `
      <div class="bnav-pp-header">
        <div class="bnav-pp-avatar-wrap">
          <div class="bnav-pp-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>
        <div class="bnav-pp-info">
          <div class="bnav-pp-name">${name}</div>
          <div class="bnav-pp-email">${email}</div>
          <span class="bnav-pp-rank">🥉 Bronze Member</span>
        </div>
        <button type="button" class="bnav-pp-close" id="bnav-pp-close" aria-label="ปิด">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="bnav-pp-divider"></div>
      <div class="bnav-pp-body">
        <div class="bnav-pp-row">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <span class="bnav-pp-row-label">อีเมล</span>
          <span class="bnav-pp-row-val">${email}</span>
        </div>
        <div class="bnav-pp-row">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span class="bnav-pp-row-label">สมาชิก</span>
          <span class="bnav-pp-row-val">Free</span>
        </div>
        <a href="login.html?tab=forgot" class="bnav-pp-row bnav-pp-link">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span class="bnav-pp-row-label">รหัสผ่าน</span>
          <span class="bnav-pp-row-val bnav-pp-reset">รีเซ็ตรหัสผ่าน</span>
        </a>
      </div>
      <div class="bnav-pp-divider"></div>
      <button type="button" class="bnav-pp-logout" id="bnav-pp-logout">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        ออกจากระบบ
      </button>
    `;

    document.body.appendChild(popup);

    // ปุ่มปิด
    document.getElementById('bnav-pp-close').addEventListener('click', (e) => {
      e.stopPropagation();
      popup.classList.remove('open');
    });

    // ปุ่ม logout
    document.getElementById('bnav-pp-logout').addEventListener('click', async () => {
      try {
        // ลอง signOut Firebase ถ้ามี
        if (window._firebaseAuth) {
          const { signOut } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
          await signOut(window._firebaseAuth);
        }
      } catch(e) {}
      localStorage.removeItem('uid');
      localStorage.removeItem('email');
      localStorage.removeItem('user');
      location.reload();
    });
  }

  // expose สำหรับ auth-state.js เรียกใช้
  window.updateBnavToProfile = updateBnavToProfile;

  // ===== Fixed Status Widget — ลอยค้างทุกหน้า =====
  function injectFixedStatusWidget() {
    if (document.getElementById('fixed-status-widget')) return;

    const widget = document.createElement('div');
    widget.id = 'fixed-status-widget';
    widget.innerHTML = `
      <a href="weather.html" class="fsw-item" id="fsw-pm25-wrap">
        <div class="fsw-icon fsw-pm25">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>
        <div class="fsw-info">
          <span class="fsw-label">PM2.5</span>
          <span class="fsw-value" id="fsw-pm25">--</span>
        </div>
        <span class="fsw-dot" id="fsw-pm25-dot"></span>
      </a>
      <div class="fsw-sep"></div>
      <a href="weather.html" class="fsw-item">
        <div class="fsw-icon fsw-weather">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          </svg>
        </div>
        <div class="fsw-info">
          <span class="fsw-label">อากาศ</span>
          <span class="fsw-value" id="fsw-temp">--°C</span>
        </div>
      </a>
      <div class="fsw-sep"></div>
      <a href="weather.html" class="fsw-item">
        <div class="fsw-icon fsw-storm">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/>
            <polyline points="13 11 9 17 15 17 11 23"/>
          </svg>
        </div>
        <div class="fsw-info">
          <span class="fsw-label">พายุ</span>
          <span class="fsw-value" id="fsw-storm">--</span>
        </div>
      </a>
      <div class="fsw-sep"></div>
      <a href="weather.html" class="fsw-item">
        <div class="fsw-icon fsw-traffic">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
            <circle cx="7" cy="17" r="2"/><circle cx="13" cy="17" r="2"/>
          </svg>
        </div>
        <div class="fsw-info">
          <span class="fsw-label">จราจร</span>
          <span class="fsw-value" id="fsw-traffic">--</span>
        </div>
      </a>
    `;

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
      #fixed-status-widget {
        display: none;
      }
      @media (max-width: 768px) {
        #fixed-status-widget {
          display: flex;
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: calc(72px + env(safe-area-inset-bottom));
          z-index: 998;
          background: rgba(12, 12, 12, 0.78);
          -webkit-backdrop-filter: blur(14px);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(212,175,55,0.18);
          border-radius: 50px;
          padding: 0.35rem 0.6rem;
          gap: 0;
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          max-width: calc(100vw - 2rem);
          align-items: center;
        }

        .fsw-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.18rem 0.5rem;
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
        }

        .fsw-icon {
          width: 20px; height: 20px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .fsw-pm25   { background: rgba(255,193,7,0.15); color: #ffc107; }
        .fsw-weather{ background: rgba(33,150,243,0.15); color: #64b5f6; }
        .fsw-storm  { background: rgba(156,39,176,0.15); color: #ce93d8; }
        .fsw-traffic{ background: rgba(76,175,80,0.15);  color: #81c784; }

        .fsw-info {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .fsw-label {
          font-size: 0.46rem;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: 'Noto Sans Thai', sans-serif;
        }

        .fsw-value {
          font-size: 0.68rem;
          font-weight: 700;
          color: #fff;
          font-family: 'Noto Sans Thai', sans-serif;
        }

        .fsw-sep {
          width: 1px; height: 20px;
          background: rgba(255,255,255,0.1);
          flex-shrink: 0;
        }

        .fsw-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #4caf50;
          flex-shrink: 0;
          align-self: flex-start;
          margin-top: 0.1rem;
        }

        .fsw-dot.moderate { background: #ffc107; }
        .fsw-dot.unhealthy { background: #f44336; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(widget);
  }

  // ===== ดึงข้อมูลจริงทั้งหมด =====
  function fetchAllStatusData() {
    const WAQI_TOKEN = 'b43f5d3e29f96181a99f3eb796951a6db702a306';
    const OWM_KEY    = '88474214df0769fa95ff82dc52946122';

    // PM2.5 จาก WAQI
    fetch(`https://api.waqi.info/feed/@13630/?token=${WAQI_TOKEN}`)
      .then(r => r.json())
      .then(data => {
        if (data.status !== 'ok') return;
        const pm25 = data.data.iaqi?.pm25?.v || data.data.aqi;
        const temp = data.data.iaqi?.t?.v;
        const aqi  = parseInt(data.data.aqi);

        // อัปเดต Fixed Widget
        const pm25El = document.getElementById('fsw-pm25');
        const dot    = document.getElementById('fsw-pm25-dot');
        const tempEl = document.getElementById('fsw-temp');

        if (pm25El) pm25El.textContent = pm25 + ' µg/m³';
        if (dot) {
          dot.className = 'fsw-dot' + (aqi > 100 ? ' unhealthy' : aqi > 50 ? ' moderate' : '');
        }
        if (tempEl && temp) tempEl.textContent = Math.round(temp) + '°C';

        // อัปเดต Bottom Nav PM2.5
        const bnavPm25 = document.getElementById('bnav-pm25');
        if (bnavPm25) bnavPm25.textContent = pm25;
      })
      .catch(() => {});

    // อากาศ + พายุ จาก OpenWeatherMap
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=17.4081&lon=104.7695&appid=${OWM_KEY}&units=metric&lang=th`)
      .then(r => r.json())
      .then(data => {
        const temp    = data.main?.temp;
        const weather = data.weather?.[0]?.main;

        const tempEl   = document.getElementById('fsw-temp');
        const stormEl  = document.getElementById('fsw-storm');
        const trafficEl= document.getElementById('fsw-traffic');

        if (tempEl && temp) tempEl.textContent = Math.round(temp) + '°C';

        if (stormEl) {
          const isStorm = ['Thunderstorm', 'Tornado'].includes(weather);
          stormEl.textContent = isStorm ? '⚠️ มี' : 'ไม่มี';
          if (isStorm) stormEl.style.color = '#ffc107';
        }

        // จราจร simulated
        if (trafficEl) {
          const opts = ['ราบรื่น', 'ปานกลาง'];
          trafficEl.textContent = opts[Math.floor(Math.random() * opts.length)];
        }
      })
      .catch(() => {});

    // รีเฟรชทุก 5 นาที
    setTimeout(fetchAllStatusData, 5 * 60 * 1000);
  }
  function updateBottomNavWeather() {
    // รอให้ info-bar-header โหลดข้อมูลก่อน แล้วค่อย sync
    let attempts = 0;
    const interval = setInterval(function () {
      attempts++;
      const pm25El = document.getElementById('header-pm25');
      const bnavPm25 = document.getElementById('bnav-pm25');

      if (pm25El && bnavPm25) {
        const val = pm25El.textContent;
        if (val && val !== '--' && val !== '32') {
          bnavPm25.textContent = val;
          clearInterval(interval);
          return;
        }
      }

      // fallback: ดึงจาก WAQI โดยตรง
      if (attempts === 5) {
        fetchPM25Direct();
        clearInterval(interval);
      }
    }, 1000);
  }

  function fetchPM25Direct() {
    const TOKEN = 'b43f5d3e29f96181a99f3eb796951a6db702a306';
    fetch(`https://api.waqi.info/feed/@13630/?token=${TOKEN}`)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'ok') {
          const pm25 = data.data.iaqi?.pm25?.v || data.data.aqi;
          const temp = data.data.iaqi?.t?.v;
          const el = document.getElementById('bnav-pm25');
          if (el) el.textContent = pm25;

          // อัปเดต Status Widget ด้วย
          updateStatusWidget(pm25, temp, null);
        }
      })
      .catch(() => {});
  }

  // ===== อัปเดต Hero Status Widget =====
  function updateStatusWidget(pm25, temp, weather) {
    const pm25El = document.getElementById('hsw-pm25');
    const tempEl = document.getElementById('hsw-temp');
    const dot    = document.getElementById('hsw-pm25-dot');

    if (pm25El && pm25) {
      pm25El.textContent = pm25 + ' µg/m³';
      // สี dot ตาม AQI
      if (dot) {
        dot.className = 'hsw-dot' + (pm25 > 100 ? ' unhealthy' : pm25 > 50 ? ' moderate' : '');
      }
    }
    if (tempEl && temp) {
      tempEl.textContent = Math.round(temp) + '°C';
    }
  }

  // ดึงข้อมูลอากาศสำหรับ widget
  function fetchWeatherForWidget() {
    const API_KEY = '88474214df0769fa95ff82dc52946122';
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=17.4081&lon=104.7695&appid=${API_KEY}&units=metric&lang=th`)
      .then(r => r.json())
      .then(data => {
        const temp = data.main?.temp;
        const weather = data.weather?.[0]?.main;
        const tempEl = document.getElementById('hsw-temp');
        const stormEl = document.getElementById('hsw-storm');
        const trafficEl = document.getElementById('hsw-traffic');

        if (tempEl && temp) tempEl.textContent = Math.round(temp) + '°C';
        if (stormEl) {
          const isStorm = ['Thunderstorm', 'Tornado'].includes(weather);
          stormEl.textContent = isStorm ? '⚠️ มี' : 'ไม่มี';
          if (isStorm) stormEl.style.color = '#ffc107';
        }
        if (trafficEl) {
          // traffic ยังเป็น simulated
          const statuses = ['ราบรื่น', 'ปานกลาง'];
          trafficEl.textContent = statuses[Math.floor(Math.random() * statuses.length)];
        }
      })
      .catch(() => {});
  }

})();
