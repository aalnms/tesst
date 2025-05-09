document.addEventListener('DOMContentLoaded', () => {
    // التأكد من أن العناصر موجودة قبل محاولة التعامل معها
    const safeQuerySelector = (selector) => document.querySelector(selector);
    const safeQuerySelectorAll = (selector) => document.querySelectorAll(selector);

    // عرض احصائيات بشكل متحرك مع عداد متزايد
    const statsCounters = safeQuerySelectorAll('.stats .stat-value[data-target]');
    if (statsCounters.length > 0) {
        statsCounters.forEach((el, index) => {
            const target = parseInt(el.dataset.target, 10);
            if (isNaN(target)) return;

            let start = 0;
            const duration = 1500; // مدة أطول قليلاً لتحريك أكثر سلاسة
            const incrementTime = 30; // كل 30 ميللي ثانية
            const steps = Math.ceil(duration / incrementTime);
            const stepValue = Math.ceil(target / steps);
            
            el.textContent = "+0" + (el.textContent.includes("%") ? "%" : ""); // الحفاظ على العلامة إن وجدت

            setTimeout(() => {
                const interval = setInterval(() => {
                    start += stepValue;
                    if (start >= target) {
                        start = target;
                        clearInterval(interval);
                    }
                    let display = start < 10 && target >= 10 ? "0" + start : start; // تحسين عرض الأرقام الصغيرة
                    el.textContent = "+" + display + (el.textContent.includes("%") ? "%" : "");
                }, incrementTime);
            }, 500 + (index * 200)); // تأخير متفاوت لبدء كل عداد
        });
    }

    // زر القائمة (hamburger) لإظهار/إخفاء الروابط في الشاشات الصغيرة
    const navToggle = safeQuerySelector('.nav-toggle');
    const navLinks = safeQuerySelector('.nav-links');

    if (navToggle && navLinks) {
        // navToggle.style.display = 'block'; // يتم التحكم به الآن عبر CSS media query

        const toggleNav = () => {
            const isShown = navLinks.classList.toggle('show');
            navToggle.setAttribute('aria-expanded', isShown);
        };

        navToggle.addEventListener('click', toggleNav);
        navToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // منع التمرير عند الضغط على Space
                toggleNav();
            }
        });
    }

    // تفعيل فلاتر معرض الاختراعات (حسب القطاع، التكلفة، والعائد)
    const sectorFilter = safeQuerySelector('#sector-filter');
    const costFilter = safeQuerySelector('#cost-filter');
    const returnFilter = safeQuerySelector('#return-filter');
    const gallery = safeQuerySelector('#inventions-gallery');
    const noResultsMessage = safeQuerySelector('#no-results-message');

    if (gallery && sectorFilter && costFilter && returnFilter && noResultsMessage) {
        const inventionCards = Array.from(gallery.querySelectorAll('.invention-card'));

        const applyFilters = () => {
            const sectorVal = sectorFilter.value;
            const costVal = costFilter.value;
            const returnVal = returnFilter.value;
            let visibleCardsCount = 0;

            inventionCards.forEach(card => {
                const cardSector = card.dataset.sector || '';
                const cardCost = card.dataset.cost || '';
                const cardReturn = card.dataset.return || '';

                const sectorMatch = (sectorVal === 'all' || cardSector === sectorVal);
                const costMatch = (costVal === 'all' || cardCost === costVal);
                const returnMatch = (returnVal === 'all' || cardReturn === returnVal);

                if (sectorMatch && costMatch && returnMatch) {
                    card.style.display = ''; // أو 'flex' أو 'grid' حسب تصميم البطاقة
                    visibleCardsCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (visibleCardsCount === 0) {
                noResultsMessage.style.display = 'block';
            } else {
                noResultsMessage.style.display = 'none';
            }
        };

        sectorFilter.addEventListener('change', applyFilters);
        costFilter.addEventListener('change', applyFilters);
        returnFilter.addEventListener('change', applyFilters);
        
        // تطبيق الفلاتر عند تحميل الصفحة إذا كانت هناك قيم افتراضية غير 'all'
        applyFilters(); 
    }


    // تفعيل قسم الأسئلة الشائعة (Accordion)
    const faqItems = safeQuerySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const questionButton = item.querySelector('.faq-question');
            const answerDiv = item.querySelector('.faq-answer');

            if (questionButton && answerDiv) {
                questionButton.addEventListener('click', () => {
                    const isExpanded = questionButton.getAttribute('aria-expanded') === 'true';
                    
                    // إغلاق جميع الأسئلة الأخرى (سلوك الأكورديون التقليدي) - اختياري
                    // faqItems.forEach(otherItem => {
                    //     if (otherItem !== item) {
                    //         otherItem.querySelector('.faq-question').classList.remove('active');
                    //         otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    //         otherItem.querySelector('.faq-answer').classList.remove('active');
                    //         otherItem.querySelector('.faq-answer').setAttribute('aria-hidden', 'true');
                    //         otherItem.querySelector('.faq-answer').style.maxHeight = null; // إذا كنت تستخدم maxHeight للتحريك
                    //     }
                    // });


                    questionButton.classList.toggle('active');
                    answerDiv.classList.toggle('active');
                    questionButton.setAttribute('aria-expanded', !isExpanded);
                    answerDiv.setAttribute('aria-hidden', isExpanded);

                    // للتحريك باستخدام maxHeight (اختياري ويتطلب تعديلات CSS)
                    // if (answerDiv.classList.contains('active')) {
                    //     answerDiv.style.maxHeight = answerDiv.scrollHeight + "px";
                    // } else {
                    //     answerDiv.style.maxHeight = null;
                    // }
                });
                 questionButton.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        questionButton.click();
                    }
                });
            }
        });
    }


    // تحديث سنة الحقوق في الفوتر تلقائياً
    const currentYearSpan = safeQuerySelector('#current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // مكان تفعيل نموذج ثلاثي الأبعاد في الهيدر (مثلاً باستخدام three.js)
    const innovation3dCanvas = safeQuerySelector('#innovation3d');
    if (innovation3dCanvas) {
        // console.log("تهيئة نموذج 3D الرئيسي...");
        // ... يمكن إضافة كود تهيئة three.js هنا ...
        // مثال: const scene = new THREE.Scene(); ...
    }

    // مكان تفعيل معاينة افتراضية للمنصة
    const virtualPreviewBtn = safeQuerySelector('.virtual-btn');
    if (virtualPreviewBtn) {
        virtualPreviewBtn.addEventListener('click', function() {
            // console.log("فتح نافذة معاينة افتراضية للمنصة...");
            // يمكن هنا عرض نافذة منبثقة (modal) أو الانتقال لصفحة أخرى
            alert("سيتم فتح معاينة افتراضية للمنصة (قيد التطوير).");
        });
    }

    // ملاحظة: النماذج ثلاثية الأبعاد داخل بطاقات الاختراعات (invention-3d)
    // يمكن تهيئتها بشكل مشابه عند الحاجة، ربما عند تمرير الماوس أو عند ظهور البطاقة في الشاشة.
    const invention3dCanvases = safeQuerySelectorAll('.invention-3d');
    if (invention3dCanvases.length > 0) {
        invention3dCanvases.forEach(canvas => {
            // console.log(`تهيئة نموذج 3D للاختراع (canvas: ${canvas.ariaLabel || 'بدون تسمية'})...`);
            // ... كود تهيئة لكل نموذج ...
        });
    }

});