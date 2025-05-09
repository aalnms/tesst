// تم حذف كود 3D Animation for Hero Section بالكامل بناءً على طلبك

// Counter Animation
const counters = document.querySelectorAll('.number');

counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const duration = 2000; // Animation duration in ms
    const increment = target / (duration / 30); // Update every 30ms
    
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        
        if (current < target) {
            counter.textContent = Math.floor(current);
            setTimeout(updateCounter, 30);
        } else {
            counter.textContent = target;
        }
    };
    
    // Start counter animation when in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
});

// Story Slider
const storySlide = document.querySelector('.story-slide');
const storyCards = document.querySelectorAll('.story-card');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentIndex = 0;
const cardWidth = 100; // 100%

function goToSlide(index) {
    if (index < 0) {
        index = storyCards.length - 1;
    } else if (index >= storyCards.length) {
        index = 0;
    }
    
    currentIndex = index;
    storySlide.style.transform = `translateX(${100 * index}%)`;
    
    // Update indicators
    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === currentIndex);
    });
}

// Next and Prev buttons
nextBtn.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
});

prevBtn.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
});

// Indicator clicks
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        goToSlide(index);
    });
});

// Auto slide
let autoSlide = setInterval(() => {
    goToSlide(currentIndex + 1);
}, 5000);

// Reset timer on manual navigation
document.querySelector('.story-slider').addEventListener('click', () => {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5000);
});

// Animation on scroll
const animatedElements = document.querySelectorAll('.animate');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

animatedElements.forEach(element => {
    element.style.opacity = 0;
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    scrollObserver.observe(element);
});