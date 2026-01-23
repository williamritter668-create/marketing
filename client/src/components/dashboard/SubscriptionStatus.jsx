import { useState, useEffect } from 'react';
import api from '../../api/axios';

/**
 * SubscriptionStatus - Shows user's current subscription requests status
 * This component displays pending/approved subscription status to the user
 */
const SubscriptionStatus = () => {
    const [latestSub, setLatestSub] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMySubscriptions = async () => {
            try {
                const res = await api.get('/api/subscriptions/my-subscriptions');
                if (res.data.success && res.data.subscriptions.length > 0) {
                    // Get the most recent subscription
                    setLatestSub(res.data.subscriptions[0]);
                }
            } catch (error) {
                console.error('Failed to fetch subscriptions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMySubscriptions();

        // Poll every 30 seconds
        const interval = setInterval(fetchMySubscriptions, 30000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading || !latestSub) return null;

    const getStatusStyle = () => {
        switch (latestSub.status) {
            case 'PENDING':
                return 'bg-orange-50 border-orange-200 text-orange-600';
            case 'APPROVED':
                return 'bg-green-50 border-green-200 text-green-600';
            case 'REJECTED':
                return 'bg-red-50 border-red-200 text-red-600';
            default:
                return 'bg-slate-50 border-slate-200 text-slate-600';
        }
    };

    const getStatusText = () => {
        switch (latestSub.status) {
            case 'PENDING':
                return 'قيد المراجعة';
            case 'APPROVED':
                return 'تم التفعيل ✓';
            case 'REJECTED':
                return 'مرفوض';
            default:
                return latestSub.status;
        }
    };

    const getStatusIcon = () => {
        switch (latestSub.status) {
            case 'PENDING':
                return (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                );
            case 'APPROVED':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'REJECTED':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`rounded-2xl p-3 border ${getStatusStyle()} mb-3`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {getStatusIcon()}
                    <span className="text-[10px] font-bold uppercase tracking-wide">طلب اشتراك</span>
                </div>
                <span className="text-[10px] font-bold">{getStatusText()}</span>
            </div>
            {latestSub.status === 'PENDING' && (
                <p className="text-[9px] mt-1 opacity-75">جاري مراجعة طلبك من قبل الإدارة...</p>
            )}
        </div>
    );
};

export default SubscriptionStatus;
