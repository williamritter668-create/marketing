import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SubscriptionStatus from '../dashboard/SubscriptionStatus';
import { NotificationBell } from '../common'; // Import NotificationBell
import { useUserQuery } from '../../hooks';

/**
 * Sidebar - Desktop navigation sidebar for user dashboard
 * @param {string} activeTab - Current active tab
 * @param {function} setActiveTab - Function to change active tab
 */
const Sidebar = ({ activeTab, setActiveTab }) => {
    const { logout, auth } = useAuth();
    const navigate = useNavigate();

    // Use React Query for fresh user data (credits, plan)
    const { data: userData } = useUserQuery();
    // Fallback to auth context if React Query data not yet available
    const user = userData || auth?.user;

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        {
            id: 'studio',
            label: 'الاستوديو الذكي',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        },
        {
            id: 'history',
            label: 'الأعمال السابقة',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            id: 'pricing',
            label: 'خطط الاشتراك',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
        },
        {
            id: 'profile',
            label: 'الملف الشخصي',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        }
    ];

    return (
        <aside className="hidden md:flex w-20 lg:w-64 glass-panel rounded-[2.5rem] flex-col items-center lg:items-stretch py-8 shrink-0 shadow-sm bg-white/70 backdrop-blur-md border border-white/50 z-50 relative">
            {/* Logo & Notifications */}
            <div className="px-6 mb-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-sky-400 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200">
                        {/* Logo Icon */}
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden lg:block text-slate-800">Ad Syria</span>
                </div>
                {/* Notification Bell (Visible on Large Screens) */}
                <div className="hidden lg:block">
                    <NotificationBell />
                </div>
            </div>


            {/* Navigation */}
            <nav className="flex-grow space-y-2 px-3">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-4 rounded-2xl font-semibold transition-all ${activeTab === item.id
                            ? 'bg-white text-sky-500 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {item.icon}
                        <span className="hidden lg:block text-sm">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* User Credits Card & Logout */}
            <div className="px-3 mt-auto border-t border-slate-100 pt-6">
                {/* Subscription Status - Shows pending status */}
                <div className="hidden lg:block">
                    <SubscriptionStatus />
                </div>

                {/* Credits Card */}
                <div className="bg-slate-50 rounded-3xl p-4 hidden lg:block mb-2">
                    <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">باقتك الحالية</span>
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-600 text-[10px] font-bold rounded-md uppercase">
                            {user?.currentPlan || 'Free'}
                        </span>
                    </div>

                    {/* Image Credits */}
                    <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-slate-400">رصيد الصور</span>
                            <span className="text-sm font-bold text-slate-800">
                                {user?.credits > 9000 ? '∞' : user?.credits || 0}
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full">
                            <div
                                className="bg-sky-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((user?.credits || 0), 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Post Credits */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-slate-400">رصيد البوستات</span>
                            <span className="text-sm font-bold text-slate-800">
                                {user?.postCredits > 9000 ? '∞' : user?.postCredits || 0}
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full">
                            <div
                                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((user?.postCredits || 0), 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 rounded-2xl font-bold text-red-400 hover:bg-red-50 transition-all"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden lg:block text-xs">تسجيل الخروج</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
