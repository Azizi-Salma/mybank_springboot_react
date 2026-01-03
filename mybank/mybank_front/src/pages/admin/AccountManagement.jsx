import React, { useState, useEffect } from 'react';
import { accountService } from '../../services/accountService';
import { clientService } from '../../services/clientService';
import { Plus, Search, Edit, Trash2, CreditCard } from 'lucide-react';

const AccountManagement = () => {
    const [accounts, setAccounts] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [deletingAccount, setDeletingAccount] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [accountsData, clientsData] = await Promise.all([
                accountService.getAllAccounts(),
                clientService.getAllClients()
            ]);
            setAccounts(accountsData);
            setClients(clientsData);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAccounts = accounts.filter(account =>
        account.rib.includes(searchTerm) ||
        account.client?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.client?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getClientName = (clientId) => {
        const client = clients.find(c => c.id === clientId);
        return client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
    };

    const handleDelete = async (accountId) => {
        try {
            await accountService.deleteAccount(accountId);
            fetchData();
            setDeletingAccount(null);
        } catch (error) {
            console.error('Erreur lors de la suppression du compte:', error);
            alert(error.response?.data?.message || 'Erreur lors de la suppression');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-amber-700 border-b-amber-200"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-stone-800">Gestion des comptes</h1>
                    <p className="text-stone-600 mt-1">Gérez les comptes bancaires de vos clients</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="mt-4 md:mt-0 flex items-center px-4 py-2.5 bg-amber-700 hover:bg-[#92400e] text-white rounded-lg shadow-sm transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau compte
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Rechercher un compte..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Accounts grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAccounts.map(account => (
                    <div key={account.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-amber-50 rounded-lg mr-3">
                                    <CreditCard className="w-6 h-6 text-amber-700" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-stone-800">{account.rib}</h3>
                                    <p className="text-sm text-stone-500">{getClientName(account.client?.id)}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setEditingAccount(account)}
                                    className="text-amber-600 hover:text-amber-800"
                                    title="Modifier"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setDeletingAccount(account)}
                                    className="text-stone-500 hover:text-stone-700"
                                    title="Supprimer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-stone-500">Solde</span>
                                <span className="text-base font-semibold text-stone-800">
                                    {account.solde.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-stone-500">Statut</span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    account.status === 'OUVERT'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-stone-100 text-stone-700'
                                }`}>
                                    {account.status === 'OUVERT' ? 'Ouvert' : 'Fermé'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredAccounts.length === 0 && (
                <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                    <h3 className="text-lg font-medium text-stone-800 mb-1">
                        {searchTerm ? 'Aucun compte trouvé' : 'Aucun compte'}
                    </h3>
                    <p className="text-stone-500 text-sm">
                        {searchTerm ? 'Essayez avec un autre terme' : 'Ajoutez votre premier compte'}
                    </p>
                </div>
            )}

            {/* Modals */}
            {showCreateForm && (
                <CreateAccountModal
                    clients={clients}
                    onClose={() => setShowCreateForm(false)}
                    onSuccess={() => { setShowCreateForm(false); fetchData(); }}
                />
            )}
            {editingAccount && (
                <EditAccountModal
                    account={editingAccount}
                    onClose={() => setEditingAccount(null)}
                    onSuccess={() => { setEditingAccount(null); fetchData(); }}
                />
            )}
            {deletingAccount && (
                <DeleteAccountConfirmModal
                    account={deletingAccount}
                    onClose={() => setDeletingAccount(null)}
                    onConfirm={() => handleDelete(deletingAccount.id)}
                />
            )}
        </div>
    );
};

// ---------------- Modals ----------------

const CreateAccountModal = ({ clients, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({ rib: '', clientId: '', solde: '0' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await accountService.createAccount({
                rib: formData.rib,
                clientId: parseInt(formData.clientId),
                solde: parseFloat(formData.solde)
            });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-stone-200">
                <h2 className="text-xl font-semibold text-stone-800 mb-4">Nouveau compte bancaire</h2>
                {error && <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">RIB *</label>
                        <input
                            type="text"
                            name="rib"
                            value={formData.rib}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                            placeholder="Ex: RIB001234567890"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Client *</label>
                        <select
                            name="clientId"
                            value={formData.clientId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                            required
                        >
                            <option value="">Sélectionnez un client</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.prenom} {c.nom} - {c.cin}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Solde initial</label>
                        <input
                            type="number"
                            name="solde"
                            value={formData.solde}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                            step="0.01"
                            min="0"
                        />
                    </div>
                    <div className="flex space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 px-4 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 px-4 rounded-lg bg-amber-700 hover:bg-[#92400e] text-white font-medium transition-colors"
                        >
                            {loading ? (
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
                            ) : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditAccountModal = ({ account, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        rib: account.rib,
        clientId: account.client?.id || '',
        solde: account.solde,
        status: account.status
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await accountService.updateAccount(account.id, formData);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally { setLoading(false); }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Simuler clients (à remplacer par un vrai fetch si besoin)
    const clients = []; // Tu peux passer les clients en props comme dans Create

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-stone-200">
                <h2 className="text-xl font-semibold text-stone-800 mb-4">Modifier le compte</h2>
                {error && <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">RIB</label>
                        <input
                            type="text"
                            name="rib"
                            value={formData.rib}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-stone-100 text-stone-500 cursor-not-allowed"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Solde</label>
                        <input
                            type="number"
                            name="solde"
                            value={formData.solde}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                            step="0.01"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Statut</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                        >
                            <option value="OUVERT">Ouvert</option>
                            <option value="FERME">Fermé</option>
                        </select>
                    </div>
                    <div className="flex space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 px-4 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 px-4 rounded-lg bg-amber-700 hover:bg-[#92400e] text-white font-medium transition-colors"
                        >
                            {loading ? 'Mise à jour...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DeleteAccountConfirmModal = ({ account, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-stone-200">
                <h2 className="text-lg font-semibold text-stone-800 mb-2">Confirmer la suppression</h2>
                <p className="text-stone-600 mb-4">
                    Êtes-vous sûr de vouloir supprimer le compte <span className="font-medium">{account.rib}</span> ?
                </p>
                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 px-4 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 transition"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountManagement;