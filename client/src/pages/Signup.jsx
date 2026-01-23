import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const Signup = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [registrationMethod, setRegistrationMethod] = useState('phone'); // 'phone' or 'email'
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Send either phone OR email based on selection
            const payload = {
                firstName,
                lastName,
                password,
                phone: registrationMethod === 'phone' ? phone : null,
                email: registrationMethod === 'email' ? email : null
            };

            await signup(payload);
            toast.success('تم إنشاء الحساب بنجاح! مرحباً بك 🎉');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error) {
            const message = error.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen hero-gradient flex flex-col font-sans" dir="rtl">
            <Toaster position="top-center" reverseOrder={false} />
            {/* Navigation */}
            <nav className="p-6">
                <Link to="/" className="flex items-center gap-2 w-fit">
                    <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="font-bold text-slate-900">Ad Syria Ai</span>
                </Link>
            </nav>

            {/* Signup Form Section */}
            <main className="flex-grow flex items-center justify-center px-6 py-12">
                <div className="max-w-md w-full glass-card p-10 rounded-[2.5rem] border border-white/60">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">ابدأ رحلة النجاح</h2>
                        <p className="text-slate-500">انضم لأكثر من 1000 تاجر سوري مبدع</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-right">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">الاسم</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="أحمد"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-2 focus:ring-sky-500 outline-none transition-all text-right"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">الكنية</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="علي"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-2 focus:ring-sky-500 outline-none transition-all text-right"
                                />
                            </div>
                        </div>

                        {/* Toggle Method */}
                        <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                            <button
                                type="button"
                                onClick={() => setRegistrationMethod('phone')}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${registrationMethod === 'phone'
                                    ? 'bg-white text-sky-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                رقم الهاتف
                            </button>
                            <button
                                type="button"
                                onClick={() => setRegistrationMethod('email')}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${registrationMethod === 'email'
                                    ? 'bg-white text-sky-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                البريد الإلكتروني
                            </button>
                        </div>

                        {registrationMethod === 'phone' ? (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">رقم الهاتف</label>
                                <input
                                    type="tel"
                                    required={registrationMethod === 'phone'}
                                    placeholder="0912345678"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-2 focus:ring-sky-500 outline-none transition-all text-right"
                                    dir="ltr"
                                />
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    required={registrationMethod === 'email'}
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-2 focus:ring-sky-500 outline-none transition-all text-right"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">كلمة المرور</label>
                            <input
                                type="password"
                                required
                                placeholder="8+ أحرف"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-2 focus:ring-sky-500 outline-none transition-all text-right"
                            />
                        </div>

                        <div className="text-[10px] text-slate-500 py-2 leading-relaxed">
                            بالتسجيل، أنت توافق على <a href="#" className="text-sky-600 underline">شروط الخدمة</a> و <a href="#"
                                className="text-sky-600 underline">سياسة الخصوصية</a> الخاصة بـ Ad Syria Ai.
                        </div>

                        <button type="submit" disabled={isLoading}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2">
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>جاري إنشاء الحساب...</span>
                                </>
                            ) : (
                                'إنشاء الحساب'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-8">
                        لديك حساب بالفعل؟ <Link to="/login" className="text-slate-900 font-bold hover:underline">تسجيل الدخول</Link>
                    </p>
                </div>
            </main>

            <footer className="p-6 text-center text-xs text-slate-400">
                © 2024 Ad Syria Ai سوريا.
            </footer>
        </div>
    );
};

export default Signup;
