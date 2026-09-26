import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import accountService from '../services/accountService.js';
import Layout from '../components/Layout.jsx';

/**
 * Dashboard - The home page for logged-in customers.
 *
 * Shows:
 * - Balance card
 * - Quick action buttons (Deposit, Withdraw, Fast Cash, etc.)
 * - Last 5 transactions
 *
 * React concepts used:
 * - useEffect: run code when component loads (like componentDidMount in class components)
 * - useState: track balance and transactions
 *
 * useEffect(() => { ... }, []):
 *   The [] means "run this ONCE when component first mounts".
 *   Without [], it would run on every render (infinite loop risk).
 */
const Dashboard = () => {
    const { user } = useAuth();

    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Load balance and recent transactions when component mounts
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [balanceRes, txRes] = await Promise.all([
                    accountService.getBalance(),
                    accountService.getMiniStatement(),
                ]);

                if (balanceRes.success) setBalance(balanceRes.data);
                if (txRes.success) setTransactions(txRes.data);
            } catch (err) {
                setError('Failed to load dashboard data. Please refresh.');
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []); // Empty array = run once on mount

    // Format currency: 50000 → ₹50,000.00
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount || 0);
    };

    // Format date: "2024-01-15T10:30:00" → "15 Jan 2024, 10:30 AM"
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <Layout>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" style={{ width: 48, height: 48 }}></div>
                        <p className="text-muted">Loading your dashboard...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Welcome Header */}
            <div className="mb-4">
                <h4 className="fw-bold mb-1">
                    Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
                    {user?.firstName}! 👋
                </h4>
                <p className="text-muted mb-0">Here's your financial overview</p>
            </div>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {/* BALANCE CARD */}
            <div className="balance-display mb-4">
                <div className="label">Available Balance</div>
                <div className="amount">
                    {balance ? formatCurrency(balance.balance) : '---'}
                </div>
                <div className="d-flex justify-content-center gap-4 mt-3">
                    <div className="text-center">
                        <div style={{ fontSize: '0.78rem', opacity: 0.75 }}>Account No.</div>
                        <div className="fw-semibold" style={{ fontFamily: 'monospace', letterSpacing: 1 }}>
                            {balance?.accountNumber || user?.accountNumber}
                        </div>
                    </div>
                    <div className="text-center">
                        <div style={{ fontSize: '0.78rem', opacity: 0.75 }}>Type</div>
                        <div className="fw-semibold">{balance?.accountType || 'SAVINGS'}</div>
                    </div>
                    <div className="text-center">
                        <div style={{ fontSize: '0.78rem', opacity: 0.75 }}>Status</div>
                        <div className="fw-semibold">
                            <span className={`badge ${balance?.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>
                                {balance?.status || 'ACTIVE'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK ACTIONS */}
            <h6 className="fw-bold mb-3 text-muted text-uppercase" style={{ letterSpacing: 1, fontSize: '0.78rem' }}>
                Quick Actions
            </h6>
            <div className="row g-3 mb-4">
                {[
                    { to: '/deposit',      icon: 'bi-plus-circle-fill',  label: 'Deposit',      color: '#d1fae5', iconColor: '#059669' },
                    { to: '/withdraw',     icon: 'bi-dash-circle-fill',  label: 'Withdraw',     color: '#fee2e2', iconColor: '#dc2626' },
                    { to: '/fast-cash',    icon: 'bi-lightning-fill',    label: 'Fast Cash',    color: '#fef3c7', iconColor: '#d97706' },
                    { to: '/transactions', icon: 'bi-clock-history',     label: 'History',      color: '#ede9fe', iconColor: '#7c3aed' },
                    { to: '/balance',      icon: 'bi-wallet2',           label: 'Balance',      color: '#dbeafe', iconColor: '#2563eb' },
                    { to: '/change-pin',   icon: 'bi-shield-lock-fill',  label: 'Change PIN',   color: '#f1f5f9', iconColor: '#475569' },
                ].map(({ to, icon, label, color, iconColor }) => (
                    <div key={to} className="col-4 col-md-2">
                        <Link to={to} className="text-decoration-none">
                            <div className="text-center p-3 rounded-3 h-100" style={{ background: color, transition: 'transform 0.2s' }}
                                 onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                                 onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <i className={`bi ${icon} d-block mb-2`} style={{ fontSize: '1.6rem', color: iconColor }}></i>
                                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>{label}</span>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* RECENT TRANSACTIONS */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Recent Transactions</h6>
                <Link to="/transactions" className="text-primary text-decoration-none" style={{ fontSize: '0.85rem' }}>
                    View All <i className="bi bi-arrow-right"></i>
                </Link>
            </div>

            <div className="transaction-table">
                {transactions.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '2rem' }}></i>
                        No transactions yet. Make your first deposit!
                    </div>
                ) : (
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Type</th>
                                <th style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Description</th>
                                <th style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Amount</th>
                                <th style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td>
                                        <span className={`transaction-badge ${
                                            tx.type === 'DEPOSIT' ? 'badge-deposit' : 'badge-withdrawal'
                                        }`}>
                                            {tx.type === 'DEPOSIT' ? '↑ ' : '↓ '}{tx.type}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.88rem', color: '#374151' }}>{tx.description}</td>
                                    <td>
                                        <span className={`fw-bold ${tx.type === 'DEPOSIT' ? 'text-success' : 'text-danger'}`}
                                              style={{ fontSize: '0.9rem' }}>
                                            {tx.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{formatDate(tx.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;
