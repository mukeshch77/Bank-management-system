import api from './api.js';

/**
 * accountService.js - All API calls for banking operations.
 *
 * The JWT token is automatically added by the Axios interceptor in api.js.
 * So we don't need to manually set headers here.
 */

const accountService = {

    /** GET /api/account/balance → Get current balance */
    getBalance: async () => {
        const response = await api.get('/api/account/balance');
        return response.data;
    },

    /** GET /api/account/details → Full account info */
    getAccountDetails: async () => {
        const response = await api.get('/api/account/details');
        return response.data;
    },

    /**
     * POST /api/account/deposit
     * Body: { amount: 5000, pin: "1234" }
     */
    deposit: async (amount, pin) => {
        const response = await api.post('/api/account/deposit', { amount, pin });
        return response.data;
    },

    /**
     * POST /api/account/withdraw
     * Body: { amount: 2000, pin: "1234" }
     */
    withdraw: async (amount, pin) => {
        const response = await api.post('/api/account/withdraw', { amount, pin });
        return response.data;
    },

    /**
     * POST /api/account/fast-cash
     * Body: { amount: 2000, pin: "1234" }
     * Only allows: 500, 1000, 2000, 5000, 10000
     */
    fastCash: async (amount, pin) => {
        const response = await api.post('/api/account/fast-cash', { amount, pin });
        return response.data;
    },

    /** GET /api/account/mini-statement → Last 5 transactions */
    getMiniStatement: async () => {
        const response = await api.get('/api/account/mini-statement');
        return response.data;
    },

    /** GET /api/account/transactions → All transactions */
    getTransactionHistory: async () => {
        const response = await api.get('/api/account/transactions');
        return response.data;
    },

    /**
     * PUT /api/account/change-pin
     * Body: { currentPin: "1234", newPin: "5678" }
     */
    changePin: async (currentPin, newPin) => {
        const response = await api.put('/api/account/change-pin', { currentPin, newPin });
        return response.data;
    },

    /** GET /api/user/profile → User profile */
    getProfile: async () => {
        const response = await api.get('/api/user/profile');
        return response.data;
    },

    /** PUT /api/user/profile → Update phone and address */
    updateProfile: async (updates) => {
        const response = await api.put('/api/user/profile', updates);
        return response.data;
    },
};

export default accountService;
