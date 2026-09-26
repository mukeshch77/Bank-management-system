import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import authService from '../services/authService.js';

/**
 * Login Page - The first thing a user sees.
 *
 * FLOW:
 * 1. User enters email + password
 * 2. We call authService.login()
 * 3. If success: save user + token → redirect to dashboard/admin
 * 4. If error: show error message
 *
 * React concepts used here:
 * - useState: track form values and loading/error states
 * - useNavigate: redirect to another page programmatically
 * - useAuth: access the login() function from AuthContext
 */
const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /**
     * Handle input change: update formData when user types.
     * [e.target.name] is a computed property key.
     * e.g., typing in "email" field → setFormData({ ...formData, email: 'typed@value.com' })
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // clear error when user starts typing
    };

    /**
     * Handle form submit.
     * e.preventDefault() stops the page from refreshing (default HTML form behavior).
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(formData);

            if (response.success) {
                const userData = response.data;
                // Save to AuthContext + localStorage
                login(userData, userData.token);

                // Redirect based on role
                if (userData.role === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(response.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            // Axios error: err.response.data is the ApiResponse from Spring Boot
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                {/* Logo */}
                <div className="logo">
                    <i className="bi bi-bank2"></i>
                    <h3>SecureBank</h3>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Sign in to your account</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" role="alert">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>
                            Email Address
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-envelope text-muted"></i>
                            </span>
                            <input
                                type="email"
                                className="form-control border-start-0"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>
                            Password
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-lock text-muted"></i>
                            </span>
                            <input
                                type="password"
                                className="form-control border-start-0"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary fw-semibold text-decoration-none">
                            Create Account
                        </Link>
                    </p>
                </div>

                {/* Demo credentials hint */}
                <div className="mt-4 p-3 bg-light rounded-3" style={{ fontSize: '0.8rem' }}>
                    <p className="mb-1 text-muted fw-semibold">Demo Credentials:</p>
                    <div className="text-muted">
                        <div><strong>Admin:</strong> admin@bank.com / admin123</div>
                        <div><strong>Customer:</strong> john@example.com / password123</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
