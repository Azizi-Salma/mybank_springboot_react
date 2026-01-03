import React, { useState, useEffect } from 'react';
import { accountService } from '../../services/accountService';
import { operationService } from '../../services/operationService';
import { ArrowRight, CreditCard, Send, AlertCircle } from 'lucide-react';

const Transfer = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    sourceAccountId: '',
    destinationRib: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await accountService.getClientAccounts();
      setAccounts(data);
      if (data.length > 0) {
        setSelectedAccount(data[0]);
        setFormData(prev => ({ ...prev, sourceAccountId: data[0].id }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des comptes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.sourceAccountId || !formData.destinationRib || !formData.amount) {
      setError('Tous les champs sont obligatoires');
      setLoading(false);
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Le montant doit être supérieur à 0');
      setLoading(false);
      return;
    }

    const sourceAccount = accounts.find(a => a.id === parseInt(formData.sourceAccountId));
    if (parseFloat(formData.amount) > sourceAccount.solde) {
      setError('Solde insuffisant');
      setLoading(false);
      return;
    }

    if (formData.destinationRib === sourceAccount.rib) {
      setError('Impossible de transférer vers le même compte');
      setLoading(false);
      return;
    }

    try {
      await operationService.transfer({
        sourceAccountId: parseInt(formData.sourceAccountId),
        destinationRib: formData.destinationRib,
        amount: parseFloat(formData.amount),
        description: formData.description || 'Virement'
      });
      
      setSuccess('Virement effectué avec succès');
      setFormData({
        sourceAccountId: selectedAccount?.id || '',
        destinationRib: '',
        amount: '',
        description: ''
      });
      
      // Refresh accounts to update balance
      fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du virement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAccountChange = (accountId) => {
    setSelectedAccount(accounts.find(a => a.id === parseInt(accountId)));
    setFormData(prev => ({ ...prev, sourceAccountId: accountId }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nouveau virement</h1>
        <p className="text-gray-600 mt-2">Effectuez un virement vers un autre compte</p>
      </div>

      <div className="card">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mb-6">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Source Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compte émetteur *
            </label>
            {accounts.length > 1 ? (
              <select
                name="sourceAccountId"
                value={formData.sourceAccountId}
                onChange={(e) => handleAccountChange(e.target.value)}
                className="input"
                required
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.rib} - {account.solde.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}
                  </option>
                ))}
              </select>
            ) : accounts.length === 1 ? (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="font-medium">{accounts[0].rib}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    Solde: {accounts[0].solde.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Aucun compte disponible</div>
            )}
          </div>

          {/* Destination RIB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RIB du destinataire *
            </label>
            <input
              type="text"
              name="destinationRib"
              value={formData.destinationRib}
              onChange={handleChange}
              className="input"
              placeholder="Entrez le RIB du compte destinataire"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant *
            </label>
            <div className="relative">
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="input"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">MAD</span>
              </div>
            </div>
            {selectedAccount && (
              <p className="mt-1 text-sm text-gray-600">
                Solde disponible: {selectedAccount.solde.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motif (optionnel)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              rows="3"
              placeholder="Entrez la raison du virement..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 btn btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || accounts.length === 0}
              className="flex-1 btn btn-primary flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Effectuer le virement
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Information Card */}
      <div className="mt-6 card bg-blue-50 border border-blue-200">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <h3 className="font-semibold mb-2">Informations importantes</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Le virement sera immédiatement débité de votre compte</li>
              <li>Le compte destinataire sera crédité du même montant</li>
              <li>Assurez-vous que le RIB du destinataire est correct</li>
              <li>Le solde de votre compte doit être suffisant pour effectuer le virement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
