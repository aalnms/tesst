document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            menuToggle.classList.toggle('active');
            // ARIA attribute for accessibility
            const isExpanded = navLinks.classList.contains('show');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Close mobile menu when a link is clicked
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }


    // --- Accordion Functionality ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    if (accordionHeaders.length > 0) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const currentlyActive = document.querySelector('.accordion-header.active');
                if (currentlyActive && currentlyActive !== this) {
                    currentlyActive.classList.remove('active');
                    currentlyActive.nextElementSibling.style.maxHeight = '0';
                }

                this.classList.toggle('active');
                const content = this.nextElementSibling;
                if (this.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
            });
        });

        // Auto-click the first accordion item for initial display after a short delay
        // setTimeout(() => {
        //     if (accordionHeaders[0]) {
        //       //  accordionHeaders[0].click(); // Can be annoying if user scrolls fast
        //     }
        // }, 1000);
    }


    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Optional: Stop observing once visible
            } else {
                // Optional: Remove 'visible' class if you want elements to re-animate when scrolling back up
                // entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    if (animatedElements.length > 0) {
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }


    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ensure it's a valid internal link and not just "#"
            if (href && href.length > 1 && href.startsWith('#')) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start' // Scrolls to the top of the target element
                    });
                }
            }
        });
    });

    // --- Update Copyright Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

});