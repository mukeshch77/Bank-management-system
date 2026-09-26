import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoute.jsx';

// Auth Pages
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

// Customer Pages
import Dashboard from './pages/Dashboard.jsx';
import { Deposit, Withdraw } from './pages/Transaction.jsx';
import {
    Balance,
    FastCash,
    ChangePin,
    TransactionHistory,
    Profile,
} from './pages/CustomerPages.jsx';

// Admin Pages
import {
    AdminDashboard,
    ManageUsers,
    AdminTransactions,
} from './pages/AdminPages.jsx';

/**
 * App.jsx - The root component of the React application.
 *
 * This file sets up:
 * 1. AuthProvider   → wraps everything so all components can access auth state
 * 2. BrowserRouter  → enables React Router (URL-based navigation)
 * 3. Routes         → maps URLs to components
 *
 * ROUTE TYPES:
 * - Public routes:    /login, /signup → anyone can access
 * - ProtectedRoute:  /dashboard, /deposit, etc. → must be logged in
 * - AdminRoute:      /admin/* → must be logged in AND have ADMIN role
 *
 * HOW NAVIGATION WORKS:
 * User types /dashboard → React Router matches it → renders Dashboard component
 * ProtectedRoute checks: is user logged in? No → redirects to /login
 */
function App() {
    return (
        /* AuthProvider: makes user/token/login/logout available to ALL components */
        <AuthProvider>
            {/* BrowserRouter: enables URL-based routing */}
            <BrowserRouter>
                <Routes>

                    {/* ===== PUBLIC ROUTES ===== */}
                    {/* Anyone can visit these, even without login */}

                    {/* Root "/" redirects to /login */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* ===== CUSTOMER ROUTES (Protected) ===== */}
                    {/* Must be logged in. If not → redirected to /login */}

                    <Route path="/dashboard" element={
                        <ProtectedRoute><Dashboard /></ProtectedRoute>
                    } />

                    <Route path="/balance" element={
                        <ProtectedRoute><Balance /></ProtectedRoute>
                    } />

                    <Route path="/deposit" element={
                        <ProtectedRoute><Deposit /></ProtectedRoute>
                    } />

                    <Route path="/withdraw" element={
                        <ProtectedRoute><Withdraw /></ProtectedRoute>
                    } />

                    <Route path="/fast-cash" element={
                        <ProtectedRoute><FastCash /></ProtectedRoute>
                    } />

                    <Route path="/transactions" element={
                        <ProtectedRoute><TransactionHistory /></ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute><Profile /></ProtectedRoute>
                    } />

                    <Route path="/change-pin" element={
                        <ProtectedRoute><ChangePin /></ProtectedRoute>
                    } />

                    {/* ===== ADMIN ROUTES ===== */}
                    {/* Must be logged in AND have ADMIN role */}
                    {/* If customer tries to access → redirected to /dashboard */}

                    <Route path="/admin/dashboard" element={
                        <AdminRoute><AdminDashboard /></AdminRoute>
                    } />

                    <Route path="/admin/users" element={
                        <AdminRoute><ManageUsers /></AdminRoute>
                    } />

                    <Route path="/admin/transactions" element={
                        <AdminRoute><AdminTransactions /></AdminRoute>
                    } />

                    {/* ===== 404 CATCH-ALL ===== */}
                    {/* Any unknown URL redirects to login */}
                    <Route path="*" element={<Navigate to="/login" replace />} />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
