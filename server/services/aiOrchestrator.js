const axios = require('axios');
const fal = require('@fal-ai/serverless-client');
const sharp = require('sharp');
const { cloudinary } = require('../config/cloudinary');
const { db } = require('../db');
const { users } = require('../db/schema');
const { eq } = require('drizzle-orm');

// Initialize Fal
fal.config({
    credentials: process.env.FAL_KEY,
});

/**
 * Localization Matrix
 * Maps Region preference to Visual Markers & Dialect style with real Syrian phrases.
 */
const LOCALIZATION_MATRIX = {
    'Modern': {
        name: 'سوريا العامة',
        visualMarkers: 'Modern aesthetics, bright studios, neutral backgrounds, subtle Arabesque patterns without specific landmarks.',
        dialect: 'العامية السورية البيضا - لهجة مفهومة لكل السوريين',
        dialectExamples: 'هاد، هيك، شو، كتير، منيح، يلا، خلص',
        samplePhrases: ['شو رأيك؟', 'كتير حلو', 'يلا جربو', 'منيح كتير'],
        keywords: 'modern, bright, studio lighting, subtle arabesque, neutral'
    },
    'Damascene': {
        name: 'دمشق الشام',
        visualMarkers: 'Jasmine flowers, Old City stone walls (Bab Touma style), Umayyad Mosque arches in background, Damascene courtyard (Ard Diar).',
        dialect: 'اللهجة الشامية الدمشقية - رقيقة ودافئة',
        dialectExamples: 'يا مو، طربني، تقبرني، على راسي، هلق، كيفك',
        samplePhrases: ['تقبرني شو حلو', 'على راسي', 'والله طربني', 'يا عيني عليك'],
        keywords: 'jasmine, old stone walls, arches, damascene courtyard, warm lighting'
    },
    'Aleppine': {
        name: 'حلب الشهباء',
        visualMarkers: 'Aleppo Citadel silhouette, grey stone architecture, laurel soap textures, rich/royal red accents, pistachios.',
        dialect: 'اللهجة الحلبية - أصيلة وقوية',
        dialectExamples: 'خيو، شلون، أبوس روحك، منيحة، كيفو، شو عم تعمل',
        samplePhrases: ['شلون خيو؟', 'والله منيحة', 'أبوس روحك', 'تكرم عينك'],
        keywords: 'grey stone, citadel silhouette, royal red, texture, ancient'
    },
    'Coastal': {
        name: 'الساحل السوري',
        visualMarkers: 'Sea/Mediterranean horizon, olive trees, mountains in background, blue and green color palette, humid/misty lighting.',
        dialect: 'اللهجة الساحلية - لطيفة وموسيقية',
        dialectExamples: 'يا عيني، شي كتير، موي، هيدا، شو في',
        samplePhrases: ['يا عيني شو حلو', 'هيدا كتير منيح', 'شي روعة'],
        keywords: 'sea, olive trees, mountains, blue and green, misty'
    },
    'Homs': {
        name: 'حمص',
        visualMarkers: 'Traditional Homsi architecture, warm earth tones, historical landmarks, cozy market vibes.',
        dialect: 'اللهجة الحمصية - خفيفة الدم وفكاهية',
        dialectExamples: 'هاي، كيفك خيي، عنجد، زاكي، شكون، وينك',
        samplePhrases: ['عنجد زاكي', 'هاي خيي كيفك', 'والله روعة', 'شكون هاد'],
        keywords: 'traditional, warm tones, homsi humor, cozy, market'
    },
    'Deir': {
        name: 'دير الزور والشرقية',
        visualMarkers: 'Desert aesthetics, Euphrates river, golden sand tones, tribal patterns, warm sunset lighting.',
        dialect: 'اللهجة الديرية الشرقية - أصيلة وقوية',
        dialectExamples: 'چا، شلونك، هواي، زين، شكو ماكو',
        samplePhrases: ['زين هواي', 'شلونك حبيبي', 'والله حلو'],
        keywords: 'desert, euphrates, golden, tribal, sunset'
    }
};

/**
 * Blacklisted words that should never appear in slogans
 */
const BLACKLISTED_WORDS = [
    "خطوات", "خطوتك", "واثقة", "ثقة", "جودة", "أفضل", "راحة", "أناقة", "تألق",
    "رائع", "مميز", "اختيار", "الأفضل", "بنحكي", "حكايتك", "بيحكي", "قصة",
    "حلم", "أحلام", "رحلة", "مسار", "درب", "نورك الطبيعي", "جمالك اختيارك",
    "سر الجمال", "عالم الجمال", "بشرة مثالية"
];

