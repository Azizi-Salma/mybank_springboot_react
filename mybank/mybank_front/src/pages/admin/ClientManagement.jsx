import React, { useState, useEffect } from 'react';
import { clientService } from '../../services/clientService';
import { Plus, Search, Edit, Trash2, Mail, MapPin, Calendar } from 'lucide-react';

const ClientManagement = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [deletingClient, setDeletingClient] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const data = await clientService.getAllClients();
            setClients(data);
        } catch (error) {
            console.error('Erreur lors du chargement des clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter(client =>
        client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.cin.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (clientId) => {
        try {
            await clientService.deleteClient(clientId);
            fetchClients();
            setDeletingClient(null);
        } catch (error) {
            console.error('Erreur lors de la suppression du client:', error);
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
                    <h1 className="text-2xl font-semibold text-stone-800">Clients</h1>
                    <p className="text-stone-600 mt-1">Gérez tous les clients de la banque</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="mt-4 md:mt-0 flex items-center px-4 py-2.5 bg-amber-700 hover:bg-[#92400e] text-white rounded-lg shadow-sm transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" /> Nouveau client
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Rechercher un client..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map(client => (
                    <div key={client.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-stone-800">{client.prenom} {client.nom}</h3>
                                <p className="text-sm text-stone-500">CIN: {client.cin}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingClient(client)}
                                    className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-700 transition"
                                    title="Modifier"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setDeletingClient(client)}
                                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition"
                                    title="Supprimer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2 text-stone-600 text-sm">
                            <div className="flex items-center gap-2 truncate">
                                <Mail className="w-4 h-4 flex-shrink-0 text-amber-700" />
                                <span className="truncate">{client.email}</span>
                            </div>
                            <div className="flex items-center gap-2 truncate">
                                <MapPin className="w-4 h-4 flex-shrink-0 text-amber-700" />
                                <span className="truncate">{client.adresse}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 flex-shrink-0 text-amber-700" />
                                {client.dateNaissance}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredClients.length === 0 && (
                <div className="text-center py-12">
                    <Search className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                    <h3 className="text-lg font-medium text-stone-800 mb-1">
                        {searchTerm ? 'Aucun client trouvé' : 'Aucun client disponible'}
                    </h3>
                    <p className="text-stone-500 text-sm">
                        {searchTerm ? 'Essayez avec un autre terme' : 'Ajoutez votre premier client'}
                    </p>
                </div>
            )}

            {/* Modals */}
            {showCreateForm && (
                <ClientModal
                    title="Nouveau client"
                    onClose={() => setShowCreateForm(false)}
                    onSuccess={() => { setShowCreateForm(false); fetchClients(); }}
                />
            )}
            {editingClient && (
                <ClientModal
                    title="Modifier le client"
                    client={editingClient}
                    onClose={() => setEditingClient(null)}
                    onSuccess={() => { setEditingClient(null); fetchClients(); }}
                />
            )}
            {deletingClient && (
                <DeleteConfirmModal
                    client={deletingClient}
                    onClose={() => setDeletingClient(null)}
                    onConfirm={() => handleDelete(deletingClient.id)}
                />
            )}
        </div>
    );
};

// Client Modal (Create/Edit)
const ClientModal = ({ title, client = {}, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        nom: client.nom || '',
        prenom: client.prenom || '',
        cin: client.cin || '',
        dateNaissance: client.dateNaissance || '',
        email: client.email || '',
        adresse: client.adresse || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            if (client.id) await clientService.updateClient(client.id, formData);
            else await clientService.createClient(formData);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-stone-200 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold text-stone-800 mb-4">{title}</h2>

                {error && <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {['nom','prenom','cin','dateNaissance','email','adresse'].map(field => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                {field === 'dateNaissance' ? 'Date de naissance *' : field.charAt(0).toUpperCase() + field.slice(1) + ' *'}
                            </label>
                            {field === 'adresse' ? (
                                <textarea
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                                    rows="3"
                                    required
                                />
                            ) : (
                                <input
                                    type={field === 'email' ? 'email' : field === 'dateNaissance' ? 'date' : 'text'}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                                    required
                                />
                            )}
                        </div>
                    ))}

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
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Delete Modal
const DeleteConfirmModal = ({ client, onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-stone-200">
            <h2 className="text-lg font-semibold text-stone-800 mb-2">Confirmer la suppression</h2>
            <p className="text-stone-600 mb-4">
                Êtes-vous sûr de vouloir supprimer le client <span className="font-medium">{client.prenom} {client.nom}</span> ? Cette action est irréversible.
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

export default ClientManagement;