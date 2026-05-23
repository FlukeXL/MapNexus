// ========================================
// Check-in Page JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- Location Search ----
    const locationInput = document.getElementById('location-input');
    const suggestions = document.getElementById('location-suggestions');

    if (locationInput && suggestions) {
        locationInput.addEventListener('focus', () => {
            suggestions.classList.add('open');
        });

        locationInput.addEventListener('input', () => {
            const val = locationInput.value.toLowerCase();
            const items = suggestions.querySelectorAll('.ci-suggestion-item');
            let hasVisible = false;
            items.forEach(item => {
                const match = item.textContent.toLowerCase().includes(val);
                item.style.display = match ? '' : 'none';
                if (match) hasVisible = true;
            });
            suggestions.classList.toggle('open', hasVisible || val === '');
        });

        suggestions.querySelectorAll('.ci-suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                locationInput.value = item.dataset.place || item.textContent.trim();
                suggestions.classList.remove('open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!locationInput.contains(e.target) && !suggestions.contains(e.target)) {
                suggestions.classList.remove('open');
            }
        });
    }

    // ---- Photo Upload Preview ----
    const photoUpload = document.getElementById('photo-upload');
    const photoPreview = document.getElementById('photo-preview');

    if (photoUpload && photoPreview) {
        photoUpload.addEventListener('change', () => {
            photoPreview.innerHTML = '';
            Array.from(photoUpload.files).slice(0, 6).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = file.name;
                    photoPreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        });
    }

    // ---- Caption Counter ----
    const captionInput = document.getElementById('caption-input');
    const captionCount = document.getElementById('caption-count');

    if (captionInput && captionCount) {
        captionInput.addEventListener('input', () => {
            captionCount.textContent = captionInput.value.length;
        });
    }

    // ---- Star Rating ----
    const stars = document.querySelectorAll('.ci-star');
    let currentRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            currentRating = parseInt(star.dataset.rating);
            updateStars(currentRating);
        });

        star.addEventListener('mouseenter', () => {
            updateStars(parseInt(star.dataset.rating));
        });

        star.addEventListener('mouseleave', () => {
            updateStars(currentRating);
        });
    });

    function updateStars(rating) {
        stars.forEach(s => {
            const r = parseInt(s.dataset.rating);
            s.classList.toggle('active', r <= rating);
        });
    }

    // ---- Tags ----
    const tagsWrap = document.getElementById('tags-wrap');
    const tagInput = document.getElementById('tag-input');

    if (tagInput && tagsWrap) {
        // กด Enter เพิ่มแท็ก
        tagInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addTag(tagInput.value.trim().replace(/^#/, ''));
                tagInput.value = '';
            }
        });

        // ลบแท็กเมื่อกด ×
        tagsWrap.addEventListener('click', (e) => {
            if (e.target.classList.contains('ci-tag-remove')) {
                e.target.closest('.ci-tag').remove();
            }
        });

        // กด tag suggestion
        document.querySelectorAll('.ci-tag-suggest').forEach(btn => {
            btn.addEventListener('click', () => {
                addTag(btn.textContent.replace(/^#/, '').trim());
            });
        });
    }

    function addTag(text) {
        if (!text || !tagsWrap) return;
        const tag = document.createElement('span');
        tag.className = 'ci-tag';
        tag.innerHTML = `${text} <button type="button" class="ci-tag-remove" aria-label="ลบ">×</button>`;
        tagsWrap.insertBefore(tag, tagInput);
    }

    // ---- Like buttons in feed ----
    document.querySelectorAll('.ci-stat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const countSpan = btn.querySelector('span');
            if (!countSpan) return;
            const isLiked = btn.classList.toggle('liked');
            const count = parseInt(countSpan.textContent) || 0;
            countSpan.textContent = isLiked ? count + 1 : count - 1;
            if (isLiked) {
                btn.style.color = '#e53935';
            } else {
                btn.style.color = '';
            }
        });
    });

    // ---- Form Submit ----
    const form = document.getElementById('checkin-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const location = locationInput ? locationInput.value.trim() : '';
            if (!location) {
                locationInput.focus();
                locationInput.style.borderColor = '#e53935';
                setTimeout(() => { locationInput.style.borderColor = ''; }, 2000);
                return;
            }
            // แสดง success message
            const btn = form.querySelector('[type="submit"]');
            if (btn) {
                btn.textContent = '✓ เผยแพร่แล้ว!';
                btn.disabled = true;
                setTimeout(() => {
                    btn.textContent = 'เผยแพร่เช็คอิน';
                    btn.disabled = false;
                    form.reset();
                    if (photoPreview) photoPreview.innerHTML = '';
                    if (captionCount) captionCount.textContent = '0';
                    currentRating = 0;
                    updateStars(0);
                }, 2000);
            }
        });
    }

    console.log('✅ Check-in page initialized');
});