/**
 * Fallback slogans by category - clear, product-relevant phrases
 */
const FALLBACK_SLOGANS = {
    'shoes': ["امشي بكيفك", "ستايل ما بينتهي", "كل طلعة أحلى", "خفة ع الأرض"],
    'Shoes': ["امشي بكيفك", "ستايل ما بينتهي", "كل طلعة أحلى", "خفة ع الأرض"],
    'Watches': ["ساعتك بتحكي عنك", "الوقت بين إيديك", "دقة وأناقة", "لكل لحظة قيمة"],
    'Tech': ["قوة بإيدك", "سرعة فائقة", "تقنية ذكية", "أداء عالي"],
    'Food': ["طعمة ما بتنتسى", "لقمة تجنن", "زكي وطازج", "نكهة أصلية"],
    'Beauty': ["إشراقة بتخطف الأنظار", "نضارة بتنوي وجهك", "سر بياضك الساحر", "بشرة بتضوي ضي"],
    'General': ["منتج أصلي", "صنع بإتقان", "لإلك مخصوص", "الخيار الصح"]
};

/**
 * Validate and sanitize the generated slogan
 */
function validateSlogan(slogan, category, subjectName) {
    if (!slogan || slogan.trim() === '') {
        return getRandomFallback(category, subjectName);
    }

    // Check for blacklisted words
    const lowerSlogan = slogan.toLowerCase();
    for (const word of BLACKLISTED_WORDS) {
        if (lowerSlogan.includes(word)) {
            console.log(`⚠️ Slogan "${slogan}" contains blacklisted word "${word}". Using fallback.`);
            return getRandomFallback(category, subjectName);
        }
    }

    // Check if slogan is too long (more than 5 words)
    const wordCount = slogan.split(/\s+/).length;
    if (wordCount > 5) {
        console.log(`⚠️ Slogan "${slogan}" is too long (${wordCount} words). Using fallback.`);
        return getRandomFallback(category, subjectName);
    }

    return slogan;
}

/**
 * Get a random fallback slogan based on category
 */
function getRandomFallback(category, subjectName) {
    // Check if subject name contains shoes-related keywords
    const subjectLower = (subjectName || '').toLowerCase();
    if (subjectLower.includes('shoe') || subjectLower.includes('حذاء') || subjectLower.includes('جزمة') || subjectLower.includes('sneaker')) {
        const slogans = FALLBACK_SLOGANS['shoes'];
        return slogans[Math.floor(Math.random() * slogans.length)];
    }

    const slogans = FALLBACK_SLOGANS[category] || FALLBACK_SLOGANS['General'];
    return slogans[Math.floor(Math.random() * slogans.length)];
}

/**
 * Clean AI copy response from unwanted artifacts
 */
function cleanCopyResponse(response) {
    if (!response) return '';

    let cleaned = response;

    // Remove AI conversation artifacts
    const unwantedPrefixes = [
        /^تمام[،,\s]*/i,
        /^ولا يهمك[،,\.\s]*/i,
        /^حاضر[،,\.\s]*/i,
        /^أكيد[،,\.\s]*/i,
        /^طبعاً[،,\.\s]*/i,
        /^بالتأكيد[،,\.\s]*/i,
        /^هي البوست[:\s]*/i,
        /^البوست جاهز[:\s]*/i,
        /^إليك البوست[:\s]*/i,
        /^هاي البوست[:\s]*/i,
    ];

    for (const regex of unwantedPrefixes) {
        cleaned = cleaned.replace(regex, '');
    }

    // Remove markdown formatting (bold, italic)
    cleaned = cleaned
        .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove **bold**
        .replace(/\*([^*]+)\*/g, '$1')      // Remove *italic*
        .replace(/__([^_]+)__/g, '$1')      // Remove __underline__
        .replace(/_([^_]+)_/g, '$1');       // Remove _italic_

    // Remove labels written as headings
    cleaned = cleaned
        .replace(/^عنوان جذاب[:\s]*/gim, '')
        .replace(/^صلب الموضوع[:\s]*/gim, '')
        .replace(/^المميزات[:\s]*/gim, '')
        .replace(/^دعوة لاتخاذ إجراء[:\s]*/gim, '')
        .replace(/^CTA[:\s]*/gim, '')
        .replace(/^هاشتاغات[:\s]*/gim, '');

    // Clean up extra whitespace
    cleaned = cleaned
        .replace(/\n{3,}/g, '\n\n')  // Max 2 newlines
        .trim();

    return cleaned;
}

