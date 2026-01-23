import { useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

/**
 * StudioTab - The main creative studio for image generation
 * @param {object} user - Current user object
 * @param {function} onProjectCreated - Callback after successful generation
 */
const StudioTab = ({ user, onProjectCreated, onSubscribeClick }) => {
    const [selectedRegion, setSelectedRegion] = useState('Modern');
    const [outputMode, setOutputMode] = useState('both'); // 'both', 'image_only', 'text_only'
    const [isGenerating, setIsGenerating] = useState(false);
    const [showResult, setShowResult] = useState(false);

    // Image Upload & Generation State
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [generatedProject, setGeneratedProject] = useState(null);

    // Check if user has access to region selection (Pro/Elite features)
    const isProPlan = (plan) => {
        if (!plan) return false;
        const p = plan.toLowerCase();
        return p.includes('pro') || p.includes('elite') || p.includes('premium') || p.includes('gold') || p.includes('شركات') || p.includes('تاجر');
    };

    // Check if user has access to advanced targeting (Elite only)
    const isElitePlan = (plan) => {
        if (!plan) return false;
        const p = plan.toLowerCase();
        return p.includes('elite') || p.includes('premium') || p.includes('gold') || p.includes('شركات');
    };

    const outputOptions = [
        { id: 'both', label: 'صورة + بوست', icon: '✨' },
        { id: 'image_only', label: 'صورة فقط', icon: '🖼️' },
        { id: 'text_only', label: 'بوست فقط', icon: '📝' },
    ];

    const availableRegions = [
        { id: 'Modern', name: 'عام (سورية العصرية)', desc: 'تصميم عصري بلمسات ناعمة', locked: false },
        { id: 'Damascene', name: 'دمشق (الشام)', desc: 'الياسمين، الحجر القديم، والأقواس', locked: !isProPlan(user?.currentPlan) },
        { id: 'Aleppine', name: 'حلب (الشهباء)', desc: 'القلعة، الحجر الرمادي، والفخامة', locked: !isProPlan(user?.currentPlan) },
        { id: 'Coastal', name: 'الساحل السوري', desc: 'البحر، الجبل، والطبيعة الخضراء', locked: !isProPlan(user?.currentPlan) }
    ];

    // New Targeting Options
    const [targetGender, setTargetGender] = useState(['both']);
    const [targetAge, setTargetAge] = useState(['all']);

    const toggleGender = (id) => {
        if (id === 'both') {
            setTargetGender(['both']);
            return;
        }
        setTargetGender(prev => {
            const current = Array.isArray(prev) ? prev : [prev];
            let next = current.filter(item => item !== 'both');
            if (next.includes(id)) {
                next = next.filter(item => item !== id);
            } else {
                next.push(id);
            }
            if (next.length === 0 || next.length === 2) return ['both'];
            return next;
        });
    };

    const toggleAge = (id) => {
        if (id === 'all') {
            setTargetAge(['all']);
            return;
        }
        setTargetAge(prev => {
            const current = Array.isArray(prev) ? prev : [prev];
            let next = current.filter(item => item !== 'all');
            if (next.includes(id)) {
                next = next.filter(item => item !== id);
            } else {
                next.push(id);
            }
            if (next.length === 0 || next.length === 3) return ['all'];
            return next;
        });
    };

    const genderOptions = [
        { id: 'both', label: 'الكل', locked: false },
        { id: 'male', label: 'شباب (ذكور)', locked: !isElitePlan(user?.currentPlan) },
        { id: 'female', label: 'بنات (إناث)', locked: !isElitePlan(user?.currentPlan) },
    ];

    const ageOptions = [
        { id: 'all', label: 'جميع الأعمار', locked: false },
        { id: 'youth', label: 'شباب (18-30)', locked: !isElitePlan(user?.currentPlan) },
        { id: 'adults', label: 'كبار (30-50)', locked: !isElitePlan(user?.currentPlan) },
        { id: 'seniors', label: 'كبار السن (50+)', locked: !isElitePlan(user?.currentPlan) },
    ];

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Helper to convert file to Base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleGenerate = async () => {
        if (!prompt && !uploadedImage) {
            toast.error('يرجى كتابة وصف أو رفع صورة');
            return;
        }

        setShowResult(false);
        setIsGenerating(true);

        try {
            let effectiveInputType = 'text';
            let rawData = prompt;

            if (uploadedImage) {
                effectiveInputType = 'image';
                toast.loading('جاري رفع ومعالجة الصورة...');
                rawData = await fileToBase64(uploadedImage); // Base64 String
            }

            const response = await api.post('/api/ai/generate', {
                inputType: effectiveInputType,
                rawData,
                prompt: prompt, // Send prompt separately as well
                region: selectedRegion,
                outputMode: outputMode,
                targetGender, // New Param
                targetAge     // New Param
            });

            if (response.data.success) {
                toast.dismiss(); // Remove loading toast
                setGeneratedProject(response.data.data); // data contains { imageUrl, caption }
                setShowResult(true);
                if (onProjectCreated) onProjectCreated();
                toast.success('تم توليد المشروع بنجاح! ✨');
            }
        } catch (error) {
            console.error('Generation error:', error);
            toast.dismiss();
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء التوليد');
        } finally {
            setIsGenerating(false);
        }
    };



    return (
        <div className="flex-grow flex flex-col gap-6 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">مرحباً {user?.name || 'يا بطل'}، ابدأ إبداعك اليوم ✨</h1>
                    <p className="text-slate-500 text-sm">حول منتجاتك إلى إعلانات عالمية بلهجات سورية محلية.</p>
                </div>
            </div>


            {/* Input Controls */}
            <div className="grid lg:grid-cols-12 gap-6 relative">
                {/* --- LOCK OVERLAY FOR 0 CREDITS --- */}
                {(!user?.credits || user.credits < 1) && (
                    <div className="absolute inset-0 z-50 bg-slate-100/60 backdrop-blur-sm rounded-[3rem] flex flex-col items-center justify-center text-center p-6 border-2 border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 text-slate-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">استوديو التصميم مغلق</h3>
                        <p className="text-slate-500 max-w-md mb-6">هذه الميزة متاحة للمشتركين فقط. يرجى تفعيل إحدى الباقات للبدء في استخدام الذكاء الاصطناعي.</p>
                        <button
                            onClick={onSubscribeClick}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                        >
                            تفعيل الاشتراك الآن
                        </button>
                    </div>
                )}

                {/* Setup Card */}
                <div className={`lg:col-span-12 space-y-6 ${(!user?.credits || user.credits < 1) ? 'opacity-40 pointer-events-none filter blur-[2px]' : ''}`}>
                    <div className="bg-white/70 backdrop-blur-md border border-white/50 p-8 rounded-[3rem] shadow-sm space-y-8">

                        {/* Controls Row */}
                        <div className="grid md:grid-cols-2 gap-8 items-start">

                            {/* Region Selector */}
                            <div className="md:col-span-1">
                                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                                    <span className="w-6 h-6 rounded-full bg-slate-100 text-[10px] flex items-center justify-center">01</span>
                                    المنطقة واللهجة
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {availableRegions.map((region) => (
                                        <button
                                            key={region.id}
                                            onClick={() => !region.locked && setSelectedRegion(region.id)}
                                            disabled={region.locked}
                                            className={`
                                                relative p-3 rounded-2xl border text-right transition-all
                                                ${selectedRegion === region.id
                                                    ? 'bg-slate-900 border-slate-900 text-white shadow-md transform scale-[1.02]'
                                                    : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                                                }
                                                ${region.locked ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
                                            `}
                                        >
                                            <div className="font-bold text-xs mb-1">{region.name}</div>

                                            {region.locked && (
                                                <div className="absolute top-2 left-2 text-slate-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Output Mode Selector */}
                            <div className="md:col-span-1">
                                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                                    <span className="w-6 h-6 rounded-full bg-slate-100 text-[10px] flex items-center justify-center">02</span>
                                    نوع المخرج
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {outputOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setOutputMode(option.id)}
                                            className={`
                                                p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all h-24
                                                ${outputMode === option.id
                                                    ? 'bg-slate-900 border-slate-900 text-white shadow-md transform scale-[1.02]'
                                                    : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                                                }
                                            `}
                                        >
                                            <span className="text-2xl">{option.icon}</span>
                                            <span className="font-bold text-xs">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* --- NEW TARGETING SECTION (ELITE ONLY) --- */}
                        <div className="grid md:grid-cols-2 gap-8 items-start border-t border-slate-100 pt-8">

                            {/* Gender Target */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                                    <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 text-[10px] flex items-center justify-center">★</span>
                                    الجمهور (شباب/بنات)
                                </h3>
                                <div className="flex gap-3">
                                    {genderOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => !opt.locked && toggleGender(opt.id)}
                                            disabled={opt.locked}
                                            className={`
                                                flex-1 py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all relative
                                                ${targetGender.includes(opt.id)
                                                    ? 'bg-slate-800 text-white border-slate-800'
                                                    : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
                                                }
                                                ${opt.locked ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            {opt.label}
                                            {opt.locked && <span className="absolute -top-1 -left-1 text-amber-500">🔒</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Age Target */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                                    <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 text-[10px] flex items-center justify-center">★</span>
                                    الفئة العمرية
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {ageOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => !opt.locked && toggleAge(opt.id)}
                                            disabled={opt.locked}
                                            className={`
                                                py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all relative
                                                ${targetAge.includes(opt.id)
                                                    ? 'bg-slate-800 text-white border-slate-800'
                                                    : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
                                                }
                                                ${opt.locked ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            {opt.label}
                                            {opt.locked && <span className="absolute -top-1 -left-1 text-amber-500">🔒</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Content Input - Combined View */}
                        <div className="grid md:grid-cols-2 gap-8 items-start border-t border-slate-100 pt-8">

                            {/* Text Input Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-700 flex items-center justify-between">
                                    <span>وصف المشهد (Prompt)</span>
                                    <span className="w-6 h-6 rounded-full bg-slate-100 text-[10px] flex items-center justify-center">03</span>
                                </h3>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="w-full h-48 bg-white/50 border border-slate-100 rounded-[1.5rem] px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none"
                                    placeholder="صف الصورة التي تريد توليدها بدقة... مثلاً: 'منتج قهوة عربية فاخرة على طاولة خشبية مع إضاءة صباحية دافئة وبخار يتصاعد'"
                                ></textarea>
                            </div>

                            {/* Image Input Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-700 flex items-center justify-between">
                                    <span>صورة مرجعية (اختياري)</span>
                                    <span className="w-6 h-6 rounded-full bg-slate-100 text-[10px] flex items-center justify-center">04</span>
                                </h3>

                                <div className="space-y-4">
                                    {!imagePreview ? (
                                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-[1.5rem] cursor-pointer hover:bg-slate-50 transition-all group">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3 group-hover:bg-slate-200 transition-colors">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm text-slate-500 font-medium">اضغط لرفع صورة المنتج</p>
                                                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    ) : (
                                        <div className="relative w-full h-48 rounded-[1.5rem] overflow-hidden border border-slate-200 group">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                                <button
                                                    onClick={() => { setUploadedImage(null); setImagePreview(null); }}
                                                    className="bg-red-500/80 text-white p-2 rounded-xl hover:bg-red-600 transition-colors"
                                                    title="حذف الصورة"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Generator Button */}
                        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                            <div className="text-xs text-slate-400">
                                الرصيد المتبقي: <span className="font-bold text-slate-800">{user?.credits}</span>
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || (!prompt && !uploadedImage)}
                                className="bg-slate-900 text-white px-10 py-4 rounded-[1.5rem] font-bold text-md hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{isGenerating ? 'جاري المعالجة...' : 'توليد المحتوى'}</span>
                                {!isGenerating && (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Result Section */}
            {isGenerating && (
                <div className="h-64 border-2 border-dashed border-sky-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-400 bg-white/50 animate-pulse">
                    <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-bold text-sm">جاري تحليل الطلب وتوليد المحتوى بواسطة الذكاء الاصطناعي...</p>
                </div>
            )}

            {showResult && generatedProject && (
                <div className="py-12 animate-in fade-in zoom-in duration-500">
                    <div className={`grid ${outputMode === 'both' ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-2xl mx-auto'} gap-8 items-stretch`}>
                        {/* Generated Asset (Image) */}
                        {generatedProject.imageUrl && (
                            <div className="bg-white p-6 rounded-[3rem] shadow-sm border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full tracking-widest">النتيجة النهائية</span>
                                    {/* Download Button */}
                                    <button
                                        onClick={async () => {
                                            try {
                                                const response = await fetch(generatedProject.imageUrl);
                                                const blob = await response.blob();
                                                const blobUrl = window.URL.createObjectURL(blob);
                                                const link = document.createElement('a');
                                                link.href = blobUrl;
                                                link.download = `syrian-ad-${Date.now()}.png`;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                                window.URL.revokeObjectURL(blobUrl);
                                            } catch (e) {
                                                console.error('Download failed', e);
                                                window.open(generatedProject.imageUrl, '_blank');
                                            }
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        تحميل الصورة
                                    </button>
                                </div>
                                <div className="rounded-[2.5rem] overflow-hidden aspect-square shadow-inner bg-slate-100 relative group">
                                    <img src={generatedProject.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Generated Result" />
                                </div>
                            </div>
                        )}

                        {/* Generated Content (Text) */}
                        {generatedProject.caption && (
                            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-8">
                                        <div className="w-3 h-3 bg-sky-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-bold text-slate-900 uppercase">النص الإعلاني المقترح</span>
                                    </div>
                                    <div className="text-lg leading-relaxed text-slate-700 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-50 italic whitespace-pre-line" style={{ direction: 'rtl' }}>
                                        {generatedProject.caption}
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <button
                                        onClick={() => navigator.clipboard.writeText(generatedProject.caption)}
                                        className="flex-grow py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
                                    >
                                        نسخ النص
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default StudioTab;
