import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * AdminMobileNav - Bottom navigation bar for admin on mobile devices
 * @param {string} activeTab - Current active tab
 * @param {function} setActiveTab - Function to change active tab
 */
const AdminMobileNav = ({ activeTab, setActiveTab }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        {
            id: 'users',
            label: 'المستخدمين',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            id: 'billing',
            label: 'الطلبات',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
        }
    ];

    return (
        <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl z-50 flex justify-around items-center px-4 py-4">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center gap-1 transition-all px-4 py-2 rounded-xl ${activeTab === item.id
                            ? 'text-sky-400 bg-sky-500/20'
                            : 'text-slate-400'
                        }`}
                >
                    {item.icon}
                    <span className="text-[10px] font-bold">{item.label}</span>
                </button>
            ))}

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="flex flex-col items-center gap-1 text-red-400 hover:text-red-300 transition-all px-4 py-2"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-[10px] font-bold">خروج</span>
            </button>
        </nav>
    );
};

export default AdminMobileNav;
