import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            setError('');
            await login(data);
            const user = JSON.parse(localStorage.getItem('user'));
            user.role === 'CLIENT' ? navigate('/client/dashboard') : navigate('/admin/clients');
        } catch (err) {
            setError(err?.response?.data?.message || 'Identifiants incorrects');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100 p-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-sm relative z-10"
            >
                {/* Carte glassmorphism */}
                <motion.div
                    whileHover={{ y: -3, boxShadow: "0 15px 35px rgba(156,120,100,0.3)" }}
                    className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-stone-200 p-8"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-2xl">MB</span>
                        </div>
                        <h1 className="mt-4 text-3xl font-bold text-stone-800">MyBank</h1>
                        <p className="mt-1 text-stone-500 text-sm">Connexion sécurisée à votre espace</p>
                    </div>

                    {/* Erreur */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-5 flex items-center justify-between rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700"
                        >
                            <span>{error}</span>
                            <button onClick={() => setError('')}>
                                <X className="h-4 w-4 hover:text-rose-800" />
                            </button>
                        </motion.div>
                    )}

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                Nom d'utilisateur
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                <input
                                    {...register('username', { required: true })}
                                    type="text"
                                    placeholder="salma.azizi"
                                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-stone-300 bg-white/60 text-stone-800 placeholder:text-stone-400
                    focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                                />
                            </div>
                            {errors.username && <p className="mt-1 text-sm text-rose-600">Champ requis</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                <input
                                    {...register('password', { required: true })}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 bg-white/60 text-stone-800 placeholder:text-stone-400
                    focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-rose-600">Champ requis</p>}
                        </div>

                        {/* Submit */}
                        <motion.button
                            whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(156,120,100,0.5), 0 0 30px rgba(200,180,150,0.3)" }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-white font-semibold shadow-md transition"
                        >
                            {isSubmitting ? 'Connexion...' : 'Se connecter'}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-stone-400">
                    © 2026 MyBank — Banque digitale élégante et sécurisée
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