/**
 * Call GPT-4 specifically for creative Arabic copywriting
 * GPT-4 is better at natural Arabic slogan/copy generation
 * @param {string} systemPrompt - System instructions
 * @param {string} userPrompt - User message
 * @param {number} maxTokens - Max tokens for response (default: 50 for slogans, use 800+ for posts)
 */
async function callGPT4(systemPrompt, userPrompt, maxTokens = 50) {
    const GPT_MODELS = [
        "openai/gpt-4o",
        "openai/gpt-4o-mini",
        "openai/gpt-4-turbo"
    ];

    for (const model of GPT_MODELS) {
        try {
            console.log(`🤖 Trying GPT Model: ${model} (max_tokens: ${maxTokens})...`);

            const response = await axios.post(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    model: model,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.8,
                    max_tokens: maxTokens
                },
                {
                    headers: {
                        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5000",
                        "X-Title": "Syrian Marketing Agency",
                    },
                }
            );

            if (response.data?.choices?.[0]?.message?.content) {
                return response.data.choices[0].message.content;
            }
        } catch (error) {
            console.warn(`GPT Model ${model} Failed:`, error.response?.data?.error?.message || error.message);
        }
    }

    throw new Error("All GPT models failed.");
}

/**
 * Generate a smart, product-relevant slogan using GPT-4
 * Uses Gemini's analysis as context, GPT-4 for creative writing
 */
