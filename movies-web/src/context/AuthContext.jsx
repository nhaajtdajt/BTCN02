import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { logoutUser } from '@/service/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });

    const isAuthenticated = useMemo(() => {
        return !!user && !!token;
    }, [user, token]);

    useEffect(() => {
        if (user && token) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }, [user, token]);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error('Logout failed', err);
        } finally {
            setUser(null);
            setToken(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
