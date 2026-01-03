import api from './api';

export const operationService = {
  debit: async (accountId, operationData) => {
    const response = await api.post(`/admin/accounts/${accountId}/debit`, operationData);
    return response.data;
  },

  credit: async (accountId, operationData) => {
    const response = await api.post(`/admin/accounts/${accountId}/credit`, operationData);
    return response.data;
  },

    transfer: async (transferData) => {
        const response = await api.post('/api/transfers', transferData);
        return response.data;
    },

  getAccountOperations: async (accountId) => {
    const response = await api.get(`/admin/accounts/${accountId}/operations`);
    return response.data;
  }
};
