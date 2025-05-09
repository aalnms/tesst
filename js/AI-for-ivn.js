        // IMPORTANT: Storing API keys directly in client-side code is insecure for production.
        // This should be handled via a backend proxy in a real application.
        const GEMINI_API_KEY = "AIzaSyAdJPdebH63ndKSml2udqN9K6ganTF6HkY"; // استبدل هذا بمفتاح API الخاص بك (من الواجهة الخلفية)
        const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;
        const API_TIMEOUT = 30000; // 30 seconds timeout

        async function callGeminiAPI(systemPrompt, userContent, outputElement, buttonElement) {
            if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
                outputElement.innerHTML = '<p style="color: red;">خطأ: لم يتم تكوين مفتاح API. يرجى مراجعة مسؤول النظام.</p>';
                return;
            }

            if (!userContent || userContent.trim() === "") {
                outputElement.innerHTML = '<p style="color: orange;">الرجاء إدخال البيانات المطلوبة.</p>';
                return;
            }

            const originalButtonText = buttonElement.innerHTML;
            buttonElement.innerHTML = 'جاري التحليل... <div class="loading-spinner"></div>';
            buttonElement.disabled = true;
            outputElement.innerHTML = '<p class="loading-text">جاري معالجة طلبك بواسطة الذكاء الاصطناعي... قد يستغرق هذا بعض الوقت.</p>';

            const requestBody = {
                "contents": [
                    {
                        "parts": [
                            { "text": systemPrompt },
                            { "text": userContent }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 1,
                    "topP": 1,
                    "maxOutputTokens": 2048,
                    "stopSequences": []
                },
                "safetySettings": [
                    { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
                    { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
                    { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
                    { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" }
                ]
            };

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

            try {
                const response = await fetch(GEMINI_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (e) {
                        // If response is not JSON
                        const textError = await response.text();
                        throw new Error(`API Error: ${response.status} ${response.statusText}. ${textError}`);
                    }
                    console.error('Gemini API Error Data:', errorData);
                    let errorMessage = `خطأ في الواجهة البرمجية: ${response.status} ${response.statusText}.`;
                    if (errorData && errorData.error && errorData.error.message) {
                        errorMessage += ` التفاصيل: ${errorData.error.message}`;
                    }
                    // Check for common API key issues
                    if (response.status === 400 && errorData.error?.message.toLowerCase().includes("api key not valid")) {
                         errorMessage = "خطأ: مفتاح API غير صالح. يرجى التحقق من المفتاح أو الاتصال بالدعم.";
                    } else if (response.status === 403) {
                         errorMessage = "خطأ: الوصول مرفوض. قد يكون مفتاح API غير مصرح له باستخدام هذا النموذج أو الخدمة.";
                    }
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                
                if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                    let textContent = data.candidates[0].content.parts[0].text;
                    // Basic sanitization to prevent XSS if textContent is directly used as HTML
                    // For robust sanitization, use a dedicated library like DOMPurify in production.
                    const tempDiv = document.createElement('div');
                    tempDiv.textContent = textContent; // This correctly escapes HTML special characters
                    outputElement.innerHTML = tempDiv.innerHTML.replace(/\n/g, '<br>'); // Preserve line breaks
                } else if (data.promptFeedback && data.promptFeedback.blockReason) {
                     outputElement.innerHTML = `<p style="color: red;">تم حظر الطلب بسبب: ${data.promptFeedback.blockReason}. يرجى تعديل المدخلات والمحاولة مرة أخرى.</p>`;
                     if (data.promptFeedback.safetyRatings) {
                         outputElement.innerHTML += `<h4>تقييمات السلامة:</h4><pre style="font-size: 0.8em; background-color: #2a2a2a; padding: 10px; border-radius: 5px;">${JSON.stringify(data.promptFeedback.safetyRatings, null, 2)}</pre>`;
                     }
                } else {
                    console.warn('Unexpected API response structure:', data);
                    outputElement.innerHTML = '<p style="color: orange;">تم استلام رد غير متوقع من الواجهة البرمجية. يرجى المحاولة لاحقاً أو مراجعة وحدة التحكم لمزيد من التفاصيل.</p>';
                }

            } catch (error) {
                console.error('Error calling Gemini API:', error);
                if (error.name === 'AbortError') {
                    outputElement.innerHTML = `<p style="color: red;">انتهت مهلة الطلب. استغرق الاتصال بالواجهة البرمجية وقتاً طويلاً. يرجى المحاولة مرة أخرى.</p>`;
                } else {
                    outputElement.innerHTML = `<p style="color: red;">حدث خطأ أثناء الاتصال بالواجهة البرمجية: ${error.message}. يرجى المحاولة مرة أخرى أو التأكد من صلاحية مفتاح API واتصالك بالإنترنت.</p>`;
                }
            } finally {
                buttonElement.innerHTML = originalButtonText;
                buttonElement.disabled = false;
                clearTimeout(timeoutId); // Ensure timeout is cleared
            }
        }


        document.addEventListener('DOMContentLoaded', function() {
            // Brain Animation
            const canvas = document.getElementById('brainCanvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                canvas.width = canvas.parentElement.offsetWidth || 500;
                canvas.height = canvas.parentElement.offsetHeight || 500;

                let particles = [];
                const numParticles = Math.min(250, Math.floor(canvas.width / 2.5)); // Increased particles
                const connectionDistance = Math.min(120, canvas.width / 4.5); // Slightly increased connection distance
                const maxConnections = 6;
                const center_x = canvas.width / 2;
                const center_y = canvas.height / 2;
                const max_radius = Math.min(center_x, center_y) * 0.75; // Slightly larger radius


                for (let i = 0; i < numParticles; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = (max_radius * 0.5) + Math.random() * (max_radius * 0.5); // More spread
                    const x = center_x + Math.cos(angle) * radius * (0.75 + Math.sin(angle * 3 + i * 0.1) * 0.25); // More organic shape
                    const y = center_y + Math.sin(angle) * radius * (0.75 + Math.sin(angle * 2 + i * 0.1) * 0.25);
                    
                    particles.push({
                        x, y,
                        size: 1 + Math.random() * 2.5, // Slightly larger max size
                        speedX: (Math.random() - 0.5) * 0.6,
                        speedY: (Math.random() - 0.5) * 0.6,
                        color: `rgba(33, 150, 243, ${0.4 + Math.random() * 0.6})`, // More vibrant
                        connections: 0,
                        pulse: Math.random() * Math.PI * 2
                    });
                }

                function animateBrain() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    for (let i = 0; i < particles.length; i++) {
                        const p = particles[i];
                        p.pulse += 0.025; // Slightly faster pulse
                        const pulseFactor = (Math.sin(p.pulse) + 1) * 0.5;
                        p.x += p.speedX;
                        p.y += p.speedY;
                        const distFromCenter = Math.sqrt(Math.pow(p.x - center_x, 2) + Math.pow(p.y - center_y, 2));
                        
                        // Keep particles within an oval shape
                        const normalizedX = (p.x - center_x) / (max_radius * 1.15);
                        const normalizedY = (p.y - center_y) / (max_radius * 0.9); // Make it more elliptical
                        if (normalizedX * normalizedX + normalizedY * normalizedY > 1) {
                            const angleToCenter = Math.atan2(center_y - p.y, center_x - p.x);
                            p.speedX += Math.cos(angleToCenter) * 0.1;
                            p.speedY += Math.sin(angleToCenter) * 0.1;
                            p.x = center_x + Math.cos(angleToCenter) * max_radius * 1.1 * (Math.random() * 0.1 + 0.9); // Reposition closer
                            p.y = center_y + Math.sin(angleToCenter) * max_radius * 0.85 * (Math.random() * 0.1 + 0.9);
                        }

                        if (p.x < p.size || p.x > canvas.width - p.size) p.speedX *= -0.8; 
                        if (p.y < p.size || p.y > canvas.height - p.size) p.speedY *= -0.8;

                        p.speedX *= 0.99; p.speedY *= 0.99; // Slower decay
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size * (0.6 + pulseFactor * 0.6), 0, Math.PI * 2); // More pulse effect
                        ctx.fillStyle = p.color;
                        ctx.fill();
                        p.connections = 0;
                    }
                    ctx.lineWidth = 0.6; // Slightly thicker lines
                    for (let i = 0; i < particles.length; i++) {
                        const p1 = particles[i];
                        for (let j = i + 1; j < particles.length; j++) {
                            const p2 = particles[j];
                            if (p1.connections >= maxConnections || p2.connections >= maxConnections) continue;
                            const dx = p1.x - p2.x; const dy = p1.y - p2.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            if (distance < connectionDistance) {
                                const opacity = (1 - distance / connectionDistance) * 0.9; // Stronger opacity
                                ctx.strokeStyle = `rgba(77, 182, 243, ${opacity})`; // Lighter blue for connections
                                ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                                p1.connections++; p2.connections++;
                            }
                        }
                    }
                    requestAnimationFrame(animateBrain);
                }
                animateBrain();
                 // Resize canvas with window
                window.addEventListener('resize', () => {
                    if (canvas.parentElement) {
                        canvas.width = canvas.parentElement.offsetWidth;
                        canvas.height = canvas.parentElement.offsetHeight;
                        // Re-initialize or adjust particle positions if needed, for simplicity, we just update center and max_radius
                        // This might cause particles to jump, a full re-init would be smoother
                        const new_center_x = canvas.width / 2;
                        const new_center_y = canvas.height / 2;
                        const new_max_radius = Math.min(new_center_x, new_center_y) * 0.75;
                        
                        // Quick particle repositioning attempt (might not be perfect)
                        particles.forEach(p => {
                            p.x = new_center_x + (p.x - center_x) * (new_max_radius / max_radius);
                            p.y = new_center_y + (p.y - center_y) * (new_max_radius / max_radius);
                        });
                        center_x = new_center_x;
                        center_y = new_center_y;
                        max_radius = new_max_radius;
                    }
                });
            }


            // TRL Range Slider
            const trlRange = document.getElementById('trl-range');
            const trlValue = document.getElementById('trl-value');
            if (trlRange && trlValue) {
                trlValue.textContent = trlRange.value; // Set initial value
                trlRange.addEventListener('input', function() {
                    trlValue.textContent = this.value;
                });
            }

            // Tabs functionality
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    const activeTabContent = document.getElementById(tabId);
                    if (activeTabContent) activeTabContent.classList.add('active');
                });
            });

            // FAQ functionality
            const faqItems = document.querySelectorAll('.faq-item');
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                if (question) {
                    question.addEventListener('click', function() {
                        const answer = item.querySelector('.faq-answer');
                        const isActive = item.classList.contains('active');
                        
                        // Close all other FAQ items if you want an accordion style
                        // faqItems.forEach(otherItem => {
                        //     if (otherItem !== item) {
                        //         otherItem.classList.remove('active');
                        //         otherItem.querySelector('.faq-answer').style.maxHeight = null;
                        //     }
                        // });

                        item.classList.toggle('active');
                        if (item.classList.contains('active')) {
                            answer.style.maxHeight = answer.scrollHeight + "px";
                        } else {
                            answer.style.maxHeight = null;
                        }
                    });
                }
            });

            // Popup functionality (Kept as is, can be removed if not used)
            const popupCloseIcon = document.getElementById('popup-close-icon');
            const popupCloseBtn = document.getElementById('popup-close-btn');
            const popup = document.getElementById('demo-popup');

            function closePopup() {
                if (popup) popup.style.display = 'none';
            }
            if (popupCloseIcon) popupCloseIcon.addEventListener('click', closePopup);
            if (popupCloseBtn) popupCloseBtn.addEventListener('click', closePopup);
            // Example: To open popup (you'd call this from somewhere else)
            // function openPopup(title, content) {
            //     if (popup) {
            //         popup.querySelector('.popup-title').textContent = title;
            //         popup.querySelector('.popup-body').innerHTML = content;
            //         popup.style.display = 'flex'; // Use flex to center it as per CSS
            //     }
            // }


            // --- GEMINI API INTEGRATIONS ---
            // Helper function to get element and attach listener
            function setupAnalyzationButton(buttonId, outputId, systemPrompt, userContentBuilder) {
                const button = document.getElementById(buttonId);
                if (button) {
                    button.addEventListener('click', () => {
                        const outputEl = document.getElementById(outputId);
                        if (!outputEl) {
                            console.error(`Output element with ID ${outputId} not found.`);
                            return;
                        }
                        const userContent = userContentBuilder();
                        callGeminiAPI(systemPrompt, userContent, outputEl, button);
                    });
                } else {
                    // console.warn(`Button with ID ${buttonId} not found.`);
                }
            }

            // 1. Invention Evaluation (Card)
            setupAnalyzationButton('analyze-inv-eval-btn', 'inv-eval-output',
                "أنت خبير في تقييم الاختراعات. قم بتقييم الاختراع التالي بناءً على الاسم والقطاع والوصف. قدم تقييمًا يتضمن نقاط القوة والضعف، تصنيف الاختراع، مقارنة مبدئية مع اختراعات مشابهة، وتقدير أولي للقيمة السوقية المحتملة. كن مفصلاً وواقعياً. قدم إجابتك بتنسيق Markdown واضح يتضمن عناوين وفقرات ونقاط.",
                () => {
                    const name = document.getElementById('inv-eval-name').value;
                    const sector = document.getElementById('inv-eval-sector').value;
                    const desc = document.getElementById('inv-eval-desc').value;
                    return `بيانات الاختراع:\nالاسم: ${name}\nالقطاع: ${sector}\nالوصف: ${desc}`;
                }
            );

            // 2. Documentation Improvement (Card)
            setupAnalyzationButton('analyze-doc-imprv-btn', 'doc-imprv-output',
                "أنت خبير في تحسين توثيق الاختراعات. قم بتحليل نص توثيق الاختراع التالي واقترح تحسينات لغوية وتقنية لزيادة وضوحه وجاذبيته. ركز على نقاط القوة والضعف في التوثيق الحالي، واقتراحات لتحسين الوصف، وإضافة مصطلحات تقنية مناسبة إذا لزم الأمر. قدم الاقتراحات في شكل نقاط واضحة بتنسيق Markdown.",
                () => `نص التوثيق:\n${document.getElementById('doc-imprv-text').value}`
            );
            
            // 3. Market Analysis for Inventors (Card)
            setupAnalyzationButton('analyze-market-inv-btn', 'market-inv-output',
                "أنت خبير في تحليل الأسواق للمخترعين. قم بتحليل السوق المستهدف لاختراع في القطاع المحدد (مع التركيز على الجمهور المستهدف إذا تم تحديده). قدم تحليلاً يتضمن حجم السوق المستهدف المحتمل، المنافسين الرئيسيين، اتجاهات السوق، وتقدير للتكلفة والعائد المحتمل بشكل عام. كن شاملاً وقدم أرقامًا تقديرية إذا أمكن. قدم إجابتك بتنسيق Markdown.",
                () => {
                    const sector = document.getElementById('market-inv-sector').value;
                    const audience = document.getElementById('market-inv-audience').value;
                    return `بيانات التحليل:\nقطاع الاختراع: ${sector}\nالجمهور المستهدف (اختياري): ${audience || 'عام'}`;
                }
            );

            // 4. Smart Recommendations for Investors (Card)
            setupAnalyzationButton('analyze-reco-btn', 'reco-output',
                "أنت نظام توصيات ذكي للمستثمرين. بناءً على اهتمامات المستثمر وملفه الاستثماري، اقترح أنواعًا من الاختراعات أو قطاعات واعدة قد تكون مناسبة للاستثمار. صف لماذا هذه التوصيات قد تكون جذابة وقدم أمثلة إذا أمكن. قدم إجابتك بتنسيق Markdown.",
                () => {
                    const interests = document.getElementById('reco-interests').value;
                    const profile = document.getElementById('reco-profile').value;
                    return `اهتمامات المستثمر: ${interests}\nالملف الاستثماري السابق (موجز): ${profile}`;
                }
            );
            
            // 5. Risk Analysis for Investors (Card)
            setupAnalyzationButton('analyze-risk-btn', 'risk-output',
                "أنت خبير في تحليل المخاطر الاستثمارية في الاختراعات. قم بتقييم المخاطر المحتملة للاستثمار في اختراع بالوصف ومبلغ الاستثمار المحددين. حدد عوامل المخاطرة الرئيسية (تقنية، سوقية، مالية، تشغيلية)، وقدم تقييمًا نوعيًا للمخاطر، واقترح استراتيجيات عامة للتخفيف منها. قدم إجابتك بتنسيق Markdown.",
                () => {
                    const invDesc = document.getElementById('risk-inv-desc').value;
                    const invAmount = document.getElementById('risk-inv-amount').value;
                    return `وصف الاختراع/الفرصة: ${invDesc}\nمبلغ الاستثمار: ${invAmount}`;
                }
            );

            // 6. Market Analysis for Investors (Card)
            setupAnalyzationButton('analyze-market-investor-btn', 'market-investor-output',
                "أنت خبير في تحليل الأسواق للمستثمرين. قم بتقديم تحليل سوق متعمق للقطاع المحدد. ركز على توقعات النمو، المنافسين الرئيسيين، إمكانات التوسع، والفرص الاستثمارية البارزة في هذا القطاع. استخدم بيانات وأمثلة لدعم تحليلك. قدم إجابتك بتنسيق Markdown.",
                () => `قطاع الاهتمام: ${document.getElementById('market-investor-sector').value}`
            );

            // 7. Match System
            setupAnalyzationButton('analyze-match-btn', 'match-output',
                "أنت نظام مطابقة ذكي بين المخترعين والمستثمرين. بناءً على ملف المخترع وملف المستثمر، قم بتحليل مدى التوافق بينهما (مثلاً: منخفض، متوسط، عالي). اشرح أسباب المطابقة المحتملة أو عدمها، وركز على نقاط الالتقاء والاختلاف الرئيسية. قدم إجابتك بتنسيق Markdown.",
                () => {
                    const inventorProfile = document.getElementById('match-inventor-field').value;
                    const investorProfile = document.getElementById('match-investor-interest').value;
                    return `ملف المخترع:\n${inventorProfile}\n\nملف المستثمر:\n${investorProfile}`;
                }
            );

            // 8. Cost Estimation (Financial Analysis Card)
            setupAnalyzationButton('analyze-cost-btn', 'cost-output',
                "أنت خبير في تقدير تكاليف تصنيع الاختراعات. قم بتقدير عام لتكاليف التصنيع (مع ذكر العوامل المؤثرة مثل المواد، العمالة، التطوير، التسويق الأولي) لاختراع من النوع والتعقيد ونطاق الإنتاج المحدد. قدم نطاقًا تقديريًا للتكاليف إذا أمكن. قدم إجابتك بتنسيق Markdown.",
                () => {
                    const invType = document.getElementById('cost-inv-type').value;
                    const complexity = document.getElementById('cost-complexity').value;
                    const scale = document.getElementById('cost-scale').value;
                    return `بيانات التقدير:\nنوع الاختراع: ${invType}\nالتعقيد: ${complexity}\nنطاق الإنتاج: ${scale}`;
                }
            );

            // 9. Pricing Models (Financial Analysis Card)
            setupAnalyzationButton('analyze-price-btn', 'price-output',
                "أنت خبير في استراتيجيات التسعير. اقترح 2-3 نماذج تسعير متعددة ومناسبة للمنتج الذي يستهدف شريحة السوق المحددة. اشرح مزايا وعيوب كل نموذج مقترح في هذا السياق، وقدم مثالاً توضيحيًا لكل نموذج. قدم إجابتك بتنسيق Markdown.",
                () => {
                    const prodType = document.getElementById('price-prod-type').value;
                    const targetMarket = document.getElementById('price-target-market').value;
                    return `نوع المنتج/الفئة: ${prodType}\nشريحة السوق المستهدفة: ${targetMarket}`;
                }
            );

            // 10. Profitability Analysis (Financial Analysis Card)
            setupAnalyzationButton('analyze-profit-btn', 'profit-output',
                "أنت خبير في تحليل الربحية. بناءً على التكاليف المقدرة، السعر المقترح، وحجم المبيعات المتوقع، قدم تحليلاً أولياً للربحية المتوقعة. اذكر العوامل الرئيسية التي ستؤثر على نقطة التعادل، هامش الربح، والعائد على الاستثمار المحتمل. قم بحسابات بسيطة إذا كانت البيانات تسمح. قدم إجابتك بتنسيق Markdown.",
                () => {
                    const costs = document.getElementById('profit-costs').value;
                    const price = document.getElementById('profit-price').value;
                    const salesVolume = document.getElementById('profit-sales').value;
                    return `التكاليف المقدرة: ${costs}\nالسعر المقترح: ${price}\nحجم المبيعات المتوقع (فترة أولية): ${salesVolume}`;
                }
            );

            // --- INTERACTIVE DEMO TABS ---
            // Demo - Invention Evaluation
            setupAnalyzationButton('analyze-invention-demo-btn', 'invention-demo-result .result-content', // Target inner div
                "أنت خبير في تقييم الاختراعات (وضع تجريبي). قم بتقييم الاختراع التالي بناءً على الاسم، القطاع، الوصف، ومستوى الجاهزية التكنولوجية (TRL). قدم تقييمًا موجزًا يتضمن درجة ابتكار تقديرية (من 100)، قابلية التطبيق التجاري (منخفضة، متوسطة، عالية)، وتوصيات عامة. قدم إجابتك بتنسيق Markdown.",
                () => {
                    const inventionName = document.getElementById('demo-inv-name').value;
                    const sector = document.getElementById('demo-inv-sector').value;
                    const description = document.getElementById('demo-inv-desc').value;
                    const trl = document.getElementById('trl-range').value;
                    const resultDiv = document.getElementById('invention-demo-result');
                    if (resultDiv) resultDiv.classList.add('active');
                    return `اسم الاختراع: ${inventionName}\nالقطاع: ${sector}\nالوصف: ${description}\nTRL: ${trl}`;
                }
            );

            // Demo - Investment Analysis
            setupAnalyzationButton('analyze-investment-demo-btn', 'investment-demo-result .result-content',
                "أنت مستشار استثماري يعمل بالذكاء الاصطناعي (وضع تجريبي). بناءً على قطاع الاستثمار، مبلغ الاستثمار، ومستوى تحمل المخاطر، قدم تحليلاً موجزاً لفرصة استثمارية محتملة في هذا القطاع. اذكر الفرص والتحديات الرئيسية بشكل عام. قدم إجابتك بتنسيق Markdown.",
                () => {
                    const sector = document.getElementById('demo-investor-sector').value;
                    const amount = document.getElementById('demo-investor-amount').value;
                    const riskTolerance = document.getElementById('demo-investor-risk').value;
                    const resultDiv = document.getElementById('investment-demo-result');
                    if (resultDiv) resultDiv.classList.add('active');
                    return `قطاع الاستثمار: ${sector}\nمبلغ الاستثمار: ${amount}\nتحمل المخاطر: ${riskTolerance}`;
                }
            );

            // Demo - Market Analysis
            setupAnalyzationButton('analyze-market-demo-btn', 'market-demo-result .result-content',
                "أنت محلل سوق يعمل بالذكاء الاصطناعي (وضع تجريبي). قم بتحليل السوق/الصناعة المحددة مع التركيز على المنتج/الخدمة. قدم نظرة عامة على حجم السوق المحتمل (تقديري)، الاتجاهات الرئيسية، والمنافسة العامة. قدم إجابتك بتنسيق Markdown.",
                () => {
                    const marketIndustry = document.getElementById('demo-market-industry').value;
                    const productService = document.getElementById('demo-market-product').value;
                    const resultDiv = document.getElementById('market-demo-result');
                    if (resultDiv) resultDiv.classList.add('active');
                    return `السوق/الصناعة: ${marketIndustry}\nالمنتج/الخدمة الرئيسية: ${productService}`;
                }
            );

            // Language Toggle Placeholder
            const langToggleBtn = document.querySelector('.language-toggle');
            if (langToggleBtn) {
                langToggleBtn.addEventListener('click', () => {
                    // Implement language switching logic here
                    // This could involve:
                    // 1. Reloading the page with a language query parameter (e.g., ?lang=en)
                    // 2. Using a client-side localization library (e.g., i18next) to swap text content
                    alert('سيتم تنفيذ وظيفة تبديل اللغة هنا.');
                    if (document.documentElement.lang === 'ar') {
                        // Switch to English (example)
                        // window.location.href = window.location.pathname + '?lang=en';
                        langToggleBtn.textContent = 'العربية';
                    } else {
                        // Switch to Arabic (example)
                        // window.location.href = window.location.pathname + '?lang=ar';
                        langToggleBtn.textContent = 'English';
                    }
                });
            }

            // Mobile Menu Toggle
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navLinks = document.querySelector('.nav-links');
            if (mobileMenuBtn && navLinks) {
                mobileMenuBtn.addEventListener('click', () => {
                    navLinks.classList.toggle('show');
                    mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
                    mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
                });
            }

        });