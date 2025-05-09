// Counter Animation
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.number');

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // Animation duration in ms
        
        const animateCounter = (timestamp) => {
            if (!counter.startTime) {
                counter.startTime = timestamp;
            }
            const progress = timestamp - counter.startTime;
            const current = Math.min(Math.floor((progress / duration) * target), target);
            
            counter.textContent = current;

            if (progress < duration) {
                requestAnimationFrame(animateCounter);
            } else {
                counter.textContent = target; // Ensure it ends on target
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counter.dataset.animated) {
                    counter.textContent = '0'; // Reset before starting
                    counter.startTime = null; // Reset startTime for each animation trigger
                    requestAnimationFrame(animateCounter);
                    counter.dataset.animated = 'true'; // Mark as animated
                    // observer.unobserve(entry.target); // Optionally unobserve after animation
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });

    // Story Slider
    const storySlider = document.querySelector('.story-slider');
    if (storySlider) {
        const storySlide = storySlider.querySelector('.story-slide');
        const storyCards = storySlider.querySelectorAll('.story-card');
        const indicators = storySlider.querySelectorAll('.indicator');
        const prevBtn = storySlider.querySelector('.prev-btn');
        const nextBtn = storySlider.querySelector('.next-btn');

        let currentIndex = 0;
        const totalSlides = storyCards.length;

        function goToSlide(index) {
            // Loop back
            if (index < 0) {
                currentIndex = totalSlides - 1;
            } else if (index >= totalSlides) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }
            
            // For RTL, items are R-to-L. To show item N (0-indexed), we need to shift container to the RIGHT by N * 100%.
            // So positive translateX.
            // Item 0: translate(0%)
            // Item 1: translate(100%)
            // Item 2: translate(200%)
            storySlide.style.transform = `translateX(${currentIndex * 100}%)`;
            
            indicators.forEach((ind, i) => {
                ind.classList.toggle('active', i === currentIndex);
            });
        }

        // In RTL:
        // Next button (left arrow icon) should show the next item (e.g., from item0 to item1, index increases).
        // Prev button (right arrow icon) should show the previous item (e.g., from item1 to item0, index decreases).
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
                resetAutoSlide();
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
                resetAutoSlide();
            });
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlide();
            });
        });

        let autoSlideInterval;
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                goToSlide(currentIndex + 1); // Go to next slide
            }, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
        
        if(totalSlides > 0) { // Only start if there are slides
            goToSlide(0); // Initialize first slide
            startAutoSlide();
        }
    }

    // Animation on scroll for elements with .animate class
    const animatedElements = document.querySelectorAll('.animate');
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                // Unobserve after animation to prevent re-triggering
                // and to improve performance.
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.15 }); // Trigger when 15% of the element is visible

    animatedElements.forEach(element => {
        // Initial state set in CSS (opacity: 0), JS observer handles the transition
        scrollObserver.observe(element);
    });
});

// Note: The Brain Canvas animation is handled by the inline script in index.html
// and should not be modified here as per user request.