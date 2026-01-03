import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // ⚠️ Ajout de useAuth
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import ClientDashboard from './pages/client/ClientDashboard';
import Transfer from './pages/client/Transfer';
import ClientManagement from './pages/admin/ClientManagement';
import AccountManagement from './pages/admin/AccountManagement';

// Composant de redirection intelligente
const RoleBasedRedirect = () => {
    const { user } = useAuth();

    if (user?.role === 'CLIENT') {
        return <Navigate to="/client/dashboard" replace />;
    }
    if (user?.role === 'AGENT_GUICHET') {
        return <Navigate to="/admin/clients" replace />;
    }

    // Par défaut (sécurité)
    return <Navigate to="/login" replace />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected layout */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        {/* Redirection racine selon rôle */}
                        <Route index element={<RoleBasedRedirect />} />

                        {/* Routes communes */}
                        <Route path="change-password" element={<ChangePathPassword />} />

                        {/* Routes Clients */}
                        <Route
                            path="client/dashboard"
                            element={
                                <ProtectedRoute requiredRole="CLIENT">
                                    <ClientDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="client/transfer"
                            element={
                                <ProtectedRoute requiredRole="CLIENT">
                                    <Transfer />
                                </ProtectedRoute>
                            }
                        />

                        {/* Routes Admins */}
                        <Route
                            path="admin/clients"
                            element={
                                <ProtectedRoute requiredRole="AGENT_GUICHET">
                                    <ClientManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="admin/accounts"
                            element={
                                <ProtectedRoute requiredRole="AGENT_GUICHET">
                                    <AccountManagement />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

// ⚠️ Correction du nom : il s'agit probablement de ChangePassword
const ChangePathPassword = ChangePassword;

export default App;