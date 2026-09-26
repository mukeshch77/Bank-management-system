import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Layout - The shell around all authenticated pages.
 *
 * Structure:
 * ┌──────────────┬─────────────────────────────────┐
 * │              │  Top Navbar                     │
 * │   Sidebar    ├─────────────────────────────────┤
 * │              │                                 │
 * │              │   Page Content (children)       │
 * │              │                                 │
 * └──────────────┴─────────────────────────────────┘
 *
 * {children} is whatever page component is currently active.
 * Example: <Layout><Dashboard /></Layout>
 */
const Layout = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    // Convert URL path to a readable page title
    const getPageTitle = () => {
        const path = location.pathname;
        const titles = {
            '/dashboard': 'Dashboard',
            '/balance': 'Balance Enquiry',
            '/deposit': 'Deposit Money',
            '/withdraw': 'Withdraw Money',
            '/fast-cash': 'Fast Cash',
            '/transactions': 'Transaction History',
            '/profile': 'My Profile',
            '/change-pin': 'Change PIN',
            '/admin/dashboard': 'Admin Dashboard',
            '/admin/users': 'Manage Users',
            '/admin/transactions': 'All Transactions',
        };
        return titles[path] || 'Bank Management System';
    };

    return (
        <div className="d-flex">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Right Side: Topbar + Page Content */}
            <div className="main-content flex-grow-1">

                {/* Top Navigation Bar */}
                <div className="top-navbar">
                    <div>
                        <h6 className="mb-0 fw-bold text-dark">{getPageTitle()}</h6>
                        <small className="text-muted">
                            Welcome back, {user?.firstName}!
                        </small>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        {/* Account number badge */}
                        <div className="d-none d-md-flex align-items-center gap-2 bg-light rounded-pill px-3 py-1">
                            <i className="bi bi-credit-card text-primary" style={{ fontSize: '0.85rem' }}></i>
                            <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: 600 }}>
                                {user?.accountNumber}
                            </span>
                        </div>

                        {/* User Avatar */}
                        <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                             style={{ width: 38, height: 38 }}>
                            <span className="text-white fw-bold" style={{ fontSize: '0.85rem' }}>
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actual Page Content */}
                <div className="page-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
