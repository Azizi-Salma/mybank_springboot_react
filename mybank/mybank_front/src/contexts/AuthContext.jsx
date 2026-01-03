import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            const token = authService.getToken();
            const currentUser = authService.getCurrentUser();

            if (token && currentUser) {
                setUser(currentUser);
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            localStorage.setItem('token', response.token);
            localStorage.setItem(
                'user',
                JSON.stringify({
                    username: response.username,
                    role: response.role
                })
            );
            setUser({
                username: response.username,
                role: response.role
            });
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const changePassword = async (passwordData) => {
        try {
            await authService.changePassword(passwordData);
        } catch (error) {
            throw error;
        }
    };

    const hasRole = (role) => {
        return user && user.role === role;
    };

    const value = {
        user,
        login,
        logout,
        changePassword,
        hasRole,
        isAuthenticated: !!user,
        loading
    };

    // Écran de chargement harmonisé
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-amber-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-amber-700 border-b-amber-200"></div>
                    <span className="mt-4 text-base font-medium text-stone-700">
                        Chargement de vos données...
                    </span>
                </div>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};