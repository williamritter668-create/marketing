import { useState } from 'react';

const ProfileTab = ({ user, onSubscribeClick }) => {
    // Determine Plan Color
    const getPlanColor = (plan) => {
        if (!plan) return 'bg-slate-100 text-slate-500';
        const p = plan.toLowerCase();
        if (p.includes('pro') || p.includes('تاجر')) return 'bg-purple-100 text-purple-600';
        if (p.includes('elite') || p.includes('شركات')) return 'bg-amber-100 text-amber-600';
        return 'bg-blue-100 text-blue-600';
    };

    // Format Date safely
    const joinDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric' }) // Just Year like '2024'
        : '2024';

    return (
        <div className="flex-grow flex flex-col gap-8 overflow-y-auto custom-scrollbar p-1 pb-48 md:pb-1">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">الملف الشخصي</h1>
                <p className="text-slate-500 text-sm">إدارة بياناتك وتفاصيل اشتراكك</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Personal Info Card */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100%] -mr-10 -mt-10 z-0"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-slate-200">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">{user?.name}</h2>
                        <span className="text-slate-400 text-sm mb-6 bg-slate-50 px-3 py-1 rounded-full">
                            {user?.email || user?.phone || 'No Contact Info'}
                        </span>

                        <div className="w-full grid grid-cols-2 gap-4 mt-4">
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <span className="block text-xs text-slate-400 mb-1">نوع الحساب</span>
                                <span className="font-bold text-slate-700">{user?.role === 'ADMIN' ? 'مدير النظام' : 'عميل'}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <span className="block text-xs text-slate-400 mb-1">تاريخ الانضمام</span>
                                <span className="font-bold text-slate-700">{joinDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscription Info Card */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-800">تفاصيل الباقة الحالية</h3>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getPlanColor(user?.currentPlan)}`}>
                                {user?.currentPlan || 'Free'}
                            </span>
                        </div>

                        <div className="space-y-6">
                            {/* Credits Bar */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-500">رصيد الصور (AI Images)</span>
                                    <span className="font-bold text-slate-800">{user?.credits || 0}</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-sky-500 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(((user?.credits || 0) / 100) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2">
                                    تستخدم لتوليد الصور في الاستوديو.
                                </p>
                            </div>

                            {/* Post Credits Bar */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-500">رصيد النصوص (Copywriting)</span>
                                    <span className="font-bold text-slate-800">{user?.postCredits || 0}</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(((user?.postCredits || 0) / 50) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onSubscribeClick}
                        className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                        ترقية الباقة
                    </button>
                </div>
            </div>
            {/* Contact Support Section */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] text-white text-center relative">
                {/* Decorative Background - Clipped */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-[2.5rem]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
                </div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">هل تحتاج مساعدة؟</h3>
                    <p className="text-slate-400 mb-4 md:mb-8 text-sm md:text-base hidden md:block">فريقنا جاهز لمساعدتك في أي وقت. تواصل معنا عبر القنوات التالية.</p>

                    <div className="flex flex-wrap justify-center gap-2 md:gap-4">

                        <a
                            href="https://wa.me/message/B73TKEIEH3J4L1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600/10 hover:bg-green-600 hover:text-white border border-green-600/30 text-green-400 py-2 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 transition-all group text-sm md:text-base"
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            <span className="font-bold">واتساب</span>
                        </a>

                        <a
                            href="https://www.facebook.com/share/1D6jq1QfPK/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600/10 hover:bg-blue-600 hover:text-white border border-blue-600/30 text-blue-400 py-2 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 transition-all group text-sm md:text-base"
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            <span className="font-bold">فيسبوك</span>
                        </a>

                        <a
                            href="https://www.instagram.com/adsyriaai?igsh=eHJqeXN0dm55Z2dj"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-pink-600/10 hover:bg-pink-600 hover:text-white border border-pink-600/30 text-pink-400 py-2 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 transition-all group text-sm md:text-base"
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            <span className="font-bold">انستجرام</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
