// عرض احصائيات بشكل متحرك مع عداد متزايد
const stats = document.querySelectorAll('.stats .stat-value');
const statTargets = [25, 350, 120];
stats.forEach((el, index) => {
    let start = 0;
    let end = statTargets[index];
    let duration = 1200;
    let step = Math.ceil(end / (duration / 30));
    let current = start;
    el.textContent = "+0" + (index === 0 ? "%" : "");
    setTimeout(() => {
        const interval = setInterval(() => {
            current += step;
            if (current >= end) {
                current = end;
                clearInterval(interval);
            }
            let display = current < 10 ? "0" + current : current;
            el.textContent = "+" + display + (index === 0 ? "%" : "");
        }, 30);
    }, 500 + (index * 300));
});

// زر القائمة (hamburger) لإظهار/إخفاء الروابط في الشاشات الصغيرة
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
    navToggle.style.display = 'block';
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
    navToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            navLinks.classList.toggle('show');
        }
    });
}

// تفعيل فلاتر معرض الاختراعات (فلترة حسب القطاع فقط كمثال)
const sectorFilter = document.getElementById('sector-filter');
const gallery = document.getElementById('inventions-gallery');
if (sectorFilter && gallery) {
    sectorFilter.addEventListener('change', () => {
        const val = sectorFilter.value;
        const cards = gallery.querySelectorAll('.invention-card');
        cards.forEach(card => {
            const sector = card.querySelector('.performance-indicators span:nth-child(2)');
            if (!sector) return;
            if (val === 'all' || sector.textContent.includes(val)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// مكان تفعيل نموذج ثلاثي الأبعاد في الهيدر (مثلاً باستخدام three.js)
// const canvas = document.getElementById('innovation3d');
// ...تهيئة نموذج 3D...

// مكان تفعيل معاينة افتراضية للمنصة
// document.querySelector('.virtual-btn').addEventListener('click', function() {
//   // عرض نافذة معاينة افتراضية
// });