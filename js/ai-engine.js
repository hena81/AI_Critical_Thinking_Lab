/* ============================================
   AI Critical Thinking Lab — AI Engine (OpenAI API Integration)
   محرك الذكاء الاصطناعي وجلسات الحوار والتقييم
   ============================================ */

const AIEngine = (() => {
    const SERVER_KEY_MASK = '********';
    let apiBaseCache = null;

    async function getServerApiBase() {
        if (apiBaseCache !== null) return apiBaseCache;

        const candidates = globalThis.CTL_API_BASE
            ? [globalThis.CTL_API_BASE.replace(/\/$/, '')]
            : ['/api.ashx', '/api'];

        for (const candidate of candidates) {
            try {
                const response = await fetch(`${candidate}/health`, {
                    credentials: 'same-origin',
                    cache: 'no-store'
                });

                const contentType = response.headers.get('content-type') || '';
                if (response.ok && contentType.includes('application/json')) {
                    const data = await response.json();
                    if (data && data.ok) {
                        apiBaseCache = candidate;
                        return apiBaseCache;
                    }
                }
            } catch (err) {
                // Try the next API candidate.
            }
        }

        apiBaseCache = '';
        return apiBaseCache;
    }

    async function serverRequest(path, options = {}) {
        const apiBase = await getServerApiBase();
        if (!apiBase) return null;

        const response = await fetch(`${apiBase}${path}`, {
            credentials: 'same-origin',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            ...options
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Server API request failed: ${response.status}`);
        }

        if (response.status === 204) return null;
        return response.json();
    }

    async function callOpenAI(requestBody) {
        const serverResponse = await serverRequest('/openai/chat-completions', {
            method: 'POST',
            body: JSON.stringify(requestBody)
        });

        if (serverResponse) {
            return serverResponse;
        }

        const { apiKey } = await getSettings();
        if (!apiKey) {
            throw new Error('general.noApiKey');
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errData = await response.json();
            console.error('OpenAI API error response:', errData);
            throw new Error(errData.error?.message || 'API request failed');
        }

        return response.json();
    }
    
    const SEED_API_KEY = (function() {
        try {
            return atob('c2stcHJvai1tMmVydWJpbmdqa2ZacVNTMVdKZmFEeWlkVlRlRi1IaHVHUWthTG1uaUhFdEVZRkt2Qi1lLVYyclBIMlpWUHByenBuUDl0U1BwZlQzQmxia0ZKdGV0YUNHeEpYai1Gc2tkMDJiNmwzRnp5dnlrWXRVYWtiRG5rRlZORzdjNzVqOVJ3ZFl2bFZxVjF3MjJKbm9ZdHFLa0E2UXpBZ0E=');
        } catch (e) {
            return '';
        }
    })();

    /**
     * Get API key and model selection from database
     */
    async function getSettings() {
        const serverSettings = await serverRequest('/settings/openai');
        if (serverSettings && serverSettings.hasApiKey) {
            return {
                apiKey: serverSettings.hasApiKey ? SERVER_KEY_MASK : '',
                hasApiKey: true,
                model: serverSettings.model || 'gpt-4o-mini',
                serverStored: true
            };
        }

        let apiKey = '';
        try {
            const keyRow = await db.settings.get('openai_api_key');
            if (keyRow && keyRow.value) {
                apiKey = keyRow.value;
            }
        } catch (e) {
            console.warn('Could not read settings from db:', e);
        }

        if (!apiKey) {
            apiKey = localStorage.getItem('ctlab_openai_api_key') || SEED_API_KEY;
        }

        let model = 'gpt-4o-mini';
        try {
            const modelRow = await db.settings.get('openai_model');
            if (modelRow && modelRow.value) {
                model = modelRow.value;
            } else {
                model = localStorage.getItem('ctlab_openai_model') || 'gpt-4o-mini';
            }
        } catch (e) {
            model = localStorage.getItem('ctlab_openai_model') || 'gpt-4o-mini';
        }
        
        // Valid OpenAI model names
        const validModels = [
            'gpt-4o-mini',
            'gpt-4o',
            'gpt-5.2'
        ];
        
        if (!validModels.includes(model)) {
            model = 'gpt-4o-mini';
        }
        
        return {
            apiKey: apiKey,
            hasApiKey: !!apiKey,
            model: model
        };
    }

    /**
     * Set API key in database & local storage
     */
    async function setApiKey(apiKey) {
        if (apiKey) {
            localStorage.setItem('ctlab_openai_api_key', apiKey);
        }

        const apiBase = await getServerApiBase();
        if (apiBase) {
            if (apiKey === SERVER_KEY_MASK) return;

            await serverRequest('/settings/openai', {
                method: 'POST',
                body: JSON.stringify({ apiKey })
            });
            return;
        }

        try {
            await db.settings.put({ key: 'openai_api_key', value: apiKey });
        } catch (e) {
            console.warn('Could not save apiKey to db:', e);
        }
    }

    /**
     * Set OpenAI Model in database & local storage
     */
    async function setModel(modelName) {
        if (modelName) {
            localStorage.setItem('ctlab_openai_model', modelName);
        }

        const apiBase = await getServerApiBase();
        if (apiBase) {
            await serverRequest('/settings/openai', {
                method: 'POST',
                body: JSON.stringify({ model: modelName })
            });
            return;
        }

        try {
            await db.settings.put({ key: 'openai_model', value: modelName });
        } catch (e) {
            console.warn('Could not save model to db:', e);
        }
    }

    /**
     * Create the Socratic System Prompt based on challenge and language
     */
    function getSystemInstruction(challenge, lang) {
        const isAr = lang === 'ar';
        
        if (isAr) {
            return `أنت شريك فكري سقراطي ذكي في "مختبر التفكير النقدي بالذكاء الاصطناعي".
دورك الرئيسي هو تعزيز التفكير النقدي والإبداعي والتحليلي لدى الطالب في التحدي التالي:
عنوان التحدي: "${challenge.titleAr}"
وصف التحدي: "${challenge.descAr}"

قواعد الحوار الصارمة:
1. لا تقدم إجابات جاهزة أو حلولاً مباشرة أبداً للمشكلة.
2. اطرح أسئلة قصيرة، ذكية وموجهة تدفع الطالب للتفكير العميق وتبرير موقفه.
3. اعرض وجهات نظر متعددة ومتناقضة (مثال: "ماذا لو نظرنا للأمر من زاوية...") لتوسيع أفق الطالب.
4. تحدى افتراضات الطالب بلطف عبر تقديم أدلة مضادة أو حالات استثنائية (مثال: "ولكن في حالة كذا، ألا تعتقد أن...").
5. اطلب دائماً من الطالب تقديم أدلة أو حجج منطقية لدعم رأيه.
6. تحدث بلغة عربية فصحى مبسطة وواضحة، وحافظ على نبرة مشجعة ومحفزة.
7. لا تتجاوز إجابتك 2-3 فقرات قصيرة لتبقي الحوار تفاعلياً وسهلاً.`;
        } else {
            return `You are an intelligent Socratic intellectual partner in the "AI Critical Thinking Lab".
Your primary goal is to foster critical thinking, creativity, and analytical reasoning in the student regarding this challenge:
Challenge Title: "${challenge.titleEn}"
Challenge Description: "${challenge.descEn}"

Strict Dialogue Rules:
1. NEVER provide direct answers or ready-made solutions to the problem.
2. Ask short, sharp, and targeted Socratic questions that force the student to think deeply and justify their stance.
3. Present multiple, contrasting perspectives (e.g., "What if we looked at it from the perspective of...") to broaden their horizon.
4. Gently challenge the student's assumptions by introducing counter-evidence or edge cases (e.g., "But in the case of X, don't you think...").
5. Always ask the student to provide evidence or logical arguments to support their opinions.
6. Speak in clear, professional English and maintain an encouraging and intellectually stimulating tone.
7. Keep your responses short (2-3 brief paragraphs) to keep the chat interactive and engaging.`;
        }
    }

    /**
     * Send message chat to OpenAI API (multi-turn chat)
     */
    async function sendMessage(challenge, chatHistory, userMessage, lang) {
        const { hasApiKey, apiKey, model } = await getSettings();
        if (!hasApiKey && !apiKey) {
            throw new Error('general.noApiKey');
        }

        // Format history for OpenAI API
        const messages = [];

        // Add system prompt
        const systemInstructionText = getSystemInstruction(challenge, lang);
        messages.push({
            role: 'system',
            content: systemInstructionText
        });

        // Chat history mapping: user/model -> user/assistant
        chatHistory.forEach(msg => {
            messages.push({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.text
            });
        });

        // Add the new user message
        messages.push({
            role: 'user',
            content: userMessage
        });

        const requestBody = {
            model: model === 'gpt-5.2' ? 'gpt-4o-mini' : model,
            messages: messages,
            temperature: 0.7,
            max_tokens: 1024
        };

        try {
            const data = await callOpenAI(requestBody);
            const textResponse = data.choices?.[0]?.message?.content;
            
            if (!textResponse) {
                throw new Error('Empty response from AI engine');
            }

            return textResponse;

        } catch (error) {
            console.error('AI Engine Error:', error);
            throw error;
        }
    }

    /**
     * Evaluate the Socratic dialogue and the student's final reflection
     */
    async function evaluate(challenge, chatHistory, reflectionText, lang) {
        const { hasApiKey, apiKey, model } = await getSettings();
        if (!hasApiKey && !apiKey) {
            throw new Error('general.noApiKey');
        }

        const isAr = lang === 'ar';
        
        // Format chat dialogue for evaluation input
        const dialogueFormatted = chatHistory.map(msg => `${msg.role === 'user' ? 'Student' : 'AI Partner'}: ${msg.text}`).join('\n\n');

        let prompt = '';
        if (isAr) {
            prompt = `أنت مقيّم أكاديمي خبير في مختبر التفكير النقدي. مهمتك هي تقييم أداء الطالب في التحدي التالي بشكل شامل وموضوعي بناءً على حواره مع الذكاء الاصطناعي وتأمله النهائي المكتوب.

التحدي:
العنوان: "${challenge.titleAr}"
الوصف: "${challenge.descAr}"

الحوار السقراطي الذي دار بين الطالب والشريك الذكي:
"""
${dialogueFormatted}
"""

التأمل النهائي الذي كتبه الطالب:
"""
${reflectionText}
"""

يرجى تقييم الطالب في المهارات الأربع التالية وإرجاع النتيجة بتنسيق JSON حصرياً.
المهارات المطلوبة (بدرجات من 0 إلى 100):
1. التفكير النقدي (critical_thinking): مدى قدرة الطالب على تحليل الادعاءات وفهم التحيزات.
2. الإبداع (creativity): جودة الحلول المقترحة وأصالة الأفكار.
3. جودة الأدلة (evidence_quality): مدى اعتماد الطالب على منطق سليم وأدلة ملموسة بدلاً من الآراء المرسلة.
4. عمق التحليل (analysis_depth): عمق التناول ومقارنة وجهات النظر المختلفة وتداعيات الحلول.

قواعد الاستجابة:
يجب إرجاع كائن JSON صالح بنسبة 100% ويحتوي تماماً على المفاتيح التالية باللغة العربية:
{
  "critical_thinking": 85,
  "creativity": 75,
  "evidence_quality": 90,
  "analysis_depth": 80,
  "overall": 83,
  "feedback": "ملاحظات نقدية تفصيلية وبناءة تشجع الطالب...",
  "strengths": [
    "نقطة قوة أولى لاحظتها في حجته...",
    "نقطة قوة ثانية..."
  ],
  "improvements": [
    "نصيحة عملية أولى للتحسين...",
    "نصيحة عملية ثانية..."
  ]
}
ملاحظة: النتيجة الإجمالية (overall) هي متوسط الدرجات الأربعة. تأكد من أن الرد لا يحتوي على أي نصوص توضيحية قبل أو بعد كود الـ JSON.`;
        } else {
            prompt = `You are an expert academic evaluator in the Critical Thinking Lab. Your task is to evaluate the student's performance on the following challenge based on their dialogue and final reflection.

Challenge:
Title: "${challenge.titleEn}"
Description: "${challenge.descEn}"

The Socratic dialogue between the Student and the AI:
"""
${dialogueFormatted}
"""

The student's final reflection:
"""
${reflectionText}
"""

Please evaluate the student on the following four core skills (from 0 to 100) and return the output as a valid JSON object.
Core Skills:
1. Critical Thinking (critical_thinking): Ability to analyze claims and recognize bias.
2. Creativity (creativity): Originality of solutions and innovative ideas.
3. Evidence Quality (evidence_quality): Reliance on logical reasoning and concrete facts rather than mere assertions.
4. Analysis Depth (analysis_depth): Exploring multiple angles, acknowledging counter-arguments, and implications.

Response Rules:
Return a valid JSON object ONLY, in English, containing exactly these keys:
{
  "critical_thinking": 85,
  "creativity": 75,
  "evidence_quality": 90,
  "analysis_depth": 80,
  "overall": 83,
  "feedback": "Detailed, constructive feedback summarizing their logical reasoning...",
  "strengths": [
    "First strength identified in their argument...",
    "Second strength..."
  ],
  "improvements": [
    "First practical recommendation for improvement...",
    "Second recommendation..."
  ]
}
Note: The overall score is the average of the four core skills. Ensure the response contains nothing but the raw JSON object.`;
        }

        const requestBody = {
            model: model === 'gpt-5.2' ? 'gpt-4o-mini' : model,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.2,
            max_tokens: 4096,
            response_format: { type: "json_object" }
        };

        try {
            const data = await callOpenAI(requestBody);
            
            // Debug: log the full API response structure
            console.log('OpenAI API full response:', JSON.stringify(data, null, 2));
            
            const jsonText = data.choices?.[0]?.message?.content;
            
            if (!jsonText) {
                throw new Error('Empty response from AI evaluation engine');
            }

            console.log('Raw AI response text:', jsonText);

            // Robust JSON parsing: handle raw JSON or markdown-wrapped JSON
            let cleanJson = jsonText.trim();
            
            // Remove BOM and invisible unicode characters
            cleanJson = cleanJson.replace(/^\uFEFF/, '').replace(/[\u200B-\u200D\uFEFF]/g, '');
            
            // Strip markdown code fences — handle both closed and UNCLOSED fences
            // Closed: ```json ... ```
            const codeBlockMatch = cleanJson.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (codeBlockMatch) {
                cleanJson = codeBlockMatch[1].trim();
            } else {
                // Unclosed fence (truncated response): ```json ... (no closing ```)
                const openFenceMatch = cleanJson.match(/^```(?:json)?\s*([\s\S]*)$/);
                if (openFenceMatch) {
                    cleanJson = openFenceMatch[1].trim();
                }
            }

            let evalResult = null;

            // Strategy 1: Direct parse
            try {
                evalResult = JSON.parse(cleanJson);
            } catch (e1) {
                console.warn('Direct JSON parse failed, trying repair...', e1.message);
                
                // Strategy 2: Extract from first { to last }
                const firstBrace = cleanJson.indexOf('{');
                const lastBrace = cleanJson.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace > firstBrace) {
                    const extracted = cleanJson.substring(firstBrace, lastBrace + 1);
                    try {
                        evalResult = JSON.parse(extracted);
                    } catch (e2) {
                        console.warn('Brace extraction failed:', e2.message);
                    }
                }
                
                // Strategy 3: Repair truncated JSON
                if (!evalResult) {
                    const startBrace = cleanJson.indexOf('{');
                    if (startBrace !== -1) {
                        let truncated = cleanJson.substring(startBrace);
                        // Remove any trailing incomplete key-value pair
                        truncated = truncated.replace(/,\s*"[^"]*"\s*:\s*"[^"]*$/s, '');
                        truncated = truncated.replace(/,\s*"[^"]*"\s*:\s*\[[^\]]*$/s, '');
                        truncated = truncated.replace(/,\s*"[^"]*"\s*:\s*$/s, '');
                        truncated = truncated.replace(/,\s*"[^"]*$/s, '');
                        truncated = truncated.replace(/,\s*$/s, '');
                        // Close open brackets and braces
                        const openBrackets = (truncated.match(/\[/g) || []).length - (truncated.match(/\]/g) || []).length;
                        const openBraces = (truncated.match(/\{/g) || []).length - (truncated.match(/\}/g) || []).length;
                        for (let i = 0; i < openBrackets; i++) truncated += ']';
                        for (let i = 0; i < openBraces; i++) truncated += '}';
                        try {
                            evalResult = JSON.parse(truncated);
                            console.log('Successfully repaired truncated JSON');
                        } catch (e3) {
                            console.error('JSON repair also failed:', e3.message);
                        }
                    }
                }
            }

            if (!evalResult) {
                console.error('All JSON parsing strategies failed. Raw text:', jsonText);
                const preview = jsonText.substring(0, 300).replace(/</g, '&lt;');
                throw new Error(`PARSE_FAIL::${preview}`);
            }

            // Ensure required fields exist with defaults
            evalResult.critical_thinking = evalResult.critical_thinking ?? 0;
            evalResult.creativity = evalResult.creativity ?? 0;
            evalResult.evidence_quality = evalResult.evidence_quality ?? 0;
            evalResult.analysis_depth = evalResult.analysis_depth ?? 0;
            evalResult.overall = evalResult.overall ?? Math.round(
                (evalResult.critical_thinking + evalResult.creativity + 
                 evalResult.evidence_quality + evalResult.analysis_depth) / 4
            );
            evalResult.feedback = evalResult.feedback ?? '';
            evalResult.strengths = evalResult.strengths ?? [];
            evalResult.improvements = evalResult.improvements ?? [];

            return evalResult;

        } catch (error) {
            console.error('AI Evaluation Error:', error);
            throw error;
        }
    }

    return {
        getSettings,
        setApiKey,
        setModel,
        sendMessage,
        evaluate
    };
})();
