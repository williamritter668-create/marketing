import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Send 'identifier' instead of 'email'
            const user = await login(identifier, password);
            toast.success('مرحباً بعودتك! 👋');
            setTimeout(() => {
                if (user && user.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }, 1000);
        } catch (error) {
            const message = error.response?.data?.message || 'فشل تسجيل الدخول: تأكد من صحة البيانات';
            toast.error(message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen hero-gradient flex flex-col font-sans" dir="rtl">
            <Toaster position="top-center" reverseOrder={false} />
            {/* Same Navigation */}
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

            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white rounded-[2.5rem] shadow-xl w-full max-w-md p-8 md:p-12 animate-in zoom-in duration-500 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"></div>
                    <div className="relative">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">تسجيل الدخول</h2>
                            <p className="text-slate-500">مرحباً بعودتك! أدخل بياناتك للمتابعة</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">رقم الهاتف أو البريد الإلكتروني</label>
                                <input
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-sky-500 outline-none transition-all text-right"
                                    placeholder="0912345678"
                                    dir="auto"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">كلمة المرور</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 relative overflow-hidden flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>جاري الدخول...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>دخول</span>
                                        <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-slate-500">
                            ليس لديك حساب؟{' '}
                            <Link to="/signup" className="text-sky-600 font-bold hover:underline">
                                سجل الآن
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
