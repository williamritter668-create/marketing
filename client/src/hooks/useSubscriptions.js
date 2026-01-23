import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

/**
 * useSubscriptions - Custom hook for managing subscriptions (Admin)
 */
const useSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSubscriptions = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/api/subscriptions');
            if (res.data.success) {
                setSubscriptions(res.data.subscriptions);
            }
        } catch (error) {
            console.error("Failed to fetch subscriptions", error);
            const message = error.response?.data?.message || 'فشل تحميل الاشتراكات';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleAction = useCallback(async (id, action) => {
        try {
            await api.post(`/api/subscriptions/${id}/${action}`);
            await fetchSubscriptions(); // Refresh list
            return { success: true, action };
        } catch (error) {
            console.error("Action failed", error);
            return { success: false, error };
        }
    }, [fetchSubscriptions]);

    return { subscriptions, isLoading, fetchSubscriptions, handleAction };
};

export default useSubscriptions;
