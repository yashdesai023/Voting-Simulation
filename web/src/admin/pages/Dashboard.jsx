import React from 'react';
import { Link } from 'react-router-dom';
import { useWard } from '../../context/WardContext';
import { Play, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const { wards } = useWard();

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'border-green-500';
            case 'Draft': return 'border-yellow-500';
            default: return 'border-red-500';
        }
    };

    return (
        <div className="dashboard-page">
            <header className="page-header">
                <h1>Admin Dashboard</h1>
                <p>Demo Voting System Management Panel</p>
            </header>

            <div className="wards-grid">
                {wards.map((ward) => (
                    <div key={ward.code} className={`ward-card ${getStatusColor(ward.status)}`}>
                        <div className="card-header">
                            <h3>{ward.name}</h3>
                            <span className={`status-badge ${ward.status.toLowerCase()}`}>{ward.status}</span>
                        </div>

                        <div className="card-meta">
                            <p><strong>Code:</strong> {ward.code}</p>
                            <p><strong>Machines:</strong> {ward.ballotCount}</p>
                            <p><strong>Candidates:</strong> {Object.keys(ward.candidates).length} Assigned</p>
                        </div>

                        <div className="card-actions">
                            <Link to={`/admin/manage/${ward.id}`} className="btn btn-secondary">
                                <Settings size={16} /> Manage Ward
                            </Link>
                            <Link target="_blank" to={`/${ward.id}`} className="btn btn-primary">
                                <Play size={16} /> View Page
                            </Link>
                        </div>
                    </div>
                ))}

                {wards.length === 0 && (
                    <div className="empty-state">
                        <p>No wards created yet.</p>
                        <Link to="/admin/add-ward" className="btn btn-primary">Create First Ward</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