async function generateSmartSlogan(analysis, localization, targetingContext) {
    const { CATEGORY, SUBJECT_NAME, SUBJECT_NAME_AR, KEY_FEATURES } = analysis;

    // Build a rich context from Gemini's analysis
    const productContext = `
المنتج: ${SUBJECT_NAME_AR || SUBJECT_NAME}
التصنيف: ${CATEGORY}
المميزات: ${Array.isArray(KEY_FEATURES) ? KEY_FEATURES.join('، ') : 'منتج عالي الجودة'}
الجمهور المستهدف: ${targetingContext}
اللهجة: ${localization.dialect}
`.trim();

    const systemPrompt = `أنت Creative Director "فهمان" في وكالة إعلانات سورية محترفة.
مهمتك: ابتكار شعار (Slogan) للمنتج ده، يكون معادلته: "ذكي + مبتكر + طبيعي".

المعايير الذهبية (Gold Standard):
1. **الابتكار (Innovative):** ابعد عن الكليشيهات المملة والمستهلكة (مثل "الأفضل"، "نورك الطبيعي"، "سر الجمال"). دور على زاوية ذكية تلمس شعور الزبون وتخليه ينبهر.
2. **النتيجة والحيوية (Effect & Vitality):** في منتجات التجميل والبشرة، ركز على "النتيجة" اللي الزبون بيشوفها، استخدم كلمات فيها حركة وإضاءة (مثل "بتنور"، "بتضوي"، "بتسحر").
3. **مش غريب (Not Weird):** استخدم لغة بيحكوها الناس فعلاً (لهجة سورية "كلاس" وراقية).
4. **الطول:** كلمتين أو تلاتة بالكتير (خير الكلام ما قل ودل).

الأصناف الخاصة:
- **تفتيح/نضارة بشرة:** استخدم شعارات توحي بالإشراق الفوري (مثلاً: "إشراقة بتنوي وجهك"، "بشرة بتخطف الضو").
- **العناية بالشعر:** ركز على النعومة والحركة (مثلاً: "حرير بكل حركة").

أمثلة للتوضيح (ال "Vibe" المطلوب):
- كريم تفتيح: "إشراقة بتهوس" أو "وشك بيضوي ضي".
- سماعات: "افصل عنهم".
- قهوة: "رواقك مضمون".

المطلوب: شعار واحد فقط، عبقري، من كلمتين لـ 3 كلمات. ممنوع استخدام كلمات مثل "جودة"، "أناقة"، "أفضل"، "نورك الطبيعي".`;

    const userPrompt = `المنتج: ${SUBJECT_NAME_AR} (${CATEGORY})
المميزات: ${KEY_FEATURES ? KEY_FEATURES.join('، ') : ''}
الجمهور: ${targetingContext}

بدنا شعار "يبيع" الفكرة بذكاء (باللهجة السورية):`;

    try {
        const sloganResponse = await callGPT4(systemPrompt, userPrompt);

        // Clean the response thoroughly
        let cleanSlogan = sloganResponse
            .replace(/["'`«»""'']/g, '')           // Remove all quote types
            .replace(/^[\s\n]*الشعار[:\s]*/i, '')  // Remove "الشعار:" prefix
            .replace(/^[\s\n]*شعار[:\s]*/i, '')    // Remove "شعار:" prefix
            .replace(/[.!?،,]/g, '')               // Remove punctuation
            .replace(/\n/g, ' ')                   // Replace newlines
            .trim();

        // Take only the first meaningful part
        cleanSlogan = cleanSlogan.split('\n')[0].split('  ')[0].trim();

        // Validate the slogan
        const validatedSlogan = validateSlogan(cleanSlogan, CATEGORY, SUBJECT_NAME);

        console.log(`🎯 GPT-4 Slogan Generated: "${validatedSlogan}" (Raw: "${cleanSlogan}")`);
        return validatedSlogan;

    } catch (error) {
        console.error("❌ GPT-4 Slogan Generation Failed:", error.message);

        // Fallback to Gemini if GPT-4 fails
        try {
            console.log("🔄 Falling back to Gemini for slogan...");
            const geminiResponse = await callGemini(
                "أنت كاتب شعارات. أعطني شعار واحد فقط من 2-4 كلمات.",
                `اكتب شعار قصير لـ: ${SUBJECT_NAME_AR || SUBJECT_NAME}`
            );
            return validateSlogan(geminiResponse.trim(), CATEGORY, SUBJECT_NAME);
        } catch (geminiError) {
            console.error("❌ Gemini fallback also failed:", geminiError.message);
            return getRandomFallback(CATEGORY, SUBJECT_NAME);
        }
    }
}

/**
 * Call Gemini 1.5 Flash via OpenRouter for Prompt Refinement
 */
async function callGemini(systemInstruction, userPrompt, imageBuffer = null) {
    const MODELS = [
        "google/gemini-2.0-flash-001",
        "google/gemini-2.0-flash-exp:free",
        "google/gemini-flash-1.5"
    ];

    for (const model of MODELS) {
        try {
            console.log(`Trying AI Model: ${model}...`);

            let messages = [
                { role: "system", content: systemInstruction }
            ];

            if (imageBuffer) {
                let imageUrl = imageBuffer;
                if (!imageBuffer.startsWith('data:') && !imageBuffer.startsWith('http')) {
                    imageUrl = `data:image/jpeg;base64,${imageBuffer}`;
                }

                messages.push({
                    role: "user",
                    content: [
                        { type: "text", text: userPrompt },
                        { type: "image_url", image_url: { url: imageUrl } }
                    ]
                });
            } else {
                messages.push({
                    role: "user",
                    content: userPrompt
                });
            }

            const response = await axios.post(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    model: model,
                    messages: messages,
                },
                {
                    headers: {
                        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5000",
                        "X-Title": "Syrian Marketing Agency",
                    },
                }
            );

            if (response.data?.choices?.[0]?.message?.content) {
                return response.data.choices[0].message.content;
            }
        } catch (error) {
            console.warn(`Model ${model} Failed:`, error.response?.data?.error?.message || error.message);
        }
    }

    throw new Error("All AI models failed to respond.");
}

/**
 * Generate Image using Fal.ai (Flux)
 */
async function generateImage(prompt, imageInput = null, mode = 'text-to-image') {
    try {
        let modelId;
        let input;



        if (mode === 'image-to-image' && imageInput) {
            modelId = "fal-ai/nano-banana-pro/edit";
            input = {
                prompt: prompt,
                image_urls: [imageInput],
                resolution: "2K",
                aspect_ratio: "1:1",
                output_format: "png"
            };
            console.log("🖼️ Using Nano Banana Pro for Image-to-Image (2K Edit)");
        } else {
            modelId = "fal-ai/nano-banana-pro";
            input = {
                prompt: prompt,
                resolution: "2K",
                aspect_ratio: "1:1",
                output_format: "png"
            };
            console.log("📝 Using Nano Banana Pro for Text-to-Image (2K Gen)");
        }

        const result = await fal.subscribe(modelId, {
            input,
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === 'IN_PROGRESS') {
                    // Log less frequently
                }
            },
        });

        if (result.images && result.images.length > 0) {
            console.log("✅ Image generated successfully:", result.images[0].url);
            return result.images[0].url;
        }
        throw new Error("No image returned from Fal.ai");
    } catch (error) {
        console.error("❌ Fal.ai Generation Error:", error.body || error.message || error);
        throw new Error("Image generation failed: " + (error.message || "Unknown error"));
    }
}

