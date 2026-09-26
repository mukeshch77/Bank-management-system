import api from './api.js';

/**
 * adminService.js - All API calls for admin operations.
 * Only works if the logged-in user has ROLE_ADMIN.
 */

const adminService = {

    /** GET /api/admin/dashboard → Stats overview */
    getDashboardStats: async () => {
        const response = await api.get('/api/admin/dashboard');
        return response.data;
    },

    /** GET /api/admin/users → All customers */
    getAllCustomers: async () => {
        const response = await api.get('/api/admin/users');
        return response.data;
    },

    /** DELETE /api/admin/users/:id → Delete a user */
    deleteUser: async (userId) => {
        const response = await api.delete(`/api/admin/users/${userId}`);
        return response.data;
    },

    /** PUT /api/admin/users/:id/freeze → Freeze account */
    freezeAccount: async (userId) => {
        const response = await api.put(`/api/admin/users/${userId}/freeze`);
        return response.data;
    },

    /** PUT /api/admin/users/:id/activate → Activate account */
    activateAccount: async (userId) => {
        const response = await api.put(`/api/admin/users/${userId}/activate`);
        return response.data;
    },

    /** GET /api/admin/transactions → All transactions */
    getAllTransactions: async () => {
        const response = await api.get('/api/admin/transactions');
        return response.data;
    },
};

export default adminService;
