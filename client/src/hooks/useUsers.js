import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

/**
 * useUsers - Custom hook for managing users (Admin)
 * @returns {object} { users, isLoading, fetchUsers }
 */
const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/api/users');
            if (res.data.success) {
                setUsers(res.data.users);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            const message = error.response?.data?.message || 'فشل تحميل بيانات المستخدمين';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const createUser = async (userData) => {
        try {
            const res = await api.post('/api/users', userData);
            return res.data;
        } catch (error) {
            console.error("Create user failed", error);
            return {
                success: false,
                message: error.response?.data?.message || 'فشل الاتصال بالخادم'
            };
        }
    };

    const deleteUser = async (userId) => {
        try {
            const res = await api.delete(`/api/users/${userId}`);
            return res.data;
        } catch (error) {
            console.error("Delete user failed", error);
            return {
                success: false,
                message: error.response?.data?.message || 'فشل حذف المستخدم'
            };
        }
    };

    return { users, isLoading, fetchUsers, createUser, deleteUser };
};

export default useUsers;
