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
            el.textContent = "+" + current + (index === 0 ? "%" : "");
        }, 30);
    }, 500 + (index * 300));
});

// مكان تفعيل نموذج ثلاثي الأبعاد في الهيدر (مثلاً باستخدام three.js)
// const canvas = document.getElementById('innovation3d');
// ...تهيئة نموذج 3D...

// مكان تفعيل معاينة افتراضية للمنصة
// document.querySelector('.virtual-btn').addEventListener('click', function() {
//   // عرض نافذة معاينة افتراضية
// });