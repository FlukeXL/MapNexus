// ===================================
// Firebase Auth State Manager
// จัดการสถานะ login ทุกหน้า
// ===================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDCdMOAgVcc2tZ1sPIwciW6H9kXK_THIx4",
  authDomain: "mapnexus-bd253.firebaseapp.com",
  projectId: "mapnexus-bd253",
  storageBucket: "mapnexus-bd253.firebasestorage.app",
  messagingSenderId: "271134269190",
  appId: "1:271134269190:web:1a68b3658f9a845e4d0887"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ตรวจสอบสถานะ login แล้วอัปเดต navbar
onAuthStateChanged(auth, (user) => {
  const navActions = document.getElementById('nav-actions');
  const mobileAuthBtn = document.getElementById('mobile-auth-btn');

  if (user) {
    const email = user.email || '';
    const displayName = user.displayName || email.split('@')[0];
    const photoURL = user.photoURL || null;

    // ===== Desktop navbar =====
    if (navActions) {
      navActions.innerHTML = `
        <div class="user-menu-wrap">
          <button type="button" class="user-avatar-btn" id="user-avatar-btn" aria-label="โปรไฟล์">
            ${photoURL
              ? `<img src="${photoURL}" alt="avatar" class="user-avatar-img">`
              : `<div class="user-avatar-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                 </div>`
            }
            <span class="user-display-name">${displayName}</span>
          </button>
          <div class="profile-popup" id="profile-popup" style="display:none">
            <div class="profile-popup-header">
              ${photoURL
                ? `<img src="${photoURL}" alt="avatar" class="profile-popup-avatar">`
                : `<div class="profile-popup-avatar-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                   </div>`
              }
              <div class="profile-popup-info">
                <div class="profile-popup-name">${displayName}</div>
                <div class="profile-popup-email">${email}</div>
                <span class="profile-popup-badge">Free</span>
              </div>
            </div>
            <div class="profile-popup-divider"></div>
            <div class="profile-popup-body">
              <div class="profile-popup-row">
                <span class="profile-popup-label">อีเมล</span>
                <span class="profile-popup-value">${email}</span>
              </div>
              <div class="profile-popup-row">
                <span class="profile-popup-label">รหัสผ่าน</span>
                <span class="profile-popup-value">
                  <a href="login.html?tab=forgot" class="profile-reset-link">รีเซ็ตรหัสผ่าน</a>
                </span>
              </div>
              <div class="profile-popup-row">
                <span class="profile-popup-label">สมาชิก</span>
                <span class="profile-popup-value">Free</span>
              </div>
            </div>
            <div class="profile-popup-divider"></div>
            <button type="button" class="profile-logout-btn" id="logout-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              ออกจากระบบ
            </button>
          </div>
        </div>
      `;

      document.getElementById('user-avatar-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const popup = document.getElementById('profile-popup');
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
      });

      document.addEventListener('click', () => {
        const popup = document.getElementById('profile-popup');
        if (popup) popup.style.display = 'none';
      });

      document.getElementById('logout-btn').addEventListener('click', async () => {
        await signOut(auth);
        localStorage.removeItem('uid');
        localStorage.removeItem('email');
        localStorage.removeItem('user');
        location.reload();
      });
    }

    // ===== Mobile navbar button =====
    if (mobileAuthBtn) {
      mobileAuthBtn.innerHTML = `
        <button type="button" class="mobile-user-btn" id="mobile-user-btn" aria-label="โปรไฟล์">
          ${photoURL
            ? `<div class="mobile-login-btn-circle"><img src="${photoURL}" alt="avatar" class="mobile-user-avatar"></div>`
            : `<div class="mobile-login-btn-circle">
                <img src="assets/images/Logo.png" alt="MapNexus" class="mobile-logo-circle"
                     onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                <div class="mobile-logo-fallback" style="display:none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
               </div>`
          }
          <span class="mobile-login-label">${displayName.length > 8 ? displayName.substring(0,8)+'…' : displayName}</span>
          <span class="mobile-user-dot"></span>
        </button>

        <!-- Mobile Profile Popup -->
        <div class="mobile-profile-popup" id="mobile-profile-popup" style="display:none">
          <div class="mpp-header">
            ${photoURL
              ? `<img src="${photoURL}" alt="avatar" class="mpp-avatar">`
              : `<div class="mpp-avatar-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                 </div>`
            }
            <div class="mpp-info">
              <div class="mpp-name">${displayName}</div>
              <div class="mpp-email">${email}</div>
              <span class="mpp-badge">✦ Free Member</span>
            </div>
          </div>
          <div class="mpp-divider"></div>
          <div class="mpp-body">
            <div class="mpp-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>${email}</span>
            </div>
            <a href="login.html?tab=forgot" class="mpp-row mpp-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span>รีเซ็ตรหัสผ่าน</span>
            </a>
          </div>
          <div class="mpp-divider"></div>
          <button type="button" class="mpp-logout" id="mobile-logout-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            ออกจากระบบ
          </button>
        </div>
      `;

      document.getElementById('mobile-user-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const popup = document.getElementById('mobile-profile-popup');
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
      });

      document.addEventListener('click', (e) => {
        const popup = document.getElementById('mobile-profile-popup');
        if (popup && !mobileAuthBtn.contains(e.target)) popup.style.display = 'none';
      });

      document.getElementById('mobile-logout-btn').addEventListener('click', async () => {
        await signOut(auth);
        localStorage.removeItem('uid');
        localStorage.removeItem('email');
        localStorage.removeItem('user');
        location.reload();
      });
    }

    // อัปเดต bottom nav auth button
    if (typeof window.updateBnavToProfile === 'function') {
      window.updateBnavToProfile(email);
    } else {
      // รอให้ mobile-menu.js โหลดก่อน
      setTimeout(() => {
        if (typeof window.updateBnavToProfile === 'function') {
          window.updateBnavToProfile(email);
        }
      }, 500);
    }

  } else {
    // ===== ยังไม่ login =====
    if (navActions) {
      navActions.innerHTML = `
        <a href="login.html?tab=register" class="btn-register">สมัครบัญชี</a>
        <a href="login.html" class="btn-secondary">เข้าสู่ระบบ</a>
      `;
    }

    if (mobileAuthBtn) {
      mobileAuthBtn.innerHTML = `
        <a href="login.html" class="mobile-login-btn" aria-label="เข้าสู่ระบบ">
          <img src="assets/images/Logo.png" alt="MapNexus" class="mobile-logo-circle"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="mobile-logo-fallback" style="display:none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </a>
      `;
    }
  }
});
