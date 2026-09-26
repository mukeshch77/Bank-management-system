import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService.js';
import Layout from '../components/Layout.jsx';

/* ============================================================
   ADMIN DASHBOARD
   Shows: total customers, transactions, deposits, withdrawals
   ============================================================ */
export const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getDashboardStats()
            .then(res => { if (res.success) setStats(res.data); })
            .finally(() => setLoading(false));
    }, []);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

    const statCards = stats ? [
        {
            label: 'Total Customers',
            value: stats.totalCustomers,
            icon: 'bi-people-fill',
            bg: '#dbeafe', iconColor: '#2563eb',
        },
        {
            label: 'Total Transactions',
            value: stats.totalTransactions,
            icon: 'bi-arrow-left-right',
            bg: '#ede9fe', iconColor: '#7c3aed',
        },
        {
            label: 'Total Deposits',
            value: formatCurrency(stats.totalDeposits),
            icon: 'bi-plus-circle-fill',
            bg: '#d1fae5', iconColor: '#059669',
        },
        {
            label: 'Total Withdrawals',
            value: formatCurrency(stats.totalWithdrawals),
            icon: 'bi-dash-circle-fill',
            bg: '#fee2e2', iconColor: '#dc2626',
        },
    ] : [];

    return (
        <Layout>
            <div className="mb-4">
                <h4 className="fw-bold mb-1">Admin Dashboard</h4>
                <p className="text-muted mb-0">Overview of all banking activities</p>
            </div>

            {loading && <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>}

            {/* Stats Cards */}
            {!loading && (
                <div className="row g-4">
                    {statCards.map(({ label, value, icon, bg, iconColor }) => (
                        <div key={label} className="col-12 col-sm-6 col-xl-3">
                            <div className="stat-card">
                                <div className="icon-box" style={{ background: bg }}>
                                    <i className={`bi ${icon}`} style={{ color: iconColor }}></i>
                                </div>
                                <div className="card-value">{value}</div>
                                <div className="card-label">{label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Nav */}
            {!loading && (
                <div className="row g-3 mt-2">
                    <div className="col-12">
                        <h6 className="fw-bold mb-3 text-muted text-uppercase" style={{ fontSize: '0.78rem', letterSpacing: 1 }}>
                            Quick Actions
                        </h6>
                        <div className="row g-3">
                            {[
                                { href: '/admin/users', icon: 'bi-people', label: 'Manage Users', desc: 'View, freeze, or delete customers', color: '#2563eb' },
                                { href: '/admin/transactions', icon: 'bi-arrow-left-right', label: 'All Transactions', desc: 'Monitor all money movements', color: '#7c3aed' },
                            ].map(({ href, icon, label, desc, color }) => (
                                <div key={href} className="col-12 col-md-6">
                                    <a href={href} className="text-decoration-none">
                                        <div className="stat-card d-flex align-items-center gap-3" style={{ cursor: 'pointer' }}>
                                            <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                                 style={{ width: 48, height: 48, background: color + '20' }}>
                                                <i className={`bi ${icon}`} style={{ fontSize: '1.4rem', color }}></i>
                                            </div>
                                            <div>
                                                <div className="fw-bold" style={{ color: '#1e293b' }}>{label}</div>
                                                <div className="text-muted" style={{ fontSize: '0.83rem' }}>{desc}</div>
                                            </div>
                                            <i className="bi bi-arrow-right ms-auto text-muted"></i>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

/* ============================================================
   MANAGE USERS PAGE
   Shows all customers with freeze/activate/delete buttons
   ============================================================ */
export const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // which user ID is being actioned
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    const loadUsers = () => {
        setLoading(true);
        adminService.getAllCustomers()
            .then(res => { if (res.success) setUsers(res.data); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadUsers(); }, []);

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleFreeze = async (userId) => {
        if (!window.confirm('Freeze this account? The user will not be able to make transactions.')) return;
        setActionLoading(userId);
        try {
            await adminService.freezeAccount(userId);
            showMessage('Account frozen successfully.', 'warning');
            loadUsers();
        } catch (err) {
            showMessage(err.response?.data?.message || 'Failed to freeze account.', 'danger');
        } finally {
            setActionLoading(null);
        }
    };

    const handleActivate = async (userId) => {
        setActionLoading(userId);
        try {
            await adminService.activateAccount(userId);
            showMessage('Account activated successfully.', 'success');
            loadUsers();
        } catch (err) {
            showMessage(err.response?.data?.message || 'Failed to activate account.', 'danger');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (userId, userName) => {
        if (!window.confirm(`Delete user "${userName}"? This cannot be undone.`)) return;
        setActionLoading(userId);
        try {
            await adminService.deleteUser(userId);
            showMessage('User deleted successfully.', 'success');
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            showMessage(err.response?.data?.message || 'Failed to delete user.', 'danger');
        } finally {
            setActionLoading(null);
        }
    };

    // Filter by name or email
    const filtered = users.filter(u =>
        `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="fw-bold mb-1">Manage Users</h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>{filtered.length} customers</p>
                </div>
                {/* Search */}
                <div className="input-group" style={{ maxWidth: 280 }}>
                    <span className="input-group-text bg-light"><i className="bi bi-search text-muted"></i></span>
                    <input type="text" className="form-control" placeholder="Search by name or email..."
                        value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type} mb-3`}>{message.text}</div>
            )}

            {loading && <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>}

            {!loading && (
                <div className="transaction-table">
                    {filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i className="bi bi-people d-block mb-2" style={{ fontSize: '2rem' }}></i>
                            No customers found.
                        </div>
                    ) : (
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="table-light">
                                <tr>
                                    {['#', 'Name', 'Email', 'Phone', 'Joined', 'Actions'].map(h => (
                                        <th key={h} style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((user, i) => (
                                    <tr key={user.id}>
                                        <td className="text-muted" style={{ fontSize: '0.82rem' }}>{i + 1}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                                                     style={{ width: 34, height: 34, minWidth: 34 }}>
                                                    <span className="text-white fw-bold" style={{ fontSize: '0.78rem' }}>
                                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                                    </span>
                                                </div>
                                                <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                                                    {user.firstName} {user.lastName}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.88rem', color: '#475569' }}>{user.email}</td>
                                        <td style={{ fontSize: '0.88rem', color: '#475569' }}>{user.phone || '-'}</td>
                                        <td className="text-muted" style={{ fontSize: '0.82rem' }}>
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '-'}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(user.id, `${user.firstName} ${user.lastName}`)}
                                                    disabled={actionLoading === user.id}
                                                    title="Delete user">
                                                    {actionLoading === user.id
                                                        ? <span className="spinner-border spinner-border-sm" />
                                                        : <i className="bi bi-trash"></i>}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </Layout>
    );
};

/* ============================================================
   ALL TRANSACTIONS PAGE (Admin)
   ============================================================ */
export const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        adminService.getAllTransactions()
            .then(res => { if (res.success) setTransactions(res.data); })
            .finally(() => setLoading(false));
    }, []);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);

    const formatDate = (d) =>
        new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const filtered = filter === 'ALL' ? transactions : transactions.filter(tx => tx.type === filter);

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="fw-bold mb-1">All Transactions</h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>{filtered.length} transactions</p>
                </div>
                <div className="btn-group btn-group-sm">
                    {['ALL', 'DEPOSIT', 'WITHDRAWAL'].map(f => (
                        <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setFilter(f)}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading && <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>}

            {!loading && (
                <div className="transaction-table">
                    {filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '2rem' }}></i>
                            No transactions found.
                        </div>
                    ) : (
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="table-light">
                                <tr>
                                    {['#', 'Type', 'Description', 'Amount', 'Balance After', 'Date'].map(h => (
                                        <th key={h} style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((tx, i) => (
                                    <tr key={tx.id}>
                                        <td className="text-muted" style={{ fontSize: '0.82rem' }}>{i + 1}</td>
                                        <td>
                                            <span className={`transaction-badge ${tx.type === 'DEPOSIT' ? 'badge-deposit' : 'badge-withdrawal'}`}>
                                                {tx.type === 'DEPOSIT' ? '↑' : '↓'} {tx.type}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.88rem' }}>{tx.description}</td>
                                        <td>
                                            <span className={`fw-bold ${tx.type === 'DEPOSIT' ? 'text-success' : 'text-danger'}`}>
                                                {tx.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.88rem' }}>{tx.balanceAfter ? formatCurrency(tx.balanceAfter) : '-'}</td>
                                        <td className="text-muted" style={{ fontSize: '0.82rem' }}>{formatDate(tx.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </Layout>
    );
};
