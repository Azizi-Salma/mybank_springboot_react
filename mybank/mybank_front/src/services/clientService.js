import api from './api';

export const clientService = {
  createClient: async (clientData) => {
    const response = await api.post('/admin/clients', clientData);
    return response.data;
  },

  getAllClients: async () => {
    const response = await api.get('/admin/clients');
    return response.data;
  },

  getClientById: async (id) => {
    const response = await api.get(`/admin/clients/${id}`);
    return response.data;
  },

  updateClient: async (id, clientData) => {
    const response = await api.put(`/admin/clients/${id}`, clientData);
    return response.data;
  },

  deleteClient: async (id) => {
    await api.delete(`/admin/clients/${id}`);
  },

  getClientProfile: async () => {
    const response = await api.get('/client/me');
    return response.data;
  }
};
