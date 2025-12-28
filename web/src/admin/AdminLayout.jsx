import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Settings, LogOut } from 'lucide-react';
import { pb } from '../lib/pocketbase';
import './AdminLayout.css';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Protect Admin Routes
    useEffect(() => {
        if (!pb.authStore.isValid) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        pb.authStore.clear();
        navigate('/admin/login');
    };

    const isActive = (path) => location.pathname === path;

    // Render nothing or loading if not auth?
    // Effect will trigger redirect, but render might flash.
    if (!pb.authStore.isValid) return null;

    return (
        <div className="admin-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
                    <p>Demo Voting System</p>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/admin/add-ward" className={`nav-item ${isActive('/admin/add-ward') ? 'active' : ''}`}>
                        <PlusCircle size={20} /> Add Ward
                    </Link>
                    <Link to="/admin/settings" className={`nav-item ${isActive('/admin/settings') ? 'active' : ''}`}>
                        <Settings size={20} /> Settings
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
