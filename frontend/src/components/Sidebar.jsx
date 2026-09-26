import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Sidebar - The left navigation menu shown after login.
 *
 * Shows different menu items based on user role:
 * - CUSTOMER sees banking features
 * - ADMIN sees admin features
 *
 * NavLink is like <a> but from React Router.
 * It automatically adds 'active' class when the current URL matches the 'to' prop.
 */
const Sidebar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();           // Clear auth state and localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="sidebar d-flex flex-column">
            {/* Bank Logo / Brand */}
            <div className="brand">
                <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-bank2 fs-4 text-info"></i>
                    <div>
                        <h5 className="mb-0">SecureBank</h5>
                        <small className="text-white-50" style={{ fontSize: '0.7rem' }}>
                            {isAdmin() ? 'Admin Panel' : 'Customer Portal'}
                        </small>
                    </div>
                </div>
            </div>

            {/* User greeting */}
            <div className="px-3 py-3 border-bottom border-white border-opacity-10">
                <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                         style={{ width: 36, height: 36, minWidth: 36 }}>
                        <span className="text-white fw-bold" style={{ fontSize: '0.85rem' }}>
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                    </div>
                    <div>
                        <div className="text-white fw-semibold" style={{ fontSize: '0.85rem' }}>
                            {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-white-50" style={{ fontSize: '0.72rem' }}>
                            {user?.role}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow-1 py-2">
                {isAdmin() ? (
                    /* ADMIN MENU */
                    <>
                        <p className="px-4 mb-1 mt-2" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Admin Menu
                        </p>
                        <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-speedometer2"></i> Dashboard
                        </NavLink>
                        <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-people"></i> Manage Users
                        </NavLink>
                        <NavLink to="/admin/transactions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-arrow-left-right"></i> All Transactions
                        </NavLink>
                    </>
                ) : (
                    /* CUSTOMER MENU */
                    <>
                        <p className="px-4 mb-1 mt-2" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            My Banking
                        </p>
                        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-house"></i> Dashboard
                        </NavLink>
                        <NavLink to="/balance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-wallet2"></i> Balance
                        </NavLink>
                        <NavLink to="/deposit" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-plus-circle"></i> Deposit
                        </NavLink>
                        <NavLink to="/withdraw" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-dash-circle"></i> Withdraw
                        </NavLink>
                        <NavLink to="/fast-cash" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-lightning"></i> Fast Cash
                        </NavLink>
                        <NavLink to="/transactions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-clock-history"></i> Transactions
                        </NavLink>

                        <p className="px-4 mb-1 mt-3" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Account
                        </p>
                        <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-person"></i> Profile
                        </NavLink>
                        <NavLink to="/change-pin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-shield-lock"></i> Change PIN
                        </NavLink>
                    </>
                )}
            </nav>

            {/* Logout Button */}
            <div className="p-3 border-top border-white border-opacity-10">
                <button
                    onClick={handleLogout}
                    className="btn w-100 text-white d-flex align-items-center gap-2 justify-content-center"
                    style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, fontSize: '0.9rem' }}
                >
                    <i className="bi bi-box-arrow-right"></i> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
