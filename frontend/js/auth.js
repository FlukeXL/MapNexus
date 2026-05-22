// ===================================
// Authentication System
// Google OAuth + Phone Number Login
// ===================================

// API Base URL
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE'; // จะต้องได้รับจาก Google Cloud Console

// ===================================
// Initialize Google OAuth
// ===================================
function initGoogleAuth() {
    // Load Google Identity Services
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: true
        });
    }
}

// ===================================
// Google OAuth Callback
// ===================================
async function handleGoogleCallback(response) {
    try {
        showLoading(true);
        
        // Send Google credential to backend
        const result = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                credential: response.credential
            })
        });

        const data = await result.json();

        if (data.success) {
            // Save token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showAlert('success', 'เข้าสู่ระบบสำเร็จ!');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showAlert('error', data.message || 'เข้าสู่ระบบด้วย Google ไม่สำเร็จ');
        }
    } catch (error) {
        console.error('Google login error:', error);
        showAlert('error', 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
        showLoading(false);
    }
}

// ===================================
// Google Login Button Handler
// ===================================
function handleGoogleLogin() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.prompt();
    } else {
        showAlert('error', 'Google Sign-In ยังไม่พร้อมใช้งาน กรุณารอสักครู่');
    }
}

// ===================================
// Phone Number Login
// ===================================
async function handlePhoneLogin(event) {
    event.preventDefault();
    
    const phone = document.getElementById('login-phone').value.trim();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Validation
    if (!phone || !password) {
        showAlert('error', 'กรุณากรอกเบอร์โทรศัพท์และรหัสผ่าน');
        return;
    }

    if (phone.length !== 9) {
        showAlert('error', 'เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็น 9 หลัก)');
        return;
    }

    try {
        showLoading(true);

        const fullPhone = '+66' + phone;

        const response = await fetch(`${API_URL}/auth/login-phone`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: fullPhone,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            // Save token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }

            showAlert('success', 'เข้าสู่ระบบสำเร็จ!');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showAlert('error', data.message || 'เข้าสู่ระบบไม่สำเร็จ');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('error', 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
        showLoading(false);
    }
}

// ===================================
// Phone Number Registration
// ===================================
async function handlePhoneRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value.trim();
    const phone = document.getElementById('register-phone').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const acceptTerms = document.getElementById('accept-terms').checked;

    // Validation
    if (!name || !phone || !password || !confirmPassword) {
        showAlert('error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    if (phone.length !== 9) {
        showAlert('error', 'เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็น 9 หลัก)');
        return;
    }

    if (password.length < 8) {
        showAlert('error', 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('error', 'รหัสผ่านไม่ตรงกัน');
        return;
    }

    if (!acceptTerms) {
        showAlert('error', 'กรุณายอมรับเงื่อนไขการใช้งาน');
        return;
    }

    try {
        showLoading(true);

        const fullPhone = '+66' + phone;

        const response = await fetch(`${API_URL}/auth/register-phone`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                full_name: name,
                phone: fullPhone,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            // Save token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            showAlert('success', 'สมัครสมาชิกสำเร็จ!');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showAlert('error', data.message || 'สมัครสมาชิกไม่สำเร็จ');
        }
    } catch (error) {
        console.error('Register error:', error);
        showAlert('error', 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
        showLoading(false);
    }
}

// ===================================
// Forgot Password
// ===================================
async function handleForgotPassword(event) {
    event.preventDefault();
    
    const phone = document.getElementById('forgot-phone').value.trim();

    // Validation
    if (!phone) {
        showAlert('error', 'กรุณากรอกเบอร์โทรศัพท์');
        return;
    }

    if (phone.length !== 9) {
        showAlert('error', 'เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็น 9 หลัก)');
        return;
    }

    try {
        showLoading(true);

        const fullPhone = '+66' + phone;

        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: fullPhone
            })
        });

        const data = await response.json();

        if (data.success) {
            showAlert('success', 'ส่งลิงก์รีเซ็ตรหัสผ่านไปยังเบอร์โทรศัพท์ของคุณแล้ว');
            
            // Show login form after 3 seconds
            setTimeout(() => {
                showForm('login');
            }, 3000);
        } else {
            showAlert('error', data.message || 'ไม่พบเบอร์โทรศัพท์นี้ในระบบ');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        showAlert('error', 'เกิดข้อผิดพลาดในการส่งลิงก์รีเซ็ตรหัสผ่าน');
    } finally {
        showLoading(false);
    }
}

// ===================================
// Form Switching
// ===================================
function showForm(formType) {
    // Hide all forms
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('forgot-password-form').classList.add('hidden');

    // Show selected form
    if (formType === 'login') {
        document.getElementById('login-form').classList.remove('hidden');
    } else if (formType === 'register') {
        document.getElementById('register-form').classList.remove('hidden');
    } else if (formType === 'forgot') {
        document.getElementById('forgot-password-form').classList.remove('hidden');
    }

    // Clear any alerts
    clearAlerts();
}

// ===================================
// Password Visibility Toggle
// ===================================
function togglePasswordVisibility(button) {
    const targetId = button.getAttribute('data-target');
    const input = document.getElementById(targetId);
    const svg = button.querySelector('svg');

    if (input.type === 'password') {
        input.type = 'text';
        svg.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        `;
    } else {
        input.type = 'password';
        svg.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        `;
    }
}

// ===================================
// Loading Overlay
// ===================================
function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

// ===================================
// Alert Messages
// ===================================
function showAlert(type, message) {
    // Remove existing alerts
    clearAlerts();

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    // Insert at the top of the active form
    const activeForm = document.querySelector('.auth-form:not(.hidden)');
    if (activeForm) {
        const formFields = activeForm.querySelector('.auth-form-fields');
        if (formFields) {
            formFields.insertAdjacentElement('beforebegin', alert);
        }
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function clearAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => alert.remove());
}

// ===================================
// Phone Number Input Formatting
// ===================================
function formatPhoneInput(input) {
    // Remove non-numeric characters
    let value = input.value.replace(/\D/g, '');
    
    // Limit to 9 digits
    if (value.length > 9) {
        value = value.substring(0, 9);
    }
    
    input.value = value;
}

// ===================================
// Check if User is Already Logged In
// ===================================
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
        // User is already logged in, redirect to home
        window.location.href = 'index.html';
    }
}

// ===================================
// Initialize on Page Load
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    checkAuthStatus();

    // Initialize Google OAuth
    initGoogleAuth();

    // Form submission handlers
    const loginForm = document.getElementById('login-form-submit');
    if (loginForm) {
        loginForm.addEventListener('submit', handlePhoneLogin);
    }

    const registerForm = document.getElementById('register-form-submit');
    if (registerForm) {
        registerForm.addEventListener('submit', handlePhoneRegister);
    }

    const forgotPasswordForm = document.getElementById('forgot-password-submit');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }

    // Form switching buttons
    document.getElementById('show-register')?.addEventListener('click', (e) => {
        e.preventDefault();
        showForm('register');
    });

    document.getElementById('show-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        showForm('login');
    });

    document.getElementById('show-forgot-password')?.addEventListener('click', (e) => {
        e.preventDefault();
        showForm('forgot');
    });

    document.getElementById('back-to-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        showForm('login');
    });

    // Google login buttons
    document.getElementById('google-login')?.addEventListener('click', handleGoogleLogin);
    document.getElementById('google-register')?.addEventListener('click', handleGoogleLogin);

    // Password visibility toggles
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => togglePasswordVisibility(button));
    });

    // Phone number input formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', () => formatPhoneInput(input));
    });
});

// ===================================
// Load Google Identity Services Script
// ===================================
(function() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
})();
