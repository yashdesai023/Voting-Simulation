import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWard } from '../../context/WardContext';
import { Save } from 'lucide-react';
import './AddWard.css';

const AddWard = () => {
    const navigate = useNavigate();
    const { addWard } = useWard();

    const [formData, setFormData] = useState({
        name: '',
        name_marathi: '',
        prabhag_ward: 'Ward', // Default to Ward
        code: '',
        description: '',
        ballotCount: 1
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.code) return;

        addWard({
            ...formData,
            status: 'Draft',
            // candidates: {} // candidates collection handles this separately
        });

        navigate('/admin');
    };

    return (
        <div className="add-ward-page">
            <header className="page-header">
                <h1>Add New Ward / Prabhag</h1>
                <p>Create a new voting unit in under 2 minutes.</p>
            </header>

            <form onSubmit={handleSubmit} className="ward-form">
                {/* Section A: Basic Info */}
                <section className="form-section">
                    <h2>Section A: Basic Ward Information</h2>

                    <div className="form-group">
                        <label>Ward / Prabhag Name (English)</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. Ward 02 - BMC"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Ward / Prabhag Name (Marathi)</label>
                        <input
                            type="text"
                            name="name_marathi"
                            placeholder="e.g. प्रभाग ०२ - बृहन्मुंबई महानगरपालिका"
                            value={formData.name_marathi}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Unit Type</label>
                        <select
                            name="prabhag_ward"
                            value={formData.prabhag_ward}
                            onChange={handleChange}
                        >
                            <option value="Ward">Ward (वार्ड)</option>
                            <option value="Prabhag">Prabhag (प्रभाग)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Ward Code (Unique)</label>
                        <input
                            type="text"
                            name="code"
                            placeholder="e.g. bmc02"
                            value={formData.code}
                            onChange={handleChange}
                            required
                        />
                        <small>This will be used for the public URL (e.g., /bmc02)</small>
                    </div>

                    <div className="form-group">
                        <label>Short Description</label>
                        <textarea
                            name="description"
                            placeholder="e.g. डेमो मतदान प्रणाली – प्रभाग 02"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                </section>

                {/* Section B: Ballot Config */}
                <section className="form-section">
                    <h2>Section B: Ballot Machine Configuration</h2>

                    <div className="form-group">
                        <label>Number of Ballot Machines</label>
                        <select
                            name="ballotCount"
                            value={formData.ballotCount}
                            onChange={handleChange}
                        >
                            <option value="1">1 Machine</option>
                            <option value="2">2 Machines</option>
                            <option value="3">3 Machines</option>
                            <option value="4">4 Machines</option>
                        </select>
                        <small className="help-text">प्रत्येक बॅलेट मशीनमध्ये एकच उमेदवार असू शकतो</small>
                    </div>
                </section>

                {/* Section C: Controls */}
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>Cancel</button>
                    <button type="submit" className="btn btn-primary">
                        <Save size={18} /> Save as Draft
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddWard;
