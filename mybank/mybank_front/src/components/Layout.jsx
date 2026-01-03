import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Settings, CreditCard, Users, Home, ArrowRight } from 'lucide-react';

const Layout = () => {
    const { user, logout, hasRole } = useAuth();

    // Classe commune pour les liens
    const linkClass = "flex items-center px-4 py-2.5 rounded-xl text-stone-700 hover:bg-amber-700 hover:text-white transition-colors";

    return (
        <div className="flex min-h-screen bg-amber-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-stone-200 p-6 flex flex-col shadow-sm">
                <h1 className="text-2xl font-semibold text-stone-800 mb-8">MyBank</h1>
                <nav className="flex-1 space-y-1">
                    {hasRole('CLIENT') && (
                        <>
                            <Link to="/client/dashboard" className={linkClass}>
                                <Home className="w-5 h-5 mr-3" />
                                Tableau de bord
                            </Link>
                            <Link to="/client/transfer" className={linkClass}>
                                <ArrowRight className="w-5 h-5 mr-3" />
                                Nouveau virement
                            </Link>
                        </>
                    )}
                    {hasRole('AGENT_GUICHET') && (
                        <>
                            <Link to="/admin/clients" className={linkClass}>
                                <Users className="w-5 h-5 mr-3" />
                                Gestion des clients
                            </Link>
                            <Link to="/admin/accounts" className={linkClass}>
                                <CreditCard className="w-5 h-5 mr-3" />
                                Gestion des comptes
                            </Link>
                        </>
                    )}
                    <Link to="/change-password" className={linkClass}>
                        <Settings className="w-5 h-5 mr-3" />
                        Changer mot de passe
                    </Link>
                </nav>

                {/* User Info + Logout */}
                <div className="mt-auto pt-6 border-t border-stone-200">
                    <div className="flex items-center space-x-3 mb-3">
                        <User className="w-5 h-5 text-stone-500" />
                        <span className="text-stone-700 font-medium truncate">{user?.username}</span>
                    </div>
                    <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                        {user?.role?.replace('_', ' ')}
                    </span>
                    <button
                        onClick={logout}
                        className="w-full mt-4 flex items-center justify-center px-4 py-2 rounded-xl bg-amber-700 hover:bg-[#92400e] text-white font-medium transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 sm:p-8 bg-amber-50">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;