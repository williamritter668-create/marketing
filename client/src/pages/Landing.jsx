import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import imgBefore from '../assets/11111111111.webp';
import imgAfter from '../assets/syrian-ad-1767794420898.webp';

const Landing = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Check if user is authenticated
    const { auth } = useAuth();
    const isLoggedIn = auth?.isAuthenticated && auth?.user;

    return (
        <div className="font-sans text-[#1a1a1a] bg-white overflow-x-hidden" dir="rtl">
            {/* Skip to Content Link for Accessibility */}
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[100] focus:bg-sky-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
                انتقل إلى المحتوى الرئيسي
            </a>
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)} role="button" aria-label="الذهاب لأعلى الصفحة">
                        <img src="/logo.webp" alt="Ad Syria AI شعار وكالة التسويق" className="w-10 h-10 rounded-xl shadow-lg shadow-sky-200" width="40" height="40" fetchpriority="high" />
                        <span className="text-xl font-bold tracking-tight text-slate-900">Ad Syria Ai</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10">
                        <a href="#about" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">من نحن</a>
                        <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">كيف نعمل</a>
                        <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">الأسعار</a>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 ml-4">
                            <a href="https://wa.me/message/B73TKEIEH3J4L1" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-green-500 transition-colors" aria-label="تواصل معنا عبر واتساب">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                            </a>
                            <a href="https://www.instagram.com/adsyriaai?igsh=eHJqeXN0dm55Z2dj" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-pink-600 transition-colors" aria-label="تابعنا على انستغرام">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </a>
                            <a href="https://www.facebook.com/share/1D6jq1QfPK/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors" aria-label="تابعنا على فيسبوك">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            </a>
                        </div>
                        {isLoggedIn ? (
                            <Link to="/dashboard" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-sky-100">
                                لوحة التحكم
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-semibold text-slate-900 hover:text-sky-600 transition-colors">دخول</Link>
                                <Link to="/signup" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-sky-100">
                                    ابدأ الآن
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-slate-600 hover:text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={isMenuOpen}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-xl px-6 py-8 flex flex-col gap-6 animate-in slide-in-from-top-5">
                        <a href="#about" className="text-lg font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>من نحن</a>
                        <a href="#how-it-works" className="text-lg font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>كيف نعمل</a>
                        <a href="#pricing" className="text-lg font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>الأسعار</a>
                        <div className="flex gap-4">
                            <a href="https://wa.me/message/B73TKEIEH3J4L1" target="_blank" rel="noopener noreferrer" className="text-green-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                            </a>
                        </div>
                        <hr className="border-slate-100" />
                        {isLoggedIn ? (
                            <Link to="/dashboard" className="bg-sky-600 text-white py-3 rounded-xl text-center font-bold shadow-lg shadow-sky-100" onClick={() => setIsMenuOpen(false)}>
                                لوحة التحكم
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-lg font-semibold text-slate-900" onClick={() => setIsMenuOpen(false)}>تسجيل الدخول</Link>
                                <Link to="/signup" className="bg-sky-600 text-white py-3 rounded-xl text-center font-bold shadow-lg shadow-sky-100" onClick={() => setIsMenuOpen(false)}>
                                    ابدأ الآن
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header id="main-content" className="pt-32 pb-16 md:pt-40 md:pb-24 hero-gradient px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto text-center space-y-6 md:space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 px-4 py-1.5 rounded-full mx-auto">
                        <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] md:text-xs font-bold text-sky-700 uppercase tracking-widest flex items-center gap-2">
                            أول منصة ذكاء اصطناعي مخصصة لسوريا
                            <svg width="24" height="14" viewBox="0 0 30 18" className="rounded-sm shadow-sm inline-block">
                                <rect width="30" height="6" fill="#007A3D" />
                                <rect y="6" width="30" height="6" fill="#FFFFFF" />
                                <rect y="12" width="30" height="6" fill="#000000" />
                                <g fill="#EE1C23">
                                    <path d="M7.5 7.2l.4 1.2h1.3l-1 0.8.4 1.2-1.1-.7-1.1.7.4-1.2-1-.8h1.3z" />
                                    <path d="M15 7.2l.4 1.2h1.3l-1 0.8.4 1.2-1.1-.7-1.1.7.4-1.2-1-.8h1.3z" />
                                    <path d="M22.5 7.2l.4 1.2h1.3l-1 0.8.4 1.2-1.1-.7-1.1.7.4-1.2-1-.8h1.3z" />
                                </g>
                            </svg>
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.2] md:leading-tight max-w-4xl mx-auto">
                        ارتقِ ببراندك في سوريا <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-500">بصور عالمية ولهجة محلية.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
                        نحن لا نكتفي بتحسين الصور، بل نبني لك حملة إعلانية كاملة. صور بجودة استوديو 4K ومحتوى تسويقي يلامس زبائنك بلهجتهم السورية الحقيقية.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 px-4">
                        <Link to={isLoggedIn ? "/dashboard" : "/signup"} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl">
                            {isLoggedIn ? "الذهاب للوحة التحكم" : "ابدأ رحلتك"}
                        </Link>
                        <a href="#how-it-works" className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all text-center">
                            شاهد كيف يعمل
                        </a>
                    </div>
                </div>
            </header>

            {/* Visual Proof (Before & After) */}
            <section className="py-24 bg-white px-6" id="how-it-works">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">سحر التحول البصري</h2>
                    <p className="text-slate-500 mb-16 max-w-xl mx-auto">قارن بين تصوير الموبايل العادي وبين النتيجة التي ستحصل عليها باستخدام محركنا الذكي.</p>

                    <div className="relative w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                        {/* Before Image */}
                        <div className="relative rounded-[2rem] overflow-hidden shadow-xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500">
                            <img src={imgBefore} alt="صورة منتج عادية تم التقاطها بالهاتف - قبل التعديل" className="w-full h-auto object-cover" width="600" height="600" loading="lazy" />
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white font-bold text-sm">
                                قبل (تصوير موبايل)
                            </div>
                        </div>

                        {/* After Image */}
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-sky-500 transform -rotate-2 hover:rotate-0 transition-all duration-500 md:mt-12">
                            <img src={imgAfter} alt="صورة إعلانية احترافية للمنتج بعد معالجة الذكاء الاصطناعي" className="w-full h-auto object-cover" width="600" height="600" loading="lazy" />
                            <div className="absolute bottom-6 left-6 bg-sky-600 px-6 py-3 rounded-xl text-white font-bold shadow-lg flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                بعد (Ad Syria Ai)
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dialects Section */}
            <section id="about" className="py-24 bg-slate-50 px-6">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 mb-6">تحدث بلسان زبونك</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">نحن الوحيدون الذين نفهم الفرق بين الشامي والحلبي. الذكاء الاصطناعي لدينا مبرمج ليكتب لك بوستات تجذب زبائنك من أول كلمة.</p>
                </div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { city: 'دمشق', type: 'اللهجة الشامية', desc: '"يا مية أهلا بالقطع اللي بتاخد العقل، مو ناقصها غير ذوقك الشامي لـ تكمل."', footer: 'مثالي للملابس، المطاعم، والمجوهرات في قلب الشام.', color: 'sky' },
                        { city: 'حلب', type: 'اللهجة الحلبية', desc: '"عيني رب الشهباء.. شوفولي هالقطعة اللوز اللي بتشرح القلب، شغلة عالأصول!"', footer: 'مثالي للصناعات، الأحذية، والحلويات الحلبية الفاخرة.', color: 'teal' },
                        { city: 'حمص', type: 'اللهجة الحمصية', desc: '"وصل الجديد يا أكابر، شي عالعين والنني ومرتب عالاخر، ناطرينكن تختاروا."', footer: 'مثالي للعروض التجارية والمشاريع العائلية في حمص العدية.', color: 'orange' },
                        { city: 'الساحل', type: 'اللهجة الساحلية', desc: '"تحية بحرية.. القطعة اللي بتناسب رواءكن وصلت، جودة عالية وسعر ولا أحلى."', footer: 'مثالي للسياحة، المنتجات الطبيعية، والمشاريع في اللاذقية وطرطوس.', color: 'indigo' },
                    ].map((item, index) => (
                        <div key={index} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                            <div className={`w-12 h-12 bg-${item.color}-50 text-${item.city === 'دمشق' ? 'sky' : item.city === 'حلب' ? 'teal' : item.city === 'حمص' ? 'orange' : 'indigo'}-600 rounded-2xl flex items-center justify-center font-bold mb-6`}>{item.city}</div>
                            <h4 className="text-lg font-bold mb-3">{item.type}</h4>
                            <p className="text-sm text-slate-500 italic mb-4">{item.desc}</p>
                            <p className="text-xs text-slate-400">{item.footer}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-slate-900 mb-6">خطط تناسب جميع التجار</h2>
                    <p className="text-slate-600 mb-16 max-w-xl mx-auto">لأن الخطط مدفوعة، فنحن نضمن لك أولوية في التوليد وجودة صور لا تتوفر في أي مكان آخر.</p>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 flex flex-col text-right">
                            <h4 className="text-slate-400 font-bold text-xs mb-4 uppercase tracking-widest">باقة المشاريع الصغيرة</h4>
                            <div className="text-4xl font-bold text-slate-900 mb-8">$12 <span className="text-sm font-normal text-slate-500">/شهر</span></div>
                            <ul className="text-sm text-slate-600 space-y-4 mb-10 flex-grow">
                                <li>✓ 20 صورة محصول 4K</li>
                                <li>✓ 30 بوست تسويقي</li>
                                <li>✓ إزالة خلفية احترافية</li>
                                <li>✓ النمط السوري العصري</li>
                            </ul>
                            <Link to={isLoggedIn ? "/dashboard" : "/signup"} className="w-full block text-center py-4 rounded-2xl border border-slate-200 font-bold hover:bg-slate-50 transition-all">
                                {isLoggedIn ? "اشترك من لوحة التحكم" : "اشترك الآن"}
                            </Link>
                        </div>

                        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-2 border-sky-500 transform scale-105 z-10 text-right flex flex-col relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full">الأكثر طلباً</div>
                            <h4 className="text-sky-600 font-bold text-xs mb-4 uppercase tracking-widest">باقة التاجر المحترف</h4>
                            <div className="text-4xl font-bold text-slate-900 mb-8">$19 <span className="text-sm font-normal text-slate-500">/شهر</span></div>
                            <ul className="text-sm text-slate-600 space-y-4 mb-10 flex-grow">
                                <li className="font-bold text-slate-800">✓ 50 صورة فائقة الجودة</li>
                                <li className="font-bold text-slate-800">✓ 60 بوست تسويقي احترافي</li>
                                <li className="font-bold text-slate-800">✓ دعم كافة اللهجات</li>
                                <li className="font-bold text-slate-800">✓ ديكورات مناطقية</li>
                                <li className="font-bold text-slate-800">✓ أولوية في المعالجة</li>
                            </ul>
                            <Link to={isLoggedIn ? "/dashboard" : "/signup"} className="w-full block text-center py-4 rounded-2xl bg-sky-600 text-white font-bold hover:bg-sky-700 shadow-lg shadow-sky-200">
                                {isLoggedIn ? "اشترك من لوحة التحكم" : "ابدأ الاحتراف"}
                            </Link>
                        </div>

                        <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 flex flex-col text-right">
                            <h4 className="text-slate-400 font-bold text-xs mb-4 uppercase tracking-widest">باقة الشركات</h4>
                            <div className="text-4xl font-bold text-slate-900 mb-8">$49 <span className="text-sm font-normal text-slate-500">/3 شهور</span></div>
                            <ul className="text-sm text-slate-600 space-y-4 mb-10 flex-grow">
                                <li className="text-sky-600 font-bold">✓ 120 صورة عالية الدقة</li>
                                <li className="text-sky-600 font-bold">✓ 130 بوست تسويقي</li>
                                <li>✓ استهداف ديموغرافي</li>
                                <li>✓ دعم فني مخصص</li>
                            </ul>
                            <Link to={isLoggedIn ? "/dashboard" : "/signup"} className="w-full block text-center py-4 rounded-2xl border border-slate-200 font-bold hover:bg-slate-50 transition-all">
                                {isLoggedIn ? "اشترك من لوحة التحكم" : "تواصل معنا"}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 py-20 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-right">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-white">
                            <span className="text-2xl font-bold">Ad Syria Ai</span>
                        </div>
                        <p className="text-sm">نحن نبني مستقبل التجارة الإلكترونية في سوريا من خلال الذكاء الاصطناعي.</p>
                        <div className="flex gap-4 pt-2" role="list" aria-label="روابط التواصل الاجتماعي">
                            <a href="https://wa.me/message/B73TKEIEH3J4L1" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-2 rounded-lg text-white hover:bg-green-500 transition-all focus:ring-2 focus:ring-green-500" aria-label="تواصل عبر واتساب">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                            </a>
                            <a href="https://www.instagram.com/adsyriaai?igsh=eHJqeXN0dm55Z2dj" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-2 rounded-lg text-white hover:bg-pink-600 transition-all focus:ring-2 focus:ring-pink-500" aria-label="تابعنا على انستغرام">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </a>
                            <a href="https://www.facebook.com/share/1D6jq1QfPK/" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-2 rounded-lg text-white hover:bg-blue-600 transition-all focus:ring-2 focus:ring-blue-500" aria-label="تابعنا على فيسبوك">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            </a>
                        </div>
                    </div>
                    <nav aria-label="روابط الموقع">
                        <h2 className="text-white font-bold mb-6">الروابط</h2>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#about" className="hover:text-white transition-colors">من نحن</a></li>
                            <li><a href="#pricing" className="hover:text-white transition-colors">الأسعار</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
                        </ul>
                    </nav>
                    <nav aria-label="روابط الدعم">
                        <h2 className="text-white font-bold mb-6">الدعم</h2>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">الأسئلة الشائعة</a></li>
                            <li><a href="https://wa.me/message/B73TKEIEH3J4L1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">تواصل معنا</a></li>
                        </ul>
                    </nav>
                </div>
                <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-slate-800 text-center text-xs">
                    © 2024 Ad Syria Ai سوريا. جميع الحقوق محفوظة.
                </div>
            </footer>
        </div>
    );
};

export default Landing;
