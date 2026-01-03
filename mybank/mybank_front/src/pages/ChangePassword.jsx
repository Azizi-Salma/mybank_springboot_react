import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';

const ChangePassword = () => {
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { changePassword } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch
    } = useForm();

    const newPassword = watch('newPassword');

    const onSubmit = async (data) => {
        try {
            setError('');
            setSuccess('');
            await changePassword(data);
            setSuccess('Mot de passe modifié avec succès');
            setTimeout(() => {
                navigate(-1);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <div className="min-h-screen bg-amber-50 py-12 px-4">
            <div className="max-w-md mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-stone-600 hover:text-stone-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 text-stone-500" />
                        Retour
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-amber-50">
                            <Lock className="h-6 w-6 text-amber-700" />
                        </div>
                        <h2 className="mt-4 text-xl font-semibold text-stone-800">
                            Changer le mot de passe
                        </h2>
                        <p className="mt-2 text-sm text-stone-600">
                            Modifiez votre mot de passe pour sécuriser votre compte
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-lg text-sm">
                                {success}
                            </div>
                        )}

                        {/* Ancien mot de passe */}
                        <div>
                            <label htmlFor="oldPassword" className="block text-sm font-medium text-stone-700 mb-1.5">
                                Ancien mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    {...register('oldPassword', { required: 'Ancien mot de passe requis' })}
                                    type={showPasswords.old ? 'text' : 'password'}
                                    id="oldPassword"
                                    autoComplete="current-password"
                                    className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                                    placeholder="Entrez votre ancien mot de passe"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                                    onClick={() => togglePasswordVisibility('old')}
                                >
                                    {showPasswords.old ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.oldPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.oldPassword.message}</p>
                            )}
                        </div>

                        {/* Nouveau mot de passe */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-stone-700 mb-1.5">
                                Nouveau mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    {...register('newPassword', {
                                        required: 'Nouveau mot de passe requis',
                                        minLength: {
                                            value: 4,
                                            message: 'Le mot de passe doit contenir au moins 4 caractères'
                                        }
                                    })}
                                    type={showPasswords.new ? 'text' : 'password'}
                                    id="newPassword"
                                    autoComplete="new-password"
                                    className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                                    placeholder="Entrez votre nouveau mot de passe"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                                    onClick={() => togglePasswordVisibility('new')}
                                >
                                    {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                            )}
                        </div>

                        {/* Confirmation */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-1.5">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    {...register('confirmPassword', {
                                        required: 'Confirmation requise',
                                        validate: value => value === newPassword || 'Les mots de passe ne correspondent pas'
                                    })}
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                                    placeholder="Confirmez votre nouveau mot de passe"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                >
                                    {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Boutons */}
                        <div className="flex space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 py-2.5 px-4 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 transition"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 px-4 rounded-lg bg-amber-700 hover:bg-[#92400e] text-white font-medium transition-colors"
                            >
                                {isSubmitting ? (
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
                                ) : (
                                    'Changer'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;