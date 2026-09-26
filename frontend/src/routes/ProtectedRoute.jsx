import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * ProtectedRoute - Wraps routes that require the user to be logged in.
 *
 * HOW IT WORKS:
 * If user is logged in → show the page (children)
 * If user is NOT logged in → redirect to /login
 *
 * Usage in App.jsx:
 * <Route path="/dashboard" element={
 *   <ProtectedRoute>
 *     <Dashboard />
 *   </ProtectedRoute>
 * } />
 *
 * WHY DO WE NEED THIS?
 * Without ProtectedRoute, anyone could navigate directly to /dashboard
 * by typing the URL, even without logging in.
 */
export const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn()) {
        // <Navigate> is React Router's way to redirect to another page
        // replace={true} replaces the current history entry (no back button to protected page)
        return <Navigate to="/login" replace={true} />;
    }

    return children;
};

/**
 * AdminRoute - Wraps routes that ONLY admins can access.
 *
 * If user is ADMIN → show the page
 * If user is logged in but NOT admin → redirect to dashboard
 * If user is NOT logged in → redirect to login
 */
export const AdminRoute = ({ children }) => {
    const { isLoggedIn, isAdmin } = useAuth();

    if (!isLoggedIn()) {
        return <Navigate to="/login" replace={true} />;
    }

    if (!isAdmin()) {
        // Customer trying to access admin pages → redirect to their dashboard
        return <Navigate to="/dashboard" replace={true} />;
    }

    return children;
};
