document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const menuIcon = mobileMenu ? mobileMenu.querySelector('i') : null;
    const sections = document.querySelectorAll('section[id], header[id]');

    // 1. MOBILE MENU TOGGLE
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

    // 2. DYNAMIC ACTIVE LINK ON CLICK & SCROLL
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

            // Close mobile drawer on click
            if (navLinksContainer) {
                navLinksContainer.classList.remove('active');
                if (menuIcon) {
                    menuIcon.classList.add('fa-bars');
                    menuIcon.classList.remove('fa-xmark');
                }
            }
        });
    });

    // 3. SCROLLSPY (Updates active link as user scrolls down the page)
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px', // Triggers active link when section hits upper viewport
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
});