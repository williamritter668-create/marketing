import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * AdminSidebar - Desktop navigation sidebar for admin dashboard
 * Responsive: Hidden on mobile, visible on md+ screens
 * @param {string} activeTab - Current active tab
 * @param {function} setActiveTab - Function to change active tab
 */
const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        {
            id: 'users',
            label: 'إدارة المستخدمين',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            id: 'billing',
            label: 'الإيرادات والطلبات',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
        }
    ];

    return (
        <aside className="hidden md:flex w-72 bg-white/75 backdrop-blur-md border border-white/50 m-4 rounded-[2.5rem] flex-col p-6 shrink-0 shadow-sm">
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-lg leading-none text-slate-900">Ad Syria Ai</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">Admin Panel</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-grow space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-semibold transition-all ${activeTab === item.id
                                ? 'bg-sky-500 text-white shadow-md shadow-sky-200'
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Admin Info & Logout */}
            <div className="mt-auto p-4 bg-slate-900 rounded-[2rem] text-white">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center font-bold">AD</div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold">المدير العام</span>
                        <span className="text-[10px] text-slate-400">admin@adsyria.ai</span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all"
                >
                    تسجيل الخروج
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
