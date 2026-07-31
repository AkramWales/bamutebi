document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const menuIcon = mobileMenu ? mobileMenu.querySelector('i') : null;
    const sections = document.querySelectorAll('section[id], header[id]');

    let isManualClick = false; // Flag to prevent ScrollSpy override on nav link click

    // ==========================================
    // 1. MOBILE MENU TOGGLE & RESIZE HANDLER
    // ==========================================
    const closeMobileMenu = () => {
        if (!navLinksContainer) return;
        navLinksContainer.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (menuIcon) {
            menuIcon.classList.add('fa-bars');
            menuIcon.classList.remove('fa-xmark');
        }
    };

    if (mobileMenu && navLinksContainer) {
        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = navLinksContainer.classList.toggle('active');
            mobileMenu.classList.toggle('active', isActive);
            if (menuIcon) {
                menuIcon.classList.toggle('fa-bars', !isActive);
                menuIcon.classList.toggle('fa-xmark', isActive);
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navLinksContainer.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    // Close mobile menu automatically if resized to desktop layout
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // ==========================================
    // 2. DYNAMIC ACTIVE LINK ON CLICK & SCROLL
    // ==========================================
    function setActiveLink(id) {
        if (isManualClick) return; // Skip updating if scrolling via click event
        navLinks.forEach(link => {
            const isMatch = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isMatch);
        });
    }

    // Handle Nav Item Clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            isManualClick = true;

            // Instantly highlight clicked link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Close mobile menu
            closeMobileMenu();

            // Re-enable ScrollSpy after smooth scrolling completes
            setTimeout(() => {
                isManualClick = false;
            }, 800);
        });
    });

    // ==========================================
    // 3. SCROLLSPY (Intersection Observer)
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
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
    const slideIntervalTime = 5000;
    let currentSlide = 0;
    let slideTimer = null;

    function goToSlide(index) {
        if (!slides.length) return;

        // Wrap around seamlessly
        currentSlide = (index + slides.length) % slides.length;

        // Update slides
        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentSlide);
        });

        // Update navigation dots
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });
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
        // Init active state
        goToSlide(0);

        // Dot Click Controls
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopSlideShow();
                goToSlide(index);
                startSlideShow(); // Reset auto timer
            });
        });

        startSlideShow();
    }

    // ==========================================
    // 5. ACCORDION FAQ TOGGLE
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const isOpen = faqItem.classList.contains('active');

            // Optional: Close all other open FAQ items (Accordion style)
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const itemAnswer = item.querySelector('.faq-answer');
                if (itemAnswer) itemAnswer.style.maxHeight = null;
            });

            // If it wasn't open, open it
            if (!isOpen) {
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
});