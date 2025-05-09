        // عرض احصائيات بشكل متحرك
        const stats = document.querySelectorAll('.stats div');
        stats.forEach((el, index) => {
            el.style.transform = 'scale(0.8)';
            el.style.opacity = 0;
            setTimeout(() => {
                el.style.transition = 'all 0.6s ease';
                el.style.transform = 'scale(1)';
                el.style.opacity = 1;
            }, 500 + (index * 300));
        });