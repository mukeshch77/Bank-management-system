import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import accountService from '../services/accountService.js';
import Layout from '../components/Layout.jsx';

/* ============================================================
   REUSABLE: TransactionForm
   Used by both Deposit and Withdraw pages.
   Props:
   - title: page heading
   - icon: bootstrap icon class
   - color: theme color
   - onSubmit: function to call (deposit or withdraw)
   - buttonLabel: text on button
   - buttonClass: btn-success or btn-danger
   ============================================================ */
const TransactionForm = ({ title, icon, color, onSubmit, buttonLabel, buttonClass }) => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount greater than ₹0.');
            return;
        }
        if (!/^\d{4}$/.test(pin)) {
            setError('Please enter your 4-digit PIN.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await onSubmit(parseFloat(amount), pin);
            if (response.success) {
                setSuccess(response.data?.message || `${buttonLabel} successful! New balance: ₹${response.data?.balance}`);
                setAmount('');
                setPin('');
            } else {
                setError(response.message || 'Transaction failed.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Transaction failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="form-card">
                {/* Header */}
                <div className="text-center mb-4">
                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                         style={{ width: 64, height: 64, background: color }}>
                        <i className={`bi ${icon}`} style={{ fontSize: '1.8rem', color: 'white' }}></i>
                    </div>
                    <h5 className="fw-bold">{title}</h5>
                    <p className="text-muted" style={{ fontSize: '0.88rem' }}>
                        Enter amount and confirm with your PIN
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger d-flex align-items-center gap-2">
                        <i className="bi bi-exclamation-triangle-fill"></i> {error}
                    </div>
                )}
                {success && (
                    <div className="alert alert-success d-flex align-items-center gap-2">
                        <i className="bi bi-check-circle-fill"></i> {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Amount field */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>Amount (₹)</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light fw-bold">₹</span>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => { setAmount(e.target.value); setError(''); }}
                                min="1"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    {/* Quick amount buttons */}
                    <div className="mb-3">
                        <small className="text-muted d-block mb-2">Quick select:</small>
                        <div className="d-flex gap-2 flex-wrap">
                            {[1000, 2000, 5000, 10000].map(amt => (
                                <button key={amt} type="button"
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => setAmount(amt)}>
                                    ₹{amt.toLocaleString('en-IN')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* PIN field */}
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
                            pattern="\d{4}"
                            required
                            style={{ letterSpacing: 8, textAlign: 'center', fontSize: '1.1rem' }}
                        />
                    </div>

                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-outline-secondary flex-fill"
                                onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <button type="submit" className={`btn ${buttonClass} flex-fill`} disabled={loading}>
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm me-2" role="status" />Processing...</>
                            ) : (
                                <><i className={`bi ${icon} me-2`}></i>{buttonLabel}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

/* ============================================================
   DEPOSIT PAGE
   ============================================================ */
export const Deposit = () => (
    <TransactionForm
        title="Deposit Money"
        icon="bi-plus-circle-fill"
        color="#059669"
        onSubmit={accountService.deposit}
        buttonLabel="Deposit"
        buttonClass="btn-success"
    />
);

/* ============================================================
   WITHDRAW PAGE
   ============================================================ */
export const Withdraw = () => (
    <TransactionForm
        title="Withdraw Money"
        icon="bi-dash-circle-fill"
        color="#dc2626"
        onSubmit={accountService.withdraw}
        buttonLabel="Withdraw"
        buttonClass="btn-danger"
    />
);
