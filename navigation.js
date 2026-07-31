document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const menuIcon = mobileMenu ? mobileMenu.querySelector('i') : null;
    const sections = document.querySelectorAll('section[id], header[id]');

    // ==========================================
    // 1. MOBILE MENU TOGGLE
    // ==========================================
    if (mobileMenu && navLinksContainer) {
        mobileMenu.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            if (menuIcon) {
                menuIcon.classList.toggle('fa-bars');
                menuIcon.classList.toggle('fa-xmark');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navLinksContainer.contains(e.target)) {
                navLinksContainer.classList.remove('active');
                if (menuIcon) {
                    menuIcon.classList.add('fa-bars');
                    menuIcon.classList.remove('fa-xmark');
                }
            }
        });
    }

    // ==========================================
    // 2. DYNAMIC ACTIVE LINK ON CLICK & SCROLL
    // ==========================================
    function setActiveLink(id) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }

    // Move underline immediately on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Close mobile drawer on link click
            if (navLinksContainer) {
                navLinksContainer.classList.remove('active');
                if (menuIcon) {
                    menuIcon.classList.add('fa-bars');
                    menuIcon.classList.remove('fa-xmark');
                }
            }
        });
    });

    // ==========================================
    // 3. SCROLLSPY (Updates active link on scroll)
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px', // Triggers active link when section enters upper viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveLink(entry.target.id);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // ==========================================
    // 4. HERO BACKGROUND CAROUSEL & DOT CONTROLS
    // ==========================================
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let currentSlide = 0;
    const slideIntervalTime = 5000; // Rotates slide every 5 seconds
    let slideTimer = null;

    function goToSlide(index) {
        if (!slides.length) return;

        // Wrap around seamlessly (Last -> First -> Last)
        const nextIndex = (index + slides.length) % slides.length;

        // Activate new slide and corresponding dot
        slides.forEach((slide, idx) => {
            if (idx === nextIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        dots.forEach((dot, idx) => {
            if (idx === nextIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        currentSlide = nextIndex;
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function startSlideShow() {
        if (slides.length > 1) {
            slideTimer = setInterval(nextSlide, slideIntervalTime);
        }
    }

    function stopSlideShow() {
        if (slideTimer) {
            clearInterval(slideTimer);
        }
    }

    if (slides.length > 0) {
        // Initialize active state immediately on DOM load
        goToSlide(0);

        // Manual dot control click handler
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopSlideShow();
                goToSlide(index);
                startSlideShow(); // Reset 5s timer after manual selection
            });
        });

        // Start automatic 5-second slideshow loop
        startSlideShow();
    }
});