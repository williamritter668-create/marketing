import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { useInvalidateUser } from '../../hooks'; // Import hook

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const lastNotifIdRef = useRef(null); // Track last notification to detect changes
    const invalidateUser = useInvalidateUser();

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/api/notifications');
            if (res.data.success) {
                const newNotifs = res.data.notifications;
                setNotifications(newNotifs);
                setUnreadCount(newNotifs.filter(n => !n.isRead).length);

                // Detect new notification to refresh user data (e.g. credits updated)
                if (newNotifs.length > 0) {
                    const latestId = newNotifs[0].id;
                    if (lastNotifIdRef.current !== latestId) {
                        lastNotifIdRef.current = latestId;
                        // Refresh user data if meaningful change might have happened
                        invalidateUser();
                    }
                }
            }
        } catch (err) {
            console.error('Failed to fetch notifications');
        }
    };

    useEffect(() => {
        fetchNotifications(); // Initial fetch
        const interval = setInterval(fetchNotifications, 10000); // Poll every 10s for faster updates
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await api.post('/api/notifications/mark-read', { id });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark read');
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.post('/api/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all read');
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'SUCCESS': return 'text-green-500 bg-green-50';
            case 'WARNING': return 'text-red-500 bg-red-50';
            case 'INFO': return 'text-sky-500 bg-sky-50';
            default: return 'text-slate-500 bg-slate-50';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
                title="الإشعارات"
            >
                <svg className={`w-6 h-6 ${unreadCount > 0 ? 'text-slate-700' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="absolute top-14 left-auto right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[999] overflow-hidden transform origin-top-right flex flex-col"
                    dir="rtl"
                >
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-white">
                        <h3 className="font-bold text-slate-800 text-sm">الإشعارات</h3>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead} className="text-[10px] text-sky-500 hover:text-sky-600 font-bold">
                                تحديد الكل كمقروء
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto custom-scrollbar bg-white">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-xs">
                                لا توجد إشعارات جديدة
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                                    className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer text-right ${notif.isRead ? 'opacity-60' : 'bg-sky-50/40 relative'}`}
                                >
                                    {!notif.isRead && <span className="absolute top-4 left-4 w-2 h-2 bg-sky-500 rounded-full"></span>}
                                    <div className="flex gap-3 items-start">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${getTypeColor(notif.type)}`}>
                                            <div className="w-2 h-2 rounded-full bg-current"></div>
                                        </div>
                                        <div>
                                            <h4 className={`text-xs font-bold mb-1 ${notif.isRead ? 'text-slate-600' : 'text-slate-900'}`}>{notif.title}</h4>
                                            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{notif.message}</p>
                                            <span className="text-[9px] text-slate-300 mt-2 block font-mono">
                                                {new Date(notif.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


export default NotificationBell;
