// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginRequest } from '../services/authApi';

const AuthContext = createContext(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return ctx;
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(false);

    // Cada vez que cambie el token, podrías configurar headers globales (axios) o similar.
    useEffect(() => {
        if (!token) return;
        // Aquí podrías hacer una llamada a /api/auth/me para refrescar datos, si quieres.
    }, [token]);

    async function login({ email, password }) {
        setLoading(true);
        try {
            const data = await loginRequest({ email, password });
            const accessToken = data.access_token;
            const userData = data.user;

            localStorage.setItem('token', accessToken);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(accessToken);
            setUser(userData);

            return { token: accessToken, user: userData };
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }

    const value = {
        token,
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
