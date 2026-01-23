import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

/**
 * useProjects - Custom hook for managing user projects
 * @returns {object} { projects, isLoading, fetchProjects }
 */
const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/api/projects');
            if (response.data.success) {
                setProjects(response.data.projects);
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return { projects, isLoading, fetchProjects };
};

export default useProjects;
