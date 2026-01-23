import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ user: null, isAuthenticated: false, loading: true });

    // Function to check auth state
    const checkAuth = async () => {
        try {
            const response = await api.get('/auth/me');
            if (response.data.isAuthenticated && response.data.user) {
                setAuth({ user: response.data.user, isAuthenticated: true, loading: false });
            } else {
                setAuth({ user: null, isAuthenticated: false, loading: false });
            }
        } catch (error) {
            console.log("Not authenticated");
            setAuth({ user: null, isAuthenticated: false, loading: false });
        }
    };

    // Check on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (identifier, password) => {
        try {
            // Note: backend expects 'identifier' but check if previous code sent 'email'
            // We changed backend to expect 'identifier' for clarity, but standard 'email' field in body might be used if backward compat needed.
            // Our updated backend code strictly uses 'req.body.identifier' OR expects mapping.
            // Let's ensure we match what we wrote in controller.
            // Wait, in controller I wrote: const { identifier, password } = req.body;
            // So we must send 'identifier'.
            const res = await api.post('/auth/login', { identifier, password });
            if (res.data.success) {
                setAuth({ user: res.data.user, isAuthenticated: true, loading: false });
                return res.data.user;
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout error:", error);
        }
        setAuth({ user: null, isAuthenticated: false, loading: false });
    };

    const signup = async ({ firstName, lastName, email, phone, password }) => {
        try {
            const res = await api.post('/auth/signup', { firstName, lastName, email, phone, password });
            if (res.data.success) {
                setAuth({ user: res.data.user, isAuthenticated: true, loading: false });
                return res.data.user;
            }
        } catch (error) {
            console.error("Signup failed:", error.response?.data?.message || error.message);
            throw error;
        }
    };

    const googleLogin = async (code) => {
        try {
            const res = await api.post('/auth/google', { code });
            if (res.data.success) {
                setAuth({ user: res.data.user, isAuthenticated: true, loading: false });
                return res.data.user;
            }
        } catch (error) {
            console.error("Google Login failed:", error.response?.data?.message || error.message);
            throw error;
        }
    };

    const refreshUser = async () => {
        await checkAuth();
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout, signup, googleLogin, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
