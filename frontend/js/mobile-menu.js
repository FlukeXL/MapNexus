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

        <!-- หน้าหลัก -->
        <a href="index.html" class="mobile-nav-item ${isActive('index.html')}" aria-label="หน้าหลัก">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span class="mobile-nav-label">หน้าหลัก</span>
        </a>

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

        <!-- อากาศ + ค่าฝุ่น -->
        <a href="weather.html" class="mobile-nav-item ${isActive('weather.html')}" aria-label="พยากรณ์อากาศ">
          <div class="mobile-nav-weather">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:22px;height:22px">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
            </svg>
            <span class="mobile-nav-weather-val" id="bnav-pm25">--</span>
            <span class="mobile-nav-weather-label">PM2.5</span>
          </div>
        </a>

      </div>
    `;

    document.body.appendChild(nav);
  }

  // ===== อัปเดตค่า PM2.5 ใน bottom nav =====
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
          const el = document.getElementById('bnav-pm25');
          if (el) el.textContent = pm25;
        }
      })
      .catch(() => {});
  }

})();
