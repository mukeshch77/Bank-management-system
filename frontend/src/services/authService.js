import api from './api.js';

/**
 * authService.js - All API calls related to authentication.
 *
 * WHY SEPARATE SERVICE FILES?
 * Instead of writing API calls directly inside components,
 * we group them in service files. This means:
 * - If the API URL changes, we update ONE file, not many components
 * - Components stay clean and focused on UI
 * - Easy to reuse the same API call in multiple components
 *
 * Each function here returns a Promise.
 * In components, we use async/await to handle the response.
 */

const authService = {

    /**
     * Signup - Register a new user.
     *
     * Sends POST request to: /api/auth/signup
     * Body: { firstName, lastName, email, password, phone, address, pin }
     *
     * Returns: { token, id, firstName, lastName, email, role, accountNumber }
     */
    signup: async (userData) => {
        const response = await api.post('/api/auth/signup', userData);
        return response.data; // response.data is the ApiResponse<AuthResponse> from Spring Boot
    },

    /**
     * Login - Authenticate an existing user.
     *
     * Sends POST request to: /api/auth/login
     * Body: { email, password }
     *
     * Returns: { token, id, firstName, lastName, email, role, accountNumber }
     */
    login: async (credentials) => {
        const response = await api.post('/api/auth/login', credentials);
        return response.data;
    },
};

export default authService;
