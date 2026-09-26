import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * AuthContext - Global state management for authentication.
 *
 * WHAT IS CONTEXT API?
 * React Context lets us share data across all components without
 * "prop drilling" (passing props through many levels of components).
 *
 * Instead of: App → Dashboard → Navbar → UserName (props at every level)
 * We use:     Any component can directly read from AuthContext
 *
 * WHAT DOES THIS STORE?
 * - user: the logged-in user's info (name, email, role, accountNumber)
 * - token: the JWT token for API calls
 *
 * HOW IT WORKS:
 * 1. AuthProvider wraps the entire app in App.jsx
 * 2. Any component can call useAuth() to get user info
 * 3. When user logs in → setUser() and setToken() are called
 * 4. When user logs out → clear user and token
 */

// Step 1: Create the context
const AuthContext = createContext(null);

// Step 2: Create the Provider component that wraps the app
export const AuthProvider = ({ children }) => {
    // Try to load user from localStorage (persists after page refresh)
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });

    /**
     * Login function - called after successful API login.
     * Saves user info and token to state AND localStorage.
     * localStorage persists across browser refreshes.
     */
    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', jwtToken);
    };

    /**
     * Logout function - clears everything.
     * Called when user clicks "Logout" button.
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    /**
     * isAdmin - Check if the logged-in user is an admin.
     * Used to conditionally show admin features.
     */
    const isAdmin = () => user?.role === 'ADMIN';

    /**
     * isLoggedIn - Check if any user is currently logged in.
     */
    const isLoggedIn = () => !!token;

    // Provide all these values to child components
    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAdmin, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * useAuth hook - Easy way to access AuthContext in any component.
 *
 * Usage in any component:
 * const { user, token, login, logout, isAdmin } = useAuth();
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
};
