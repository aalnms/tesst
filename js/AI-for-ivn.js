        // IMPORTANT: Storing API keys directly in client-side code is insecure for production.
        // This should be handled via a backend proxy in a real application.
        const GEMINI_API_KEY = "AIzaSyCG7Bwr3SFikwvFLhX2HZsAjqgEQIFx7DE"; // Replace with your actual API key
        const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;

        async function callGeminiAPI(systemPrompt, userContent, outputElement, buttonElement) {
            if (!userContent || userContent.trim() === "") {
                outputElement.innerHTML = '<p style="color: orange;">الرجاء إدخال البيانات المطلوبة.</p>';
                return;
            }

            const originalButtonText = buttonElement.innerHTML;
            buttonElement.innerHTML = 'جاري التحليل... <div class="loading-spinner"></div>';
            buttonElement.disabled = true;
            outputElement.innerHTML = '<p class="loading-text">جاري معالجة طلبك بواسطة الذكاء الاصطناعي...</p>';

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

            try {
                const response = await fetch(GEMINI_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Gemini API Error:', errorData);
                    throw new Error(`API Error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
                }

                const data = await response.json();
                
                if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                    // Sanitize output - basic example, consider a more robust library for production
                    let textContent = data.candidates[0].content.parts[0].text;
                    textContent = textContent.replace(/</g, "<").replace(/>/g, ">"); // Basic HTML sanitization
                    outputElement.innerHTML = textContent;
                } else if (data.promptFeedback && data.promptFeedback.blockReason) {
                     outputElement.innerHTML = `<p style="color: red;">تم حظر الطلب بسبب: ${data.promptFeedback.blockReason}. يرجى تعديل المدخلات والمحاولة مرة أخرى.</p>`;
                     if (data.promptFeedback.safetyRatings) {
                         outputElement.innerHTML += `<pre>${JSON.stringify(data.promptFeedback.safetyRatings, null, 2)}</pre>`;
                     }
                }
                else {
                    console.warn('Unexpected API response structure:', data);
                    outputElement.innerHTML = '<p style="color: orange;">تم استلام رد غير متوقع من الواجهة البرمجية. يرجى المحاولة لاحقاً.</p>';
                }

            } catch (error) {
                console.error('Error calling Gemini API:', error);
                outputElement.innerHTML = `<p style="color: red;">حدث خطأ أثناء الاتصال بالواجهة البرمجية: ${error.message}. يرجى المحاولة مرة أخرى أو التأكد من صلاحية مفتاح API.</p>`;
            } finally {
                buttonElement.innerHTML = originalButtonText;
                buttonElement.disabled = false;
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
                const numParticles = Math.min(200, Math.floor(canvas.width / 3)); // Adjust particle count
                const connectionDistance = Math.min(100, canvas.width / 5);
                const maxConnections = 5;
                const center_x = canvas.width / 2;
                const center_y = canvas.height / 2;
                const max_radius = Math.min(center_x, center_y) * 0.7;


                for (let i = 0; i < numParticles; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = (max_radius * 0.6) + Math.random() * (max_radius * 0.4);
                    const x = center_x + Math.cos(angle) * radius * (0.8 + Math.sin(angle * 3) * 0.3);
                    const y = center_y + Math.sin(angle) * radius * (0.8 + Math.sin(angle * 2) * 0.2);
                    
                    particles.push({
                        x, y,
                        size: 1 + Math.random() * 2,
                        speedX: (Math.random() - 0.5) * 0.5,
                        speedY: (Math.random() - 0.5) * 0.5,
                        color: `rgba(33, 150, 243, ${0.3 + Math.random() * 0.7})`,
                        connections: 0,
                        pulse: Math.random() * Math.PI * 2
                    });
                }

                function animateBrain() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    for (let i = 0; i < particles.length; i++) {
                        const p = particles[i];
                        p.pulse += 0.02;
                        const pulseFactor = (Math.sin(p.pulse) + 1) * 0.5;
                        p.x += p.speedX;
                        p.y += p.speedY;
                        const distFromCenter = Math.sqrt(Math.pow(p.x - center_x, 2) + Math.pow(p.y - center_y, 2));
                        if (distFromCenter > max_radius * 1.1) { // Push back if too far
                            const angleToCenter = Math.atan2(center_y - p.y, center_x - p.x);
                            p.speedX += Math.cos(angleToCenter) * 0.1;
                            p.speedY += Math.sin(angleToCenter) * 0.1;
                        }
                        if (p.x < 0 || p.x > canvas.width) p.speedX *= -0.8; // Bounce with damping
                        if (p.y < 0 || p.y > canvas.height) p.speedY *= -0.8;

                        p.speedX *= 0.99; p.speedY *= 0.99;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size * (0.7 + pulseFactor * 0.5), 0, Math.PI * 2);
                        ctx.fillStyle = p.color;
                        ctx.fill();
                        p.connections = 0;
                    }
                    ctx.lineWidth = 0.5;
                    for (let i = 0; i < particles.length; i++) {
                        const p1 = particles[i];
                        for (let j = i + 1; j < particles.length; j++) {
                            const p2 = particles[j];
                            if (p1.connections >= maxConnections || p2.connections >= maxConnections) continue;
                            const dx = p1.x - p2.x; const dy = p1.y - p2.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            if (distance < connectionDistance) {
                                const opacity = (1 - distance / connectionDistance) * 0.8;
                                ctx.strokeStyle = `rgba(33, 150, 243, ${opacity})`;
                                ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                                p1.connections++; p2.connections++;
                            }
                        }
                    }
                    requestAnimationFrame(animateBrain);
                }
                animateBrain();
            }


            // TRL Range Slider
            const trlRange = document.getElementById('trl-range');
            const trlValue = document.getElementById('trl-value');
            if (trlRange && trlValue) {
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
                        item.classList.toggle('active');
                    });
                }
            });

            // Popup functionality
            const popupCloseIcon = document.getElementById('popup-close-icon');
            const popupCloseBtn = document.getElementById('popup-close-btn');
            const popup = document.getElementById('demo-popup');

            function closePopup() {
                if (popup) popup.style.display = 'none';
            }
            if (popupCloseIcon) popupCloseIcon.addEventListener('click', closePopup);
            if (popupCloseBtn) popupCloseBtn.addEventListener('click', closePopup);


            // --- GEMINI API INTEGRATIONS ---

            // 1. Invention Evaluation (Card)
            const invEvalBtn = document.getElementById('analyze-inv-eval-btn');
            if (invEvalBtn) {
                invEvalBtn.addEventListener('click', () => {
                    const name = document.getElementById('inv-eval-name').value;
                    const sector = document.getElementById('inv-eval-sector').value;
                    const desc = document.getElementById('inv-eval-desc').value;
                    const outputEl = document.getElementById('inv-eval-output');
                    const systemPrompt = "أنت خبير في تقييم الاختراعات. قم بتقييم الاختراع التالي بناءً على الاسم والقطاع والوصف. قدم تقييمًا يتضمن نقاط القوة والضعف، تصنيف الاختراع، مقارنة مبدئية مع اختراعات مشابهة، وتقدير أولي للقيمة السوقية المحتملة. كن مفصلاً وواقعياً.";
                    const userContent = `بيانات الاختراع:\nالاسم: ${name}\nالقطاع: ${sector}\nالوصف: ${desc}`;
                    callGeminiAPI(systemPrompt, userContent, outputEl, invEvalBtn);
                });
            }

            // 2. Documentation Improvement (Card)
            const docImprvBtn = document.getElementById('analyze-doc-imprv-btn');
            if (docImprvBtn) {
                docImprvBtn.addEventListener('click', () => {
                    const docText = document.getElementById('doc-imprv-text').value;
                    const outputEl = document.getElementById('doc-imprv-output');
                    const systemPrompt = "أنت خبير في تحسين توثيق الاختراعات. قم بتحليل نص توثيق الاختراع التالي واقترح تحسينات لغوية وتقنية لزيادة وضوحه وجاذبيته. ركز على نقاط القوة والضعف في التوثيق الحالي، واقتراحات لتحسين الوصف، وإضافة مصطلحات تقنية مناسبة إذا لزم الأمر. قدم الاقتراحات في شكل نقاط واضحة.";
                    const userContent = `نص التوثيق:\n${docText}`;
                    callGeminiAPI(systemPrompt, userContent, outputEl, docImprvBtn);
                });
            }
            
            // 3. Market Analysis for Inventors (Card)
            const marketInvBtn = document.getElementById('analyze-market-inv-btn');
            if (marketInvBtn) {
                marketInvBtn.addEventListener('click', () => {
                    const sector = document.getElementById('market-inv-sector').value;
                    const audience = document.getElementById('market-inv-audience').value;
                    const outputEl = document.getElementById('market-inv-output');
                    const systemPrompt = "أنت خبير في تحليل الأسواق للمخترعين. قم بتحليل السوق المستهدف لاختراع في القطاع المحدد (مع التركيز على الجمهور المستهدف إذا تم تحديده). قدم تحليلاً يتضمن حجم السوق المستهدف المحتمل، المنافسين الرئيسيين، اتجاهات السوق، وتقدير للتكلفة والعائد المحتمل بشكل عام. كن شاملاً وقدم أرقامًا تقديرية إذا أمكن.";
                    const userContent = `بيانات التحليل:\nقطاع الاختراع: ${sector}\nالجمهور المستهدف (اختياري): ${audience || 'عام'}`;
                    callGeminiAPI(systemPrompt, userContent, outputEl, marketInvBtn);
                });
            }

            // 4. Smart Recommendations for Investors (Card)
            const recoBtn = document.getElementById('analyze-reco-btn');
            if (recoBtn) {
                recoBtn.addEventListener('click', () => {
                    const interests = document.getElementById('reco-interests').value;
                    const profile = document.getElementById('reco-profile').value;
                    const outputEl = document.getElementById('reco-output');
                    const systemPrompt = "أنت نظام توصيات ذكي للمستثمرين. بناءً على اهتمامات المستثمر وملفه الاستثماري، اقترح أنواعًا من الاختراعات أو قطاعات واعدة قد تكون مناسبة للاستثمار. صف لماذا هذه التوصيات قد تكون جذابة وقدم أمثلة إذا أمكن.";
                    const userContent = `اهتمامات المستثمر: ${interests}\nالملف الاستثماري السابق (موجز): ${profile}`;
                    callGeminiAPI(systemPrompt, userContent, outputEl, recoBtn);
                });
            }
            
            // 5. Risk Analysis for Investors (Card)
            const riskBtn = document.getElementById('analyze-risk-btn');
            if (riskBtn) {
                riskBtn.addEventListener('click', () => {
                    const invDesc = document.getElementById('risk-inv-desc').value;
                    const invAmount = document.getElementById('risk-inv-amount').value;
                    const outputEl = document.getElementById('risk-output');
                    const systemPrompt = "أنت خبير في تحليل المخاطر الاستثمارية في الاختراعات. قم بتقييم المخاطر المحتملة للاستثمار في اختراع بالوصف ومبلغ الاستثمار المحددين. حدد عوامل المخاطرة الرئيسية (تقنية، سوقية، مالية، تشغيلية)، وقدم تقييمًا نوعيًا للمخاطر، واقترح استراتيجيات عامة للتخفيف منها.";
                    const userContent = `وصف الاختراع/الفرصة: ${invDesc}\nمبلغ الاستثمار: ${invAmount}`;
                    callGeminiAPI(systemPrompt, userContent, outputEl, riskBtn);
                });
            }

            // 6. Market Analysis for Investors (Card)
            const marketInvestorBtn = document.getElementById('analyze-market-investor-btn');
            if (marketInvestorBtn) {
                marketInvestorBtn.addEventListener('click', () => {
                    const sector = document.getElementById('market-investor-sector').value;
                    const outputEl = document.getElementById('market-investor-output');
                    const systemPrompt = "أنت خبير في تحليل الأسواق للمستثمرين. قم بتقديم تحليل سوق متعمق للقطاع المحدد. ركز على توقعات النمو، المنافسين الرئيسيين، إمكانات التوسع، والفرص الاستثمارية البارزة في هذا القطاع. استخدم بيانات وأمثلة لدعم تحليلك.";
                    const userContent = `قطاع الاهتمام: ${sector}`;
                    callGeminiAPI(systemPrompt, userContent, outputEl, marketInvestorBtn);
                });
            }

            // 7. Match System
            const matchBtn = document.getElementById('analyze-match-btn');
            if (matchBtn) {
                matchBtn.addEventListener('click', () => {
                    const inventorProfile = document.getElementById('match-inventor-field').value;
                    const investorProfile = document.getElementById('match-investor-interest').value;
                    const outputEl = document.getElementById('match-output');
                    const systemPrompt = "أنت نظام مطابقة ذكي بين المخترعين والمستثمرين. بناءً على ملف المخترع وملف المستثمر، قم بتحليل مدى التوافق بينهما (مثلاً: منخفض، متوسط، عالي). اشرح أسباب المطابقة المحتملة أو عدمها، وركز على نقاط الالتقاء والاختلاف الرئيسية.";
                    const userContent = `ملف المخترع:\n${inventorProfile}\n\nملف المستثمر:\n${investorProfile}`;
                    callGeminiAPI(systemPrompt, userContent, outputEl, matchBtn);
                });
            }

            // 8. Cost Estimation (Financial Analysis Card)
            const costBtn = document.getElementById('analyze-cost-btn');
            if (costBtn) {
                costBtn.addEventListener('click', () => {
                    const invType = document.getElementById('cost-inv-type').value;
                    const complexity = document.getElementById('cost-complexity').value;
                    const scale = document.getElementById('cost-scale').value;
                    const outputEl = document.getElementById('cost-output');
                    const systemPrompt = "أنت خبير في تقدير تكاليف تصنيع الاختراعات. قم بتقدير عام لتكاليف التصنيع (مع ذكر العوامل المؤثرة مثل المواد، العمالة، التطوير، التسويق الأولي) لاختراع من النوع والتعقيد ونطاق الإنتاج المحدد. قدم نطاقًا تقديريًا للتكاليف إذا أمكن.";
                    const userContent = `بيانات التقدير:\nنوع الاختراع: ${invType}\nالتعقيد: ${complexity}\nنطاق الإنتاج: ${scale}`;
                    callGeminiAPI(systemPrompt, userContent, outputEl, costBtn);
                });
            }

            // 9. Pricing Models (Financial Analysis Card)
            const priceBtn = document.getElementById('analyze-price-btn');
            if (priceBtn) {
                priceBtn.addEventListener('click', () => {
                    const prodType = document.getElementById('price-prod-type').value;
                    const targetMarket = document.getElementById('price-target-market').value;
                    const outputEl = document.getElementById('price-output');
                    const systemPrompt = "أنت خبير في استراتيجيات التسعير. اقترح 2-3 نماذج تسعير متعددة ومناسبة للمنتج الذي يستهدف شريحة السوق المحددة. اشرح مزايا وعيوب كل نموذج مقترح في هذا السياق، وقدم مثالاً توضيحيًا لكل نموذج.";
                    const userContent = `نوع المنتج/الفئة: ${prodType}\nشريحة السوق المستهدفة: ${targetMarket}`;
                    callGeminiAPI(systemPrompt, userContent, outputEl, priceBtn);
                });
            }

            // 10. Profitability Analysis (Financial Analysis Card)
            const profitBtn = document.getElementById('analyze-profit-btn');
            if (profitBtn) {
                profitBtn.addEventListener('click', () => {
                    const costs = document.getElementById('profit-costs').value;
                    const price = document.getElementById('profit-price').value;
                    const salesVolume = document.getElementById('profit-sales').value;
                    const outputEl = document.getElementById('profit-output');
                    const systemPrompt = "أنت خبير في تحليل الربحية. بناءً على التكاليف المقدرة، السعر المقترح، وحجم المبيعات المتوقع، قدم تحليلاً أولياً للربحية المتوقعة. اذكر العوامل الرئيسية التي ستؤثر على نقطة التعادل، هامش الربح، والعائد على الاستثمار المحتمل. قم بحسابات بسيطة إذا كانت البيانات تسمح.";
                    const userContent = `التكاليف المقدرة: ${costs}\nالسعر المقترح: ${price}\nحجم المبيعات المتوقع (فترة أولية): ${salesVolume}`;
                    callGeminiAPI(systemPrompt, userContent, outputEl, profitBtn);
                });
            }

            // --- INTERACTIVE DEMO TABS ---
            // Demo - Invention Evaluation
            const analyzeInventionDemoBtn = document.getElementById('analyze-invention-demo-btn');
            if (analyzeInventionDemoBtn) {
                analyzeInventionDemoBtn.addEventListener('click', function() {
                    const inventionName = document.getElementById('demo-inv-name').value;
                    const sector = document.getElementById('demo-inv-sector').value;
                    const description = document.getElementById('demo-inv-desc').value;
                    const trl = document.getElementById('trl-range').value;
                    const resultDiv = document.getElementById('invention-demo-result');
                    const resultCtx = resultDiv.querySelector('.result-content');

                    resultDiv.classList.add('active'); // Show result container
                    
                    const systemPrompt = "أنت خبير في تقييم الاختراعات (وضع تجريبي). قم بتقييم الاختراع التالي بناءً على الاسم، القطاع، الوصف، ومستوى الجاهزية التكنولوجية (TRL). قدم تقييمًا موجزًا يتضمن درجة ابتكار تقديرية (من 100)، قابلية التطبيق التجاري (منخفضة، متوسطة، عالية)، وتوصيات عامة.";
                    const userContent = `اسم الاختراع: ${inventionName}\nالقطاع: ${sector}\nالوصف: ${description}\nTRL: ${trl}`;
                    
                    callGeminiAPI(systemPrompt, userContent, resultCtx, analyzeInventionDemoBtn);
                });
            }

            // Demo - Investment Analysis
            const analyzeInvestmentDemoBtn = document.getElementById('analyze-investment-demo-btn');
            if (analyzeInvestmentDemoBtn) {
                analyzeInvestmentDemoBtn.addEventListener('click', function() {
                    const sector = document.getElementById('demo-investor-sector').value;
                    const amount = document.getElementById('demo-investor-amount').value;
                    const riskTolerance = document.getElementById('demo-investor-risk').value;
                    const resultDiv = document.getElementById('investment-demo-result');
                    const resultCtx = resultDiv.querySelector('.result-content');

                    resultDiv.classList.add('active');

                    const systemPrompt = "أنت مستشار استثماري يعمل بالذكاء الاصطناعي (وضع تجريبي). بناءً على قطاع الاستثمار، مبلغ الاستثمار، ومستوى تحمل المخاطر، قدم تحليلاً موجزاً لفرصة استثمارية محتملة في هذا القطاع. اذكر الفرص والتحديات الرئيسية بشكل عام.";
                    const userContent = `قطاع الاستثمار: ${sector}\nمبلغ الاستثمار: ${amount}\nتحمل المخاطر: ${riskTolerance}`;
                    
                    callGeminiAPI(systemPrompt, userContent, resultCtx, analyzeInvestmentDemoBtn);
                });
            }

            // Demo - Market Analysis
            const analyzeMarketDemoBtn = document.getElementById('analyze-market-demo-btn');
            if (analyzeMarketDemoBtn) {
                analyzeMarketDemoBtn.addEventListener('click', function() {
                    const marketIndustry = document.getElementById('demo-market-industry').value;
                    const productService = document.getElementById('demo-market-product').value;
                    const resultDiv = document.getElementById('market-demo-result');
                    const resultCtx = resultDiv.querySelector('.result-content');

                    resultDiv.classList.add('active');

                    const systemPrompt = "أنت محلل سوق يعمل بالذكاء الاصطناعي (وضع تجريبي). قم بتحليل السوق/الصناعة المحددة مع التركيز على المنتج/الخدمة. قدم نظرة عامة على حجم السوق المحتمل (تقديري)، الاتجاهات الرئيسية، والمنافسة العامة.";
                    const userContent = `السوق/الصناعة: ${marketIndustry}\nالمنتج/الخدمة الرئيسية: ${productService}`;
                    
                    callGeminiAPI(systemPrompt, userContent, resultCtx, analyzeMarketDemoBtn);
                });
            }

        });