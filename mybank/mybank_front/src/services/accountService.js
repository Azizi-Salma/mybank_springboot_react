import api from './api';

export const accountService = {
  createAccount: async (accountData) => {
    const response = await api.post('/admin/accounts', accountData);
    return response.data;
  },

  getAllAccounts: async () => {
    const response = await api.get('/admin/accounts');
    return response.data;
  },

  getClientAccounts: async () => {
    const response = await api.get('/client/accounts');
    return response.data;
  },

  getAccountById: async (id) => {
    const response = await api.get(`/admin/accounts/${id}`);
    return response.data;
  },

  updateAccount: async (id, accountData) => {
    const response = await api.put(`/admin/accounts/${id}`, accountData);
    return response.data;
  },

  deleteAccount: async (id) => {
    const response = await api.delete(`/admin/accounts/${id}`);
    return response.data;
  },

  getAccountDashboard: async (accountId) => {
    const response = await api.get(`/client/accounts/${accountId}/dashboard`);
    return response.data;
  },

  getAccountOperations: async (accountId) => {
    const response = await api.get(`/client/accounts/${accountId}/operations`);
    return response.data;
  }
};
