import React, { useState, useEffect } from 'react';
import {
    ArrowRight,
    CreditCard,
    TrendingUp,
    TrendingDown,
    Calendar,
    DollarSign,
    Users,
    BarChart3,
    PieChart
} from 'lucide-react';
import {
    BarChart as ReBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart as RePieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';

const ClientDashboard = () => {
    // Données simulées — looks real!
    const [accounts] = useState([
        {
            id: 1,
            rib: 'RIB011000200000987654321034',
            solde: 24500.75,
            status: 'OUVERT'
        },
        {
            id: 2,
            rib: 'RIB011000200000876543210987',
            solde: 12300.00,
            status: 'OUVERT'
        }
    ]);

    const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

    const operations = [
        { id: 1, date: '2026-01-03T10:30:00', description: 'Virement salaire', type: 'CREDIT', montant: 15000 },
        { id: 2, date: '2026-01-02T14:20:00', description: 'Paiement facture électricité', type: 'DEBIT', montant: 450 },
        { id: 3, date: '2026-01-01T09:15:00', description: 'Virement vers RIB011000200000123456789012', type: 'DEBIT', montant: 2000 },
        { id: 4, date: '2025-12-30T16:45:00', description: 'Remboursement', type: 'CREDIT', montant: 800 },
        { id: 5, date: '2025-12-28T11:00:00', description: 'Achat en ligne', type: 'DEBIT', montant: 1200 }
    ];

    // Données pour les graphiques
    const dailyOperations = [
        { date: 'Lun', credits: 15000, debits: 0 },
        { date: 'Mar', credits: 0, debits: 450 },
        { date: 'Mer', credits: 0, debits: 2000 },
        { date: 'Jeu', credits: 800, debits: 0 },
        { date: 'Ven', credits: 0, debits: 1200 }
    ];

    const pieData = [
        { name: 'Crédits', value: 15800 },
        { name: 'Débits', value: 3650 }
    ];
    const COLORS = ['#10b981', '#dc2626'];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount, type) => {
        const formatted = amount.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' });
        return type === 'DEBIT' ? `-${formatted}` : `+${formatted}`;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-stone-800">Bonjour, Salma</h1>
                    <p className="text-stone-600 mt-1">Voici un aperçu de vos comptes bancaires</p>
                </div>
                <button
                    onClick={() => window.location.href = '/client/transfer'}
                    className="mt-4 md:mt-0 flex items-center px-4 py-2.5 bg-amber-700 hover:bg-[#92400e] text-white rounded-lg shadow-sm transition-colors"
                >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Nouveau virement
                </button>
            </div>

            {/* Account Selector */}
            {accounts.length > 1 && (
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                        Sélectionner un compte
                    </label>
                    <select
                        value={selectedAccount?.id || ''}
                        onChange={(e) => {
                            const account = accounts.find(a => a.id === parseInt(e.target.value));
                            setSelectedAccount(account);
                        }}
                        className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    >
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.rib} - {account.solde.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {selectedAccount && (
                <>
                    {/* Résumé global */}
                    <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center">
                            <BarChart3 className="h-5 w-5 text-amber-700 mr-2" />
                            <h2 className="text-lg font-medium text-stone-800">Solde total</h2>
                        </div>
                        <p className="mt-1 text-2xl font-bold text-stone-800">
                            {accounts
                                .reduce((sum, acc) => sum + acc.solde, 0)
                                .toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}
                        </p>
                    </div>

                    {/* Cartes de compte */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                            <div className="flex items-center">
                                <div className="p-2.5 bg-amber-50 rounded-lg mr-4">
                                    <CreditCard className="w-6 h-6 text-amber-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-stone-500">Compte principal</p>
                                    <p className="text-lg font-semibold text-stone-800">{selectedAccount.rib}</p>
                                    <p className="mt-1 text-2xl font-bold text-stone-800">
                                        {selectedAccount.solde.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                            <div className="flex items-center">
                                <div className="p-2.5 bg-purple-50 rounded-lg mr-4">
                                    <Users className="w-6 h-6 text-purple-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-stone-500">Dernières opérations</p>
                                    <p className="text-lg font-semibold text-stone-800">{operations.length}</p>
                                    <div className="mt-2 flex space-x-3">
                    <span className="flex items-center text-green-700">
                      <TrendingUp className="w-4 h-4 mr-1" /> +15 800 MAD
                    </span>
                                        <span className="flex items-center text-red-700">
                      <TrendingDown className="w-4 h-4 mr-1" /> -3 650 MAD
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Graphiques */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Graphique 1 : Activité hebdomadaire */}
                        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                            <h3 className="text-sm font-medium text-stone-800 mb-4">Activité cette semaine</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <ReBarChart data={dailyOperations}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" tick={{ fill: '#6b7280' }} />
                                    <YAxis tick={{ fill: '#6b7280' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                        }}
                                        formatter={(value) => `${value.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}`}
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Bar dataKey="credits" fill="#10b981" name="Crédits" />
                                    <Bar dataKey="debits" fill="#dc2626" name="Débits" />
                                </ReBarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Graphique 2 : Répartition */}
                        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                            <h3 className="text-sm font-medium text-stone-800 mb-4">Répartition des opérations</h3>
                            <div className="flex justify-center items-center">
                                <ResponsiveContainer width="100%" height={250}>
                                    <RePieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `${value.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}`} />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Table des opérations */}
                    <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                        <h2 className="text-lg font-medium text-stone-800 mb-4">Dernières opérations</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-stone-200">
                                <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Description</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Montant</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-200">
                                {operations.map((operation) => (
                                    <tr key={operation.id} className="hover:bg-stone-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-800">
                                            {formatDate(operation.date)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-stone-800">
                                            {operation.description}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            operation.type === 'CREDIT'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                          {operation.type === 'CREDIT' ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                            {operation.type}
                        </span>
                                        </td>
                                        <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                                            operation.type === 'CREDIT' ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                            {formatAmount(operation.montant, operation.type)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ClientDashboard;