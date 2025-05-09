// تأثيرات متحركة للنموذج ورسالة التأكيد
const contactForm = document.getElementById('contactForm');
const formConfirmation = document.getElementById('formConfirmation');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // إظهار رسالة التأكيد مع تأثير ثلاثي الأبعاد
        formConfirmation.style.display = 'block';
        contactForm.reset();
        setTimeout(() => {
            formConfirmation.style.display = 'none';
        }, 4000);
    });

    // تأثير تعبئة الحقول
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 0 3px #64b5f6aa';
            this.style.background = '#e3f0ff';
        });
        field.addEventListener('blur', function() {
            this.style.boxShadow = '';
            this.style.background = '';
        });
    });
}

// روبوت المحادثة (Gemini API محاكاة)
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatWindow = document.getElementById('chatWindow');

// أسئلة شائعة وإجابات افتراضية
const faq = {
    "كيف يمكنني تسجيل اختراعي؟": "يمكنك تسجيل اختراعك عبر نموذج التواصل أو من خلال صفحة تسجيل الاختراعات.",
    "ما هي طرق الاستثمار المتاحة؟": "توفر منصة ابتكار عدة طرق للاستثمار، يمكنك التواصل معنا لمزيد من التفاصيل.",
    "كيف أقدم اقتراحاً؟": "يمكنك إرسال اقتراحك عبر نموذج التواصل أو مباشرة عبر روبوت المحادثة.",
    "هل يمكنني الشراكة مع ابتكار؟": "نعم، نرحب بجميع الشراكات. يرجى التواصل معنا عبر النموذج أو المحادثة.",
    "ما هي أوقات عمل الدعم؟": "الدعم متاح على مدار الساعة طوال أيام الأسبوع."
};

function appendMessage(sender, text) {
    const msg = document.createElement('div');
    msg.className = sender === 'user' ? 'chat-msg-user' : 'chat-msg-bot';
    msg.style.margin = '8px 0';
    msg.style.textAlign = sender === 'user' ? 'right' : 'left';
    msg.style.background = sender === 'user' ? '#e3f0ff' : '#f5f8ff';
    msg.style.borderRadius = '10px';
    msg.style.padding = '8px 12px';
    msg.style.display = 'inline-block';
    msg.style.maxWidth = '90%';
    msg.textContent = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

if (chatForm) {
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const userMsg = chatInput.value.trim();
        if (!userMsg) return;
        appendMessage('user', userMsg);
        chatInput.value = '';
        // محاكاة استجابة Gemini API
        setTimeout(() => {
            let response = faq[userMsg] || "شكراً لسؤالك! سيتم الرد عليك قريباً أو يمكنك التواصل عبر النموذج.";
            appendMessage('bot', response);
        }, 800);
    });
}
