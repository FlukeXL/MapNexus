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
  if (!navActions) return;

  if (user) {
    // --- Login แล้ว: แสดง icon รูปคน + ชื่อ ---
    const email = user.email || '';
    const displayName = user.displayName || email.split('@')[0];
    const photoURL = user.photoURL || null;

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

        <!-- Profile Popup -->
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

    // Toggle popup
    document.getElementById('user-avatar-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const popup = document.getElementById('profile-popup');
      popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    });

    // ปิด popup เมื่อคลิกที่อื่น
    document.addEventListener('click', () => {
      const popup = document.getElementById('profile-popup');
      if (popup) popup.style.display = 'none';
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
      await signOut(auth);
      localStorage.removeItem('uid');
      localStorage.removeItem('email');
      localStorage.removeItem('user');
      location.reload();
    });

  } else {
    // --- ยังไม่ login: แสดงปุ่มสมัคร/เข้าสู่ระบบ ---
    navActions.innerHTML = `
      <a href="login.html?tab=register" class="btn-register">สมัครบัญชี</a>
      <a href="login.html" class="btn-secondary">เข้าสู่ระบบ</a>
    `;
  }
});
