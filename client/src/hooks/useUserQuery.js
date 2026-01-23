import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axios';

// --- Fetcher Functions ---

const fetchUser = async () => {
    const { data } = await axios.get('/auth/me');
    return data.user;
};

// --- Hooks ---

/**
 * Hook to fetch and keep user data in sync (Credits, Plan, etc.)
 */
export const useUserQuery = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
        refetchOnWindowFocus: true, // Refetch when user comes back to the tab
    });
};

/**
 * Hook to invalidate user data (force refresh)
 * Useful after actions like Generate or Subscribe
 */
export const useInvalidateUser = () => {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: ['user'] });
    };
};