async function orchestrateContentGeneration(userId, inputType, rawData, explicitPrompt = "", explicitRegion = null, outputMode = 'both', targetGender = 'both', targetAge = 'all') {
    console.log(`Starting AI Orchestration for User: ${userId}, Type: ${inputType}, Mode: ${outputMode}, Target: ${targetGender}/${targetAge}`);

    // 1. Fetch User & Localization Settings
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!user) {
        throw new Error("User not found.");
    }

    let regionKey = 'Modern';
    if (explicitRegion && LOCALIZATION_MATRIX[explicitRegion]) {
        regionKey = explicitRegion;
    }
    // Fallback logic based on plan names is removed because user.currentPlan 
    // now uses 'Basic', 'Pro', 'Elite' which don't map directly to regions.
    // The frontend now explicitly sends the desired region.

    const localization = LOCALIZATION_MATRIX[regionKey];
    console.log(`Applied Localization: ${localization.name} (${regionKey})`);

    // Prepare Targeting Context
    const genderMap = { 'male': 'Men/Boys', 'female': 'Women/Girls', 'both': 'Everyone' };
    const ageMap = { 'youth': '18-30', 'adults': '30-50', 'seniors': '50+', 'all': 'all ages' };

    const genders = Array.isArray(targetGender) ? targetGender : [targetGender];
    const ages = Array.isArray(targetAge) ? targetAge : [targetAge];

    const genderText = genders.includes('both') ? 'Everyone' : genders.map(g => genderMap[g]).join(' + ');
    const ageText = ages.includes('all') ? 'all ages' : ages.map(a => `age ${ageMap[a]}`).join(' + ');

    const targetingContext = `Audience: ${genderText}, Target age: ${ageText}`;

    let visualPromise = Promise.resolve(null);
    let copyPromise = Promise.resolve(null);

    // --- ANALYZE PHASE (Gemini as Strategy Director) ---
    const getStrategy = async () => {
        const isImage = inputType === 'image';
        const contentToAnalyze = isImage ? "Image Input Provided" : `Text Input: ${rawData || explicitPrompt}`;

        // Simplified strategy prompt - focuses on analysis only, slogan is generated separately
        const strategySystemPrompt = `You are a World-Class Creative Director for a Syrian Marketing Agency targeting: ${localization.name}.
        Your goal is to appeal to: ${targetingContext}.
        
        Analyze the product and determine strictly valid JSON.
        
        ### STYLE GUIDE MATRIX (Strictly follow these vibes based on product):
        - **Gaming/Tech**: Neon, Cyberpunk, Dark Room with purple/blue RGB, High contrast, Energetic. **NO CULTURAL LANDMARKS OR REGIONAL ELEMENTS.**
        - **Luxury/Classic (Watches/Perfume)**: Marble, Mahogany wood, Velvet, Moody dark lighting, Bokeh sparkles, Premium. **NO CULTURAL LANDMARKS OR REGIONAL ELEMENTS.**
        - **Natural/Organic**: Sunlight, Leaves, Wood textures, Airy, Soft shadows, Morning light.
        - **Food/Drinks**: Splash, Steam, Fresh ingredients around, Kitchen counter or Wooden table, Appetizing warm light. (Regional elements allowed if requested)
        - **Beauty/Skincare**: Water texture, Silk, Pastel colors, Softbox lighting, Minimalist podium. **NO CULTURAL LANDMARKS OR REGIONAL ELEMENTS.**

        ### OUTPUT JSON:
        1. CATEGORY: "Tech", "Food", "Beauty", "Shoes", "Watches", or "General".
        2. SUBJECT_NAME: Precise name of the product/subject in English.
        3. SUBJECT_NAME_AR: Arabic name of the product.
        4. VISUAL_STYLE: Pick strictly from the Style Matrix above.
        5. LIGHTING: Specific lighting setup (e.g., "Neon Rim Lighting", "Golden Hour Sun").
        6. COMPOSITION: Camera angle (e.g., "Low angle hero shot").
        7. BEST_BACKGROUND: A highly descriptive background matching the vibe. **For Tech/Beauty/Watches: NO Syrian landmarks, NO cultural elements.**
        8. PRODUCT_COLORS: List dominant colors in the product (e.g., "Black and Red").
        9. TEXT_COLOR_GUIDE: specific color instruction for the text to ensure MAXIMUM CONTRAST against the chosen background.
        10. KEY_FEATURES: List 2-3 key features.
        
        Output JSON only. Do NOT include a slogan.`;

        try {
            const res = await callGemini(strategySystemPrompt, `Analyze this request. User Context: "${explicitPrompt}". Content: ${contentToAnalyze}`, isImage ? rawData : null);
            const jsonMatch = res.match(/\{[\s\S]*\}/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : { CATEGORY: "General", SUBJECT_NAME: "Product", SUBJECT_NAME_AR: "منتج", VISUAL_STYLE: "Clean", BEST_BACKGROUND: "Studio simple", KEY_FEATURES: [] };
        } catch (e) {
            console.error("Strategy Analysis Failed:", e);
            return { CATEGORY: "General", SUBJECT_NAME: "Product", SUBJECT_NAME_AR: "منتج", VISUAL_STYLE: "Clean", BEST_BACKGROUND: "Studio simple", KEY_FEATURES: [] };
        }
    };

    const analysis = await getStrategy();
    console.log("🧠 Strategic Analysis:", analysis);

    // --- STEP 2: Generate Smart Slogan (Separate AI Call) ---
    console.log("---> Starting Slogan Generation (Dedicated Step)...");
    const smartSlogan = await generateSmartSlogan(analysis, localization, targetingContext);
    analysis.SLOGAN_AR = smartSlogan;
    console.log(`✅ Final Slogan: "${smartSlogan}"`);


    // --- VISUAL TASK (Simplified & Professional) ---
    if (outputMode !== 'text_only') {
        visualPromise = (async () => {
            try {
                console.log("--> Starting Visual Pipeline (Direct Professional Generation)...");

                // Use the already-validated smart slogan
                const slogan = analysis.SLOGAN_AR || getRandomFallback(analysis.CATEGORY, analysis.SUBJECT_NAME);
                console.log(`📝 Using Slogan for Image: "${slogan}"`);

                // Determine if we should use Syrian visual elements (only for Food category)
                const useSyrianVisuals = analysis.CATEGORY === 'Food';
                const atmosphereInstruction = useSyrianVisuals
                    ? `Atmosphere: ${localization.visualMarkers}, premium look.`
                    : `Atmosphere: Clean, modern, internationally appealing, premium look.`;

                // --- Model & Modesty Direction ---
                let genderTerm = "model";
                if (genders.length === 1 && genders[0] === 'female') genderTerm = "female model";
                if (genders.length === 1 && genders[0] === 'male') genderTerm = "male model";

                const subjectLower = (analysis.SUBJECT_NAME || "").toLowerCase() + " " + (analysis.SUBJECT_NAME_AR || "");
                const isBeautyOrPersonal = analysis.CATEGORY === 'Beauty' || /skin|hair|face|cream|lotion|serum|makeup|بشرة|وجه|كريم|سيروم|مكياج/i.test(subjectLower);

                // Default for Beauty is often Female unless specified otherwise
                if (isBeautyOrPersonal && targetGender !== 'male') {
                    genderTerm = "female model";
                }

                // Default Instruction with Modesty
                let modelInstruction = `If a ${genderTerm} is included, they must be dressed professionally and modestly. Ensure chest and cleavage are FULLY COVERED.`;
                let vitalityInstruction = "";

                if (isBeautyOrPersonal && inputType !== 'image') {
                    // Specific "Vibrant/Alive" instructions for Beauty (only for Text-to-Image)
                    if (/hair|shampoo|conditioner|oil|شعر|شامبو|زيت/i.test(subjectLower)) {
                        modelInstruction = `Feature a ${genderTerm} with incredibly healthy, shimmering, and dynamic voluminous hair. Capture a slight movement in the hair. The ${genderTerm} must be dressed modestly (high neckline), with chest/cleavage FULLY COVERED.`;
                        vitalityInstruction = "The image should feel alive, with soft wind blowing the hair, emphasizing silkiness and shine.";
                    } else if (/skin|face|moisturizer|serum|anti-aging|cream|بشرة|وجه|تجاعيد|نضارة|كريم/i.test(subjectLower)) {
                        modelInstruction = `Feature a ${genderTerm} with flawless, dewy, and naturally radiant skin. The model should be actively interacting with the product, perhaps applying a small amount of cream to her cheek with a gentle, elegant touch. The ${genderTerm} must be dressed modestly (high neckline/silk robe), with chest/cleavage FULLY COVERED.`;
                        vitalityInstruction = "Capture the vital texture of the cream and the glow of the skin. Use a high-end commercial aesthetic with soft morning light.";
                    } else {
                        modelInstruction = `Feature an elegant ${genderTerm} with a polished look, interacting gracefully with the product. The ${genderTerm} must be dressed modestly (high neckline), with chest/cleavage FULLY COVERED.`;
                        vitalityInstruction = "The composition should be dynamic and vibrant, not static.";
                    }
                } else if (isBeautyOrPersonal) {
                    // Fallback for image-to-image or other cases
                    if (/hair|shampoo/i.test(subjectLower)) {
                        modelInstruction = `Feature a ${genderTerm} with beautiful hair. Modest dress, chest covered.`;
                    } else {
                        modelInstruction = `Feature a ${genderTerm} with clean skin. Modest dress, chest covered.`;
                    }
                }

                // Prompt Engineering for Nano Banana Pro (Google's State of the Art)
                let smartPrompt = `Professional high-end advertising masterpiece for ${analysis.SUBJECT_NAME}.
                
                Art Creation Strategy:
                1. Visual Style: ${analysis.VISUAL_STYLE}, commercial luxury photography, 8K resolution, incredibly detailed, shot on Hasselblad H6D.
                2. Lighting: ${analysis.LIGHTING || 'Professional Studio Softbox Lighting with subtle rim highlights'}.
                3. Composition: ${analysis.COMPOSITION || 'Centered Wide Shot'}, shallow depth of field (f/1.8), elegant bokeh background. Ensure ample NEGATIVE SPACE for branding.
                4. Background: ${analysis.BEST_BACKGROUND}. Premium and clean.
                5. ${atmosphereInstruction}
                6. Product Preservation: MAINTAIN THE EXACT SHAPE AND DETAILS of the product.
                7. Model & Vitality: ${modelInstruction} ${vitalityInstruction}
                8. Cinematic Touch: High dynamic range, vibrant colors, clean aesthetics, feeling of freshness and life.

                Typography & Branding (CRITICAL):
                - Text content: "${slogan}"
                - Placement: Bottom center, strictly within the safe zone (20% margin from bottom).
                - Font: Modern, Bold Arabic Calligraphy.
                - Color: ${analysis.TEXT_COLOR_GUIDE || 'High Contrast White'}.
                - Instruction: Render the text exactly as shown. Ensure readable contrast against the background.
                `;

                if (inputType === 'image') {
                    // Image-to-Image (Edit Mode)
                    console.log(`--> Mode: Image-to-Image (Refining with Arabic Slogan: ${slogan})`);
                    return await generateImage(smartPrompt, rawData, 'image-to-image');

                } else {
                    // Text-to-Image
                    console.log(`--> Mode: Text-to-Image (Creating from scratch with Slogan: ${slogan})`);
                    return await generateImage(smartPrompt, null, 'text-to-image');
                }

            } catch (err) {
                console.error("❌ Visual Pipeline Error:", err);
                throw err;
            }
        })();
    }

    // --- COPYWRITING TASK ---
    if (outputMode !== 'image_only') {
        copyPromise = (async () => {
            try {
                console.log("--> Starting Copy Pipeline (GPT-4 Arabic)...");

                // Get dialect examples if available
                const dialectExamples = localization.dialectExamples || '';
                const samplePhrases = localization.samplePhrases ? localization.samplePhrases.join('، ') : '';

                const productInfo = `
المنتج: ${analysis.SUBJECT_NAME_AR || analysis.SUBJECT_NAME}
التصنيف: ${analysis.CATEGORY}
المميزات الرئيسية: ${Array.isArray(analysis.KEY_FEATURES) ? analysis.KEY_FEATURES.join('، ') : 'تصميم عصري، جودة عالية، سعر مناسب'}
وصف إضافي من العميل: ${explicitPrompt || 'لا يوجد'}
`.trim();

                // --- Dynamic Addressing Logic ---
                let addressInstruction = '1. خاطب الجمهور بصيغة "المخاطب المفرد" (للكل) أو "الجمع" بذكاء.';

                const isFemaleProduct = analysis.CATEGORY === 'Beauty' || /makeup|dress|hijab|skirt|bra|women|girl|lady|شعر|مكياج|فستان|حجاب|تنورة|بنات|سيدات|نسائي/i.test((analysis.SUBJECT_NAME_AR || '') + ' ' + (analysis.SUBJECT_NAME || ''));

                if (genders.length === 1 && genders[0] === 'female') {
                    addressInstruction = '1. 👩 خاطب الأنثى بصيغة المؤنث حصراً "أنتِ" (مثال: "بتحبي تكوني..."، "زهقتي من..."، "إلك إنتي..."، "دللي حالك").';
                } else if (genders.length === 1 && genders[0] === 'male') {
                    addressInstruction = '1. 👨 خاطب الذكر بصيغة المذكر "أنت" (مثال: "بتحب تكون..."، "زهقت من..."، "إلك إنت..."، "دلل حالك").';
                } else if (isFemaleProduct) {
                    addressInstruction = '1. 💄 المنتج نسائي: خاطب الأنثى بصيغة المؤنث "أنتِ" (مثال: "بتحبي..."، "جربي..."، "دللي جمالك").';
                } else {
                    addressInstruction = '1. 🗣️ خاطب الزبون مباشرة (مثال: "بتحب..." أو "جرب..."). خلي الكلام عفوي وقريب للقلب.';
                }

                const systemPrompt = `أنت كاتب إعلانات سوري "شاطر" وخبير بنفسية الزبون السوري. 
مهمتك تكتب بوست يخلي الزبون يحس إنه الكلام موجه إله مخصوص!

🗣️ اللهجة: ${localization.dialect}
📍 المنطقة: ${localization.name}
👥 بتخاطب مين: ${targetingContext}

💬 كلمات لازم تستخدمها (حسب اللهجة):
${dialectExamples}
${samplePhrases ? `متل هيك: ${samplePhrases}` : ''}

🧠 كيف تكتب للزبون (تكتيكات نفسية):
${addressInstruction}
2. ركز على شعوره لما يستخدم المنتج مش بس مواصفات المنتج (مثال: بدل "ساعة مقاومة للماء" اكتب "اسبح ولا تاكل هم، ساعتك معك").
3. حسسه إنك فاهم مشكلته وإن الحل عندك.
4. خليك قريب منه وكأنك بتحكي مع رفيقك.

⚠️ قواعد الشكل (مهمة جداً):
- ممنوع المقدمات الرسمية. فوت بالموضوع دغري.
- ممنوع النجوم ** (بتخرب شكل البوست).
- الإيموجي ضروري بس بمكانه الصح 🔥.

📝 شكل البوست المطلوب:

[عنوان بيلمس وجع أو رغبة عند الزبون 🔥]

[سؤال أو جملة بتخليه يقول "أي والله هاد أنا!" (Hook)]

[فقرة بتشرح له كيف حياته حتصير أحلى مع المنتج (مخاطبة مباشرة)]

[ليش هاد المنتج بالذات؟ (المميزات بأسلوب "شو رح تستفيد")]
✅ ميزة 1 (بصيغة فايدة إلك)
✅ ميزة 2
✅ ميزة 3
✅ ميزة 4

[جملة ختامية بتطمنه وبتقوله "دلل حالك" أو "ما تتردد"]

[كيف يطلب؟ 👇]

[هاشتاغات قوية]`;

                const userPrompt = `اكتب بوست إعلاني كامل ومفصل لهذا المنتج:

${productInfo}

البوست:`;

                let copyResponse;
                try {
                    // Try GPT-4 first for better copy (800 tokens for full post)
                    copyResponse = await callGPT4(systemPrompt, userPrompt, 800);
                } catch (gptError) {
                    console.log("🔄 GPT-4 failed for copy, using Gemini...");
                    copyResponse = await callGemini(systemPrompt, userPrompt, inputType === 'image' ? rawData : null);
                }

                // Clean the response from AI conversation artifacts
                const cleanedCopy = cleanCopyResponse(copyResponse);
                return cleanedCopy;

            } catch (err) {
                console.error("❌ Copy Pipeline Error:", err);
                return `🔥 ${analysis.SUBJECT_NAME_AR || analysis.SUBJECT_NAME}

منتج مميز بيستاهل التجربة!

✅ جودة عالية
✅ تصميم احترافي
✅ سعر منافس

👇 تواصل معنا الحين

#سوريا #منتجات #تسوق`;
            }
        })();
    }

    // Execute
    const [imageUrl, caption] = await Promise.all([visualPromise, copyPromise]);

    return {
        imageUrl,
        caption,
        debug: { analysis }
    };
}


module.exports = { orchestrateContentGeneration };
