// ===================================
// Carousel Controller for Places
// ===================================

class PlacesCarousel {
    constructor(carouselId, prevBtnId, nextBtnId, indicatorsId) {
        this.carousel = document.getElementById(carouselId);
        this.prevBtn = document.getElementById(prevBtnId);
        this.nextBtn = document.getElementById(nextBtnId);
        this.indicatorsContainer = document.getElementById(indicatorsId);
        
        if (!this.carousel) {
            console.error('Carousel not found:', carouselId);
            return;
        }
        
        this.cardWidth = 320; // Width of each card
        this.gap = 32; // Gap between cards (2rem)
        this.scrollAmount = this.cardWidth + this.gap;
        this.currentIndex = 0;
        
        console.log('🎠 Initializing carousel:', carouselId);
        this.init();
    }
    
    init() {
        // Add event listeners for navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.scrollPrev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.scrollNext());
        }
        
        // Add scroll event listener to update indicators
        this.carousel.addEventListener('scroll', () => this.updateIndicators());
        
        // Add touch/swipe support
        this.addTouchSupport();
        
        // Create indicators after content is loaded
        setTimeout(() => this.createIndicators(), 200);
        
        // Keyboard navigation
        this.carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.scrollPrev();
            if (e.key === 'ArrowRight') this.scrollNext();
        });
        
        // Initial button state
        setTimeout(() => this.updateButtonStates(), 300);
        
        console.log('✅ Carousel initialized successfully');
    }
    
    scrollPrev() {
        const currentScroll = this.carousel.scrollLeft;
        this.carousel.scrollTo({
            left: Math.max(0, currentScroll - this.scrollAmount * 3),
            behavior: 'smooth'
        });
    }
    
    scrollNext() {
        const currentScroll = this.carousel.scrollLeft;
        const maxScroll = this.carousel.scrollWidth - this.carousel.offsetWidth;
        this.carousel.scrollTo({
            left: Math.min(maxScroll, currentScroll + this.scrollAmount * 3),
            behavior: 'smooth'
        });
    }
    
    createIndicators() {
        if (!this.indicatorsContainer) return;
        
        const totalCards = this.carousel.children.length;
        const cardsPerView = Math.floor(this.carousel.offsetWidth / this.scrollAmount);
        const totalPages = Math.max(1, Math.ceil(totalCards / cardsPerView));
        
        this.indicatorsContainer.innerHTML = '';
        
        console.log(`Creating ${totalPages} indicators for ${totalCards} cards`);
        
        for (let i = 0; i < totalPages; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (i === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                this.carousel.scrollTo({
                    left: i * this.scrollAmount * cardsPerView,
                    behavior: 'smooth'
                });
            });
            
            this.indicatorsContainer.appendChild(indicator);
        }
    }
    
    updateIndicators() {
        if (!this.indicatorsContainer) return;
        
        const indicators = this.indicatorsContainer.querySelectorAll('.carousel-indicator');
        if (indicators.length === 0) return;
        
        const scrollLeft = this.carousel.scrollLeft;
        const cardsPerView = Math.floor(this.carousel.offsetWidth / this.scrollAmount);
        const currentPage = Math.round(scrollLeft / (this.scrollAmount * cardsPerView));
        
        indicators.forEach((indicator, index) => {
            if (index === currentPage) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // Update button states
        this.updateButtonStates();
    }
    
    updateButtonStates() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        const scrollLeft = this.carousel.scrollLeft;
        const maxScroll = this.carousel.scrollWidth - this.carousel.offsetWidth;
        
        // Show/hide prev button
        if (scrollLeft <= 10) {
            this.prevBtn.style.opacity = '0';
            this.prevBtn.style.pointerEvents = 'none';
        } else {
            this.prevBtn.style.pointerEvents = 'auto';
        }
        
        // Show/hide next button
        if (scrollLeft >= maxScroll - 10) {
            this.nextBtn.style.opacity = '0';
            this.nextBtn.style.pointerEvents = 'none';
        } else {
            this.nextBtn.style.pointerEvents = 'auto';
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let scrollLeft = 0;
        let isDown = false;
        
        this.carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            this.carousel.style.cursor = 'grabbing';
            startX = e.pageX - this.carousel.offsetLeft;
            scrollLeft = this.carousel.scrollLeft;
        });
        
        this.carousel.addEventListener('mouseleave', () => {
            isDown = false;
            this.carousel.style.cursor = 'grab';
        });
        
        this.carousel.addEventListener('mouseup', () => {
            isDown = false;
            this.carousel.style.cursor = 'grab';
        });
        
        this.carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - this.carousel.offsetLeft;
            const walk = (x - startX) * 2;
            this.carousel.scrollLeft = scrollLeft - walk;
        });
        
        // Touch events for mobile
        let touchStartX = 0;
        let touchScrollLeft = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].pageX;
            touchScrollLeft = this.carousel.scrollLeft;
        });
        
        this.carousel.addEventListener('touchmove', (e) => {
            const touchX = e.touches[0].pageX;
            const walk = (touchStartX - touchX) * 1.5;
            this.carousel.scrollLeft = touchScrollLeft + walk;
        });
    }
}

// Export to window for use in other scripts
window.PlacesCarousel = PlacesCarousel;

console.log('📦 Carousel module loaded');
