import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-amber-50">
                <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-700 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-amber-50 p-4">
                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 max-w-md w-full text-center">
                    {/* Icône — douce, pas alarmiste */}
                    <div className="mb-5">
                        <svg
                            className="w-14 h-14 mx-auto text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    <h2 className="text-xl font-semibold text-stone-800 mb-2">Accès non autorisé</h2>
                    <p className="text-stone-600 mb-6">
                        Vous n’avez pas les droits nécessaires pour accéder à cette page. Veuillez contacter votre administrateur.
                    </p>

                    {/* Bouton harmonisé */}
                    <button
                        onClick={() => window.history.back()}
                        className="w-full py-2.5 px-4 rounded-xl bg-amber-700 hover:bg-[#92400e] text-white font-medium transition-colors"
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;