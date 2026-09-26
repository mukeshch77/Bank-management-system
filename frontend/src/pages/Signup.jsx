import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import authService from '../services/authService.js';

/**
 * Signup - 3-Step Registration Form.
 *
 * Step 1: Personal Information (firstName, lastName, email)
 * Step 2: Contact Details (phone, address)
 * Step 3: Security (password, PIN)
 *
 * WHY MULTI-STEP?
 * Instead of showing 7 fields at once (overwhelming),
 * we show 2-3 fields per step. This is much friendlier for users.
 *
 * STATE:
 * - step: which step are we on (1, 2, or 3)
 * - formData: all the form fields collected across all steps
 * - error, loading: UI state
 */
const Signup = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [step, setStep] = useState(1); // Current step: 1, 2, or 3
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // All form fields collected across 3 steps
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
        pin: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    /** Move to next step after basic validation */
    const nextStep = () => {
        if (step === 1) {
            if (!formData.firstName || !formData.lastName || !formData.email) {
                setError('Please fill in all fields.');
                return;
            }
            if (!formData.email.includes('@')) {
                setError('Please enter a valid email address.');
                return;
            }
        }
        if (step === 2) {
            if (!formData.phone) {
                setError('Please enter your phone number.');
                return;
            }
            if (!/^\d{10}$/.test(formData.phone)) {
                setError('Phone number must be exactly 10 digits.');
                return;
            }
        }
        setError('');
        setStep(step + 1);
    };

    const prevStep = () => {
        setError('');
        setStep(step - 1);
    };

    /** Final step: submit to backend */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (!/^\d{4}$/.test(formData.pin)) {
            setError('PIN must be exactly 4 digits.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authService.signup({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                password: formData.password,
                pin: formData.pin,
            });

            if (response.success) {
                const userData = response.data;
                login(userData, userData.token);
                navigate('/dashboard');
            } else {
                setError(response.message || 'Registration failed.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step indicator dots
    const StepIndicator = () => (
        <div className="step-indicator mb-4">
            {[1, 2, 3].map((s, i) => (
                <React.Fragment key={s}>
                    <div className={`step-dot ${s < step ? 'completed' : s === step ? 'active' : 'inactive'}`}>
                        {s < step ? <i className="bi bi-check" style={{ fontSize: '0.75rem' }}></i> : s}
                    </div>
                    {i < 2 && <div className={`step-line ${s < step ? 'completed' : ''}`}></div>}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: 480 }}>
                {/* Logo */}
                <div className="logo">
                    <i className="bi bi-bank2"></i>
                    <h3>Create Your Account</h3>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                        Step {step} of 3 — {step === 1 ? 'Personal Info' : step === 2 ? 'Contact Details' : 'Set Security'}
                    </p>
                </div>

                {/* Step Dots */}
                <StepIndicator />

                {/* Error Alert */}
                {error && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <span style={{ fontSize: '0.88rem' }}>{error}</span>
                    </div>
                )}

                {/* STEP 1: Personal Information */}
                {step === 1 && (
                    <div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="firstName"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleChange}
                                autoFocus
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="lastName"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <button className="btn btn-primary w-100 py-2" onClick={nextStep}>
                            Next <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                    </div>
                )}

                {/* STEP 2: Contact Details */}
                {step === 2 && (
                    <div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>Phone Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                name="phone"
                                placeholder="10-digit mobile number"
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength={10}
                                autoFocus
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>
                                Address <span className="text-muted fw-normal">(optional)</span>
                            </label>
                            <textarea
                                className="form-control"
                                name="address"
                                placeholder="Your home address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={2}
                            />
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-secondary flex-fill py-2" onClick={prevStep}>
                                <i className="bi bi-arrow-left me-1"></i> Back
                            </button>
                            <button className="btn btn-primary flex-fill py-2" onClick={nextStep}>
                                Next <i className="bi bi-arrow-right ms-1"></i>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Security Setup */}
                {step === 3 && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                placeholder="Minimum 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoFocus
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="confirmPassword"
                                placeholder="Repeat your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>
                                ATM PIN <span className="text-muted fw-normal">(4 digits)</span>
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                name="pin"
                                placeholder="4-digit PIN"
                                value={formData.pin}
                                onChange={handleChange}
                                maxLength={4}
                                pattern="\d{4}"
                                required
                            />
                            <small className="text-muted">This PIN will be used for all transactions</small>
                        </div>
                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-outline-secondary flex-fill py-2" onClick={prevStep}>
                                <i className="bi bi-arrow-left me-1"></i> Back
                            </button>
                            <button type="submit" className="btn btn-success flex-fill py-2" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle me-2"></i>
                                        Create Account
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-center mt-4">
                    <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary fw-semibold text-decoration-none">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
