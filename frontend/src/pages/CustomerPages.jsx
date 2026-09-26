import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import accountService from '../services/accountService.js';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/* ============================================================
   BALANCE PAGE
   ============================================================ */
export const Balance = () => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [revealed, setRevealed] = useState(false); // Hide balance by default

    useEffect(() => {
        accountService.getBalance()
            .then(res => { if (res.success) setBalance(res.data); })
            .catch(() => setError('Failed to load balance.'))
            .finally(() => setLoading(false));
    }, []);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);

    return (
        <Layout>
            <div style={{ maxWidth: 440, margin: '0 auto' }}>
                <div className="stat-card text-center">
                    <div className="mb-3">
                        <i className="bi bi-wallet2" style={{ fontSize: '3rem', color: '#2563eb' }}></i>
                    </div>
                    <h5 className="fw-bold mb-1">Balance Enquiry</h5>
                    <p className="text-muted mb-4" style={{ fontSize: '0.88rem' }}>Your current account balance</p>

                    {loading && <div className="spinner-border text-primary"></div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {balance && (
                        <>
                            <div className="p-4 rounded-3 mb-3" style={{ background: 'linear-gradient(135deg, #1a3c6e, #2563eb)' }}>
                                <div className="text-white-50 mb-1" style={{ fontSize: '0.85rem' }}>Available Balance</div>
                                <div className="text-white fw-bold" style={{ fontSize: '2.2rem' }}>
                                    {revealed ? formatCurrency(balance.balance) : '₹ ••••••'}
                                </div>
                                <button
                                    className="btn btn-link text-white-50 p-0 mt-2"
                                    style={{ fontSize: '0.82rem' }}
                                    onClick={() => setRevealed(!revealed)}>
                                    <i className={`bi ${revealed ? 'bi-eye-slash' : 'bi-eye'} me-1`}></i>
                                    {revealed ? 'Hide' : 'Show'} Balance
                                </button>
                            </div>

                            <div className="row g-2 text-start">
                                {[
                                    { label: 'Account Number', value: balance.accountNumber, icon: 'bi-credit-card' },
                                    { label: 'Account Type',   value: balance.accountType,   icon: 'bi-bank' },
                                    { label: 'Status',         value: balance.status,         icon: 'bi-circle-fill' },
                                ].map(({ label, value, icon }) => (
                                    <div key={label} className="col-12">
                                        <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
                                            <i className={`bi ${icon} text-primary`}></i>
                                            <div>
                                                <div className="text-muted" style={{ fontSize: '0.78rem' }}>{label}</div>
                                                <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                                                    {label === 'Status' ? (
                                                        <span className={`badge ${value === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>{value}</span>
                                                    ) : value}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

/* ============================================================
   FAST CASH PAGE
   Shows predefined amount buttons (no typing needed)
   ============================================================ */
export const FastCash = () => {
    const navigate = useNavigate();
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const amounts = [500, 1000, 2000, 5000, 10000];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAmount) { setError('Please select an amount.'); return; }
        if (!/^\d{4}$/.test(pin)) { setError('Please enter your 4-digit PIN.'); return; }

        setLoading(true); setError(''); setSuccess('');
        try {
            const res = await accountService.fastCash(selectedAmount, pin);
            if (res.success) {
                setSuccess(`₹${selectedAmount.toLocaleString('en-IN')} withdrawn successfully!`);
                setSelectedAmount(null); setPin('');
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Transaction failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <div className="form-card">
                    <div className="text-center mb-4">
                        <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                             style={{ width: 64, height: 64, background: '#d97706' }}>
                            <i className="bi bi-lightning-fill text-white" style={{ fontSize: '1.8rem' }}></i>
                        </div>
                        <h5 className="fw-bold">Fast Cash</h5>
                        <p className="text-muted" style={{ fontSize: '0.88rem' }}>Select an amount to withdraw instantly</p>
                    </div>

                    {error && <div className="alert alert-danger"><i className="bi bi-exclamation-triangle-fill me-2"></i>{error}</div>}
                    {success && <div className="alert alert-success"><i className="bi bi-check-circle-fill me-2"></i>{success}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Amount Grid */}
                        <div className="row g-3 mb-4">
                            {amounts.map(amt => (
                                <div key={amt} className="col-6">
                                    <button type="button"
                                        className={`fast-cash-btn w-100 border-2 ${
                                            selectedAmount === amt
                                                ? 'btn btn-warning fw-bold'
                                                : 'btn btn-outline-warning'
                                        }`}
                                        onClick={() => { setSelectedAmount(amt); setError(''); }}>
                                        ₹{amt.toLocaleString('en-IN')}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* PIN */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>
                                <i className="bi bi-shield-lock me-1"></i>Enter PIN
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="4-digit PIN"
                                value={pin}
                                onChange={(e) => { setPin(e.target.value); setError(''); }}
                                maxLength={4}
                                style={{ letterSpacing: 8, textAlign: 'center', fontSize: '1.1rem' }}
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-outline-secondary flex-fill" onClick={() => navigate(-1)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-warning flex-fill fw-bold" disabled={loading}>
                                {loading
                                    ? <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                                    : <><i className="bi bi-lightning-fill me-2"></i>Withdraw {selectedAmount ? `₹${selectedAmount.toLocaleString('en-IN')}` : ''}</>
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

/* ============================================================
   CHANGE PIN PAGE
   ============================================================ */
export const ChangePin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ currentPin: '', newPin: '', confirmPin: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPin !== formData.confirmPin) { setError('New PINs do not match.'); return; }
        if (!/^\d{4}$/.test(formData.newPin)) { setError('PIN must be exactly 4 digits.'); return; }
        if (formData.currentPin === formData.newPin) { setError('New PIN must be different from current PIN.'); return; }

        setLoading(true); setError(''); setSuccess('');
        try {
            const res = await accountService.changePin(formData.currentPin, formData.newPin);
            if (res.success) {
                setSuccess('PIN changed successfully! Please remember your new PIN.');
                setFormData({ currentPin: '', newPin: '', confirmPin: '' });
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change PIN.');
        } finally {
            setLoading(false);
        }
    };

    const PinInput = ({ name, label }) => (
        <div className="mb-3">
            <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>{label}</label>
            <input
                type="password"
                className="form-control"
                name={name}
                placeholder="• • • •"
                value={formData[name]}
                onChange={handleChange}
                maxLength={4}
                style={{ letterSpacing: 12, textAlign: 'center', fontSize: '1.2rem' }}
                required
            />
        </div>
    );

    return (
        <Layout>
            <div style={{ maxWidth: 400, margin: '0 auto' }}>
                <div className="form-card">
                    <div className="text-center mb-4">
                        <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                             style={{ width: 64, height: 64, background: '#475569' }}>
                            <i className="bi bi-shield-lock-fill text-white" style={{ fontSize: '1.8rem' }}></i>
                        </div>
                        <h5 className="fw-bold">Change PIN</h5>
                        <p className="text-muted" style={{ fontSize: '0.88rem' }}>Update your 4-digit ATM PIN</p>
                    </div>

                    {error && <div className="alert alert-danger"><i className="bi bi-exclamation-triangle-fill me-2"></i>{error}</div>}
                    {success && <div className="alert alert-success"><i className="bi bi-check-circle-fill me-2"></i>{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <PinInput name="currentPin" label="Current PIN" />
                        <PinInput name="newPin" label="New PIN" />
                        <PinInput name="confirmPin" label="Confirm New PIN" />

                        <div className="d-flex gap-2 mt-4">
                            <button type="button" className="btn btn-outline-secondary flex-fill" onClick={() => navigate(-1)}>Cancel</button>
                            <button type="submit" className="btn btn-primary flex-fill" disabled={loading}>
                                {loading
                                    ? <><span className="spinner-border spinner-border-sm me-2" />Updating...</>
                                    : <><i className="bi bi-check-circle me-2"></i>Update PIN</>
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

/* ============================================================
   TRANSACTION HISTORY PAGE
   ============================================================ */
export const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, DEPOSIT, WITHDRAWAL

    useEffect(() => {
        accountService.getTransactionHistory()
            .then(res => { if (res.success) setTransactions(res.data); })
            .finally(() => setLoading(false));
    }, []);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    const filtered = filter === 'ALL' ? transactions
        : transactions.filter(tx => tx.type === filter);

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="fw-bold mb-1">Transaction History</h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
                        {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                {/* Filter Buttons */}
                <div className="btn-group btn-group-sm">
                    {['ALL', 'DEPOSIT', 'WITHDRAWAL'].map(f => (
                        <button key={f}
                            className={`btn ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
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
                            No {filter !== 'ALL' ? filter.toLowerCase() + ' ' : ''}transactions found.
                        </div>
                    ) : (
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>#</th>
                                    <th style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Type</th>
                                    <th style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Description</th>
                                    <th style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Amount</th>
                                    <th style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Balance After</th>
                                    <th style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Date</th>
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

/* ============================================================
   PROFILE PAGE
   ============================================================ */
export const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({ phone: '', address: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        accountService.getProfile()
            .then(res => {
                if (res.success) {
                    setProfile(res.data);
                    setEditData({ phone: res.data.phone || '', address: res.data.address || '' });
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true); setError(''); setSuccess('');
        try {
            const res = await accountService.updateProfile(editData);
            if (res.success) {
                setProfile(res.data);
                setSuccess('Profile updated successfully!');
                setEditing(false);
            } else {
                setError(res.message);
            }
        } catch {
            setError('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Layout><div className="text-center py-5"><div className="spinner-border text-primary"></div></div></Layout>;

    return (
        <Layout>
            <div style={{ maxWidth: 520, margin: '0 auto' }}>
                <div className="stat-card">
                    {/* Avatar */}
                    <div className="text-center mb-4">
                        <div className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center mb-3"
                             style={{ width: 80, height: 80 }}>
                            <span className="text-white fw-bold" style={{ fontSize: '1.8rem' }}>
                                {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                            </span>
                        </div>
                        <h5 className="fw-bold mb-0">{profile?.firstName} {profile?.lastName}</h5>
                        <span className="badge bg-primary mt-1">{profile?.role}</span>
                    </div>

                    {success && <div className="alert alert-success">{success}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {/* Profile Details */}
                    <div className="row g-3">
                        {[
                            { icon: 'bi-envelope', label: 'Email', value: profile?.email, editable: false },
                            { icon: 'bi-calendar', label: 'Member Since', value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN') : '-', editable: false },
                        ].map(({ icon, label, value }) => (
                            <div key={label} className="col-12">
                                <div className="p-3 bg-light rounded-3">
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <i className={`bi ${icon} text-muted`} style={{ fontSize: '0.9rem' }}></i>
                                        <span className="text-muted" style={{ fontSize: '0.78rem' }}>{label}</span>
                                    </div>
                                    <div className="fw-semibold" style={{ fontSize: '0.92rem' }}>{value}</div>
                                </div>
                            </div>
                        ))}

                        {/* Editable fields */}
                        <div className="col-12">
                            <div className="p-3 bg-light rounded-3">
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <i className="bi bi-phone text-muted" style={{ fontSize: '0.9rem' }}></i>
                                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>Phone</span>
                                </div>
                                {editing
                                    ? <input className="form-control form-control-sm mt-1" value={editData.phone}
                                        onChange={e => setEditData({ ...editData, phone: e.target.value })} placeholder="Phone number" />
                                    : <div className="fw-semibold" style={{ fontSize: '0.92rem' }}>{profile?.phone || '-'}</div>
                                }
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="p-3 bg-light rounded-3">
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <i className="bi bi-geo-alt text-muted" style={{ fontSize: '0.9rem' }}></i>
                                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>Address</span>
                                </div>
                                {editing
                                    ? <textarea className="form-control form-control-sm mt-1" value={editData.address}
                                        onChange={e => setEditData({ ...editData, address: e.target.value })}
                                        rows={2} placeholder="Your address" />
                                    : <div className="fw-semibold" style={{ fontSize: '0.92rem' }}>{profile?.address || '-'}</div>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Edit buttons */}
                    <div className="d-flex gap-2 mt-4">
                        {editing ? (
                            <>
                                <button className="btn btn-outline-secondary flex-fill" onClick={() => setEditing(false)}>Cancel</button>
                                <button className="btn btn-primary flex-fill" onClick={handleSave} disabled={saving}>
                                    {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : 'Save Changes'}
                                </button>
                            </>
                        ) : (
                            <button className="btn btn-primary w-100" onClick={() => setEditing(true)}>
                                <i className="bi bi-pencil me-2"></i>Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};
