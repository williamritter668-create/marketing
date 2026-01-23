/**
 * PricingTab - Display subscription plans
 * @param {function} onSelectPlan - Callback when a plan is selected
 * @param {string} currentPlan - The user's current active plan (e.g. 'Basic', 'Pro', 'Elite')
 */
const PricingTab = ({ onSelectPlan, currentPlan }) => {
    // Normalizing plan comparison (case insensitive)
    const isCurrent = (planId, planName) => {
        if (!currentPlan) return false;
        const normalizedCurrent = currentPlan.toLowerCase();
        return normalizedCurrent.includes(planId) || normalizedCurrent === planName.toLowerCase();
    };

    const plans = [
        {
            id: 'basic',
            name: 'Basic',
            displayName: 'باقة المبتدئ',
            price: 12,
            duration: 'شهر',
            features: [
                '20 صورة محصول 4K',
                '30 بوستات تسويقية',
                'إزالة خلفية احترافية',
                'النمط السوري العصري'
            ],
            popular: false
        },
        {
            id: 'pro',
            name: 'Pro',
            displayName: 'باقة التاجر',
            price: 19,
            duration: 'شهر',
            features: [
                '50 صورة محصول فائقة الجودة',
                '60 بوست تسويقي احترافي',
                'دعم كافة اللهجات (شامي، حلبي، ساحلي)',
                'ديكورات مناطقية (الياسمين، القلعة، البحر)',
                'أولوية في معالجة الصور'
            ],
            popular: true
        },
        {
            id: 'elite',
            name: 'Elite',
            displayName: 'باقة الشركات (ربع سنوية)',
            price: 49,
            duration: '3 شهور',
            features: [
                '120 صورة عالية الدقة',
                '130 بوست تسويقي',
                'صلاحية ممتدة لـ 3 أشهر',
                'استهداف ديموغرافي (شباب/بنات)',
                'تخصيص الفئات العمرية بدقة',
                'دعم فني مخصص (VIP)'
            ],
            popular: false
        }
    ];

    return (
        <div className="flex-grow overflow-y-auto custom-scrollbar p-4 md:p-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">اختر الباقة المناسبة لك</h2>
                <p className="text-slate-500">ارفع مبيعاتك مع أدواتنا الاحترافية المخصصة للسوق السوري.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan) => {
                    const isPlanActive = isCurrent(plan.id, plan.name);

                    return (
                        <div
                            key={plan.id}
                            className={`bg-white p-8 rounded-[3rem] flex flex-col transition-all ${isPlanActive
                                ? 'border-4 border-green-500 shadow-2xl scale-105 z-20'
                                : plan.popular
                                    ? 'border-2 border-sky-500 shadow-xl shadow-sky-100 relative transform scale-105 z-10'
                                    : 'border border-slate-100 shadow-sm'
                                }`}
                        >
                            {plan.popular && !isPlanActive && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full">
                                    الأكثر طلباً
                                </div>
                            )}

                            {isPlanActive && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    مشترك حالياً
                                </div>
                            )}

                            <span className={`text-xs font-bold uppercase tracking-widest mb-4 ${plan.popular ? 'text-sky-600' : 'text-slate-400'}`}>
                                {plan.displayName}
                            </span>

                            <div className="text-3xl font-bold mb-6">
                                ${plan.price} <span className="text-sm font-normal text-slate-400">/{plan.duration}</span>
                            </div>

                            <ul className="space-y-4 mb-8 text-sm text-slate-600 flex-grow">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className={`flex items-center gap-2 ${plan.popular ? 'font-bold' : ''}`}>
                                        ✓ {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => !isPlanActive && onSelectPlan(plan.displayName, plan.price)}
                                disabled={isPlanActive}
                                className={`w-full py-4 rounded-2xl font-bold transition-all ${isPlanActive
                                    ? 'bg-green-100 text-green-700 cursor-default'
                                    : plan.popular
                                        ? 'bg-sky-600 text-white hover:bg-sky-700 shadow-lg shadow-sky-200'
                                        : 'border border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {isPlanActive
                                    ? 'باقتك الحالية'
                                    : plan.popular ? 'ابدأ الآن' : plan.price === 149 ? 'تواصل معنا' : 'اختيار الباقة'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PricingTab;
