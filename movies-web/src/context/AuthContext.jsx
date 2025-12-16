import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { logoutUser, getFavorites } from '@/service/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });

    const [favoriteIds, setFavoriteIds] = useState([]);

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

    const loadFavorites = async () => {
        if (!token) {
            setFavoriteIds([]);
            return;
        }
        try {
            const favorites = await getFavorites();
            const ids = favorites.map(f => f.id);
            setFavoriteIds(ids);
        } catch (err) {
            console.error('Load favorites failed', err);
            setFavoriteIds([]);
        }
    };

    // Auto-load favorites when user is authenticated (on mount or after login)
    useEffect(() => {
        if (isAuthenticated) {
            loadFavorites();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const login = async (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        // Load favorites after login
        try {
            const favorites = await getFavorites();
            const ids = favorites.map(f => f.id);
            setFavoriteIds(ids);
        } catch (err) {
            console.error('Load favorites failed', err);
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error('Logout failed', err);
        } finally {
            setUser(null);
            setToken(null);
            setFavoriteIds([]);
        }
    };

    const addToFavorites = (movieId) => {
        if (!favoriteIds.includes(movieId)) {
            setFavoriteIds(prev => [...prev, movieId]);
        }
    };

    const removeFromFavorites = (movieId) => {
        setFavoriteIds(prev => prev.filter(id => id !== movieId));
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated,
            favoriteIds,
            login,
            logout,
            loadFavorites,
            addToFavorites,
            removeFromFavorites
        }}>
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
