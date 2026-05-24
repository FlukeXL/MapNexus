// ===== MapNexus — Mobile Hamburger Menu =====
(function () {
  'use strict';

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

    // ปิดเมื่อคลิก nav link
    menu.addEventListener('click', function (e) {
      if (e.target.classList.contains('nav-link')) closeMenu();
    });

    // ปิดเมื่อกด Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  });
})();
