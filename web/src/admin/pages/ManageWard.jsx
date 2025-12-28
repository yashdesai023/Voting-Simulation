import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWard } from '../../context/WardContext';
import { getImageUrl } from '../../lib/pocketbase';
import { ArrowLeft, Save, AlertTriangle, Check, Trash2 } from 'lucide-react';
import './ManageWard.css';

const ManageWard = () => {
    const { wardId } = useParams();
    const navigate = useNavigate();
    const { getWard, updateWard, saveCandidate } = useWard();
    const [ward, setWard] = useState(null);
    const [candidates, setCandidates] = useState({});
    const [filePreviews, setFilePreviews] = useState({});

    // State for Ward Details Editing
    const [editFormData, setEditFormData] = useState({
        name: '',
        name_marathi: '',
        prabhag_ward: 'Ward' // Default to Ward
    });

    useEffect(() => {
        const loadWard = async () => {
            if (!wardId) return;
            const data = await getWard(wardId);
            if (data) {
                setWard(data);
                setCandidates(data.candidates || {});
                setEditFormData({
                    name: data.name || '',
                    name_marathi: data.name_marathi || '',
                    prabhag_ward: data.prabhag_ward || 'ward'
                });
            } else {
                navigate('/admin');
            }
        };
        loadWard();
    }, [wardId, getWard, navigate]);

    const handleUpdateWardDetails = async () => {
        if (!editFormData.name) {
            alert("Ward Name cannot be empty.");
            return;
        }

        try {
            await updateWard(ward.id, editFormData);
            setWard(prev => ({ ...prev, ...editFormData }));
            alert("Ward Details Updated Successfully!");
        } catch (err) {
            console.error(err);
            let msg = err.message || "Unknown Error";
            // PocketBase validation errors
            if (err.data && err.data.data) {
                const details = Object.entries(err.data.data)
                    .map(([key, val]) => `${key}: ${val.message}`)
                    .join('\n');
                msg += `\n\nDetails:\n${details}`;
            }
            alert(`Failed to update ward details:\n${msg}`);
        }
    };

    const handleCandidateChange = (unitIndex, field, value) => {
        if (value instanceof File) {
            // Validate Size (Max 500KB)
            if (value.size > 500 * 1024) {
                alert("File is too large! Please upload a small image (under 500KB).");
                return;
            }

            const url = URL.createObjectURL(value);
            setFilePreviews(prev => ({ ...prev, [`${unitIndex}_${field}`]: url }));

            // Auto-check "Has Photo" if photo is uploaded
            if (field === 'photo') {
                setCandidates(prev => ({
                    ...prev,
                    [unitIndex]: {
                        ...prev[unitIndex],
                        [field]: value,
                        hasPhoto: true
                    }
                }));
                return;
            }
        }

        setFilePreviews(prev => ({ ...prev })); // Force re-render just in case

        setCandidates(prev => ({
            ...prev,
            [unitIndex]: {
                ...prev[unitIndex],
                [field]: value
            }
        }));
    };

    const handleSaveCandidate = async (unitIndex) => {
        const candidate = candidates[unitIndex];
        if (!candidate || !candidate.name || !candidate.index) {
            alert("Please enter Candidate Name and Serial Number (Index)");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('ward', ward.id);
            formData.append('unitIndex', unitIndex);
            formData.append('serialIndex', candidate.index);
            formData.append('name', candidate.name);
            formData.append('marathi_name', candidate.marathi_name || '');
            // Default hasPhoto to false if undefined, ensure string 'true'/'false' for FormData? 
            // PB handles boolean from string "true"/"false" fine.
            formData.append('hasPhoto', candidate.hasPhoto || false);

            if (candidate.symbol instanceof File) {
                formData.append('symbol', candidate.symbol);
            }
            if (candidate.photo instanceof File) {
                formData.append('photo', candidate.photo);
            }

            if (candidate.id) {
                formData.append('id', candidate.id);
            }

            await saveCandidate(ward.id, unitIndex, formData);

            // Reload to get IDs and fresh URLs
            const freshData = await getWard(wardId);
            setWard(freshData);
            setCandidates(freshData.candidates);

            alert(`Candidate for Machine ${unitIndex + 1} Saved!`);
        } catch (err) {
            console.error(err);
            let msg = err.message || "Unknown Error";
            if (err.data && err.data.data) {
                // Format: serialIndex: validation_not_unique
                const details = Object.entries(err.data.data)
                    .map(([key, val]) => `${key}: ${val.message}`)
                    .join('\n');
                msg += `\n\nDetails:\n${details}`;
            }
            alert(`Failed to save:\n${msg}`);
        }
    };

    const handlePublish = async () => {
        // Validation
        const totalMachines = parseInt(ward.ballotCount);
        // Count confirmed saved candidates (those with IDs)
        const savedCount = Object.values(candidates).filter(c => c.id).length;

        if (savedCount < totalMachines) {
            alert(`You have ${savedCount} saved candidates. You need a candidate for ALL ${totalMachines} machines.`);
            // return; // Allow bypass for testing? No, strict.
            return;
        }

        await updateWard(ward.id, { status: 'Active' });
        setWard(prev => ({ ...prev, status: 'Active' }));
        alert("Ward Published Successfully!");
    };

    if (!ward) return <div className="p-8 text-center">Loading Ward...</div>;

    return (
        <div className="manage-ward-page">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate('/admin')}>
                    <ArrowLeft size={16} /> Back
                </button>
                <div className="header-content">
                    <div>
                        <h1>Manage: {ward.name}</h1>
                        <p className="meta-text">ID: {ward.id} | Machines: {ward.ballotCount}</p>
                    </div>
                    <div className="header-actions">
                        <a
                            href={`/${ward.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`btn ${ward.status === 'Active' ? 'btn-success' : 'btn-disabled'}`}
                        >
                            Open Public Page
                        </a>

                        {ward.status === 'Active' ? (
                            <button
                                className="btn btn-secondary"
                                onClick={async () => {
                                    if (confirm("Are you sure you want to revert this Ward to Draft? Searching/Voting might be disabled.")) {
                                        await updateWard(ward.id, { status: 'Draft' });
                                        setWard(prev => ({ ...prev, status: 'Draft' }));
                                    }
                                }}
                            >
                                Revert to Draft
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={handlePublish}
                            >
                                Publish Ward
                            </button>
                        )}
                    </div>
                </div>
            </header>



            {/* Ward Configuration */}
            <div className="ward-settings-card">
                <h2>Ward Configuration</h2>
                <div className="form-row">
                    <div className="form-group half">
                        <label>Ward Name (English)</label>
                        <input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group half">
                        <label>Ward Name (Marathi)</label>
                        <input
                            type="text"
                            value={editFormData.name_marathi}
                            onChange={(e) => setEditFormData({ ...editFormData, name_marathi: e.target.value })}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group half">
                        <label>Unit Type</label>
                        <select
                            value={editFormData.prabhag_ward}
                            onChange={(e) => setEditFormData({ ...editFormData, prabhag_ward: e.target.value })}
                        >
                            <option value="Ward">Ward (वार्ड)</option>
                            <option value="Prabhag">Prabhag (प्रभाग)</option>
                        </select>
                    </div>
                    <div className="form-group half" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button className="btn btn-primary" onClick={handleUpdateWardDetails} style={{ width: '100%' }}>
                            <Save size={16} /> Update Details
                        </button>
                    </div>
                </div>
            </div>

            {/* Ward Settings: Branding Image */}
            <div className="ward-settings-card">
                <h2>{ward.name} Branding</h2>
                <div className="branding-upload-row">
                    <div className="upload-group">
                        <label>Success Page Thumbnail (16:9 Landscape)</label>
                        <div className="file-input-wrapper">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        if (file.size > 2 * 1024 * 1024) { // 2MB Limit
                                            alert("File too large. Max 2MB.");
                                            return;
                                        }
                                        // Upload immediately or on save? Let's upload immediately for simplicity or provide a save button.
                                        // Providing a specific save button for this section is better.
                                        setFilePreviews(prev => ({ ...prev, 'ward_branding': URL.createObjectURL(file), 'ward_branding_file': file }));
                                    }
                                }}
                            />
                            <div className="upload-hint">Max 2MB. Recommended: 1280x720px</div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="branding-preview">
                        {(filePreviews['ward_branding'] || (ward.last_photo ? getImageUrl(ward.collectionId, ward.id, ward.last_photo) : null)) ? (
                            <img
                                src={filePreviews['ward_branding'] || getImageUrl(ward.collectionId, ward.id, ward.last_photo)}
                                alt="Branding Preview"
                            />
                        ) : (
                            <div className="no-preview">No Image Uploaded</div>
                        )}
                    </div>

                    <button
                        className="btn btn-primary"
                        disabled={!filePreviews['ward_branding_file']}
                        onClick={async () => {
                            try {
                                const formData = new FormData();
                                formData.append('last_photo', filePreviews['ward_branding_file']);
                                await updateWard(ward.id, formData);
                                alert("Branding Image Updated!");
                            } catch (e) {
                                alert("Failed to update branding.");
                            }
                        }}
                    >
                        <Save size={16} /> Update Branding
                    </button>
                </div>
            </div>

            <div className="machines-container">
                {Array.from({ length: parseInt(ward.ballotCount) }).map((_, i) => {
                    const candidate = candidates[i] || {};
                    const isSaved = !!candidate.id;

                    // Display Priority: File Preview -> Saved URL -> Null
                    const symbolUrl = filePreviews[`${i}_symbol`] || getImageUrl(candidate.collectionId, candidate.recordId, candidate.symbol);
                    const photoUrl = filePreviews[`${i}_photo`] || getImageUrl(candidate.collectionId, candidate.recordId, candidate.photo);

                    return (
                        <div key={i} className="machine-card">
                            <div className="machine-header">
                                <h3>Ballot Machine {i + 1}</h3>
                                {isSaved ? (
                                    <span className="badge badge-success"><Check size={12} /> Saved</span>
                                ) : (
                                    <span className="badge badge-warning"><AlertTriangle size={12} /> Unsaved</span>
                                )}
                            </div>

                            <div className="machine-body">
                                <p className="instruction-text">Candidate Configuration</p>

                                <div className="form-row">
                                    <div className="form-group half">
                                        <label>Serial No (1-16)</label>
                                        <input
                                            type="number"
                                            value={candidate.index || ''}
                                            onChange={(e) => handleCandidateChange(i, 'index', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="form-group half">
                                        {/* Spacer or another field if needed, otherwise empty to keep layout? 
                                            Actually, let's keep it clean. Just one Serial No. 
                                            The layout is .form-row with .half. If we remove one, the other stretches?
                                            Let's keep the row but maybe put English Name here?
                                            No, English Name is below. 
                                            Let's just leave the space or make Serial No full width?
                                            Full width for Serial No is fine for this row.
                                        */}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group half">
                                        <label>Candidate Name (English)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Yash Desai"
                                            value={candidate.name || ''}
                                            onChange={(e) => handleCandidateChange(i, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group half">
                                        <label>Candidate Name (Marathi)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. यश देसाई"
                                            value={candidate.marathi_name || ''}
                                            onChange={(e) => handleCandidateChange(i, 'marathi_name', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group half">
                                        <label>Symbol Image (Right Col)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleCandidateChange(i, 'symbol', e.target.files[0])}
                                        />
                                        {symbolUrl && <img src={symbolUrl} className="preview-img" alt="Symbol" />}
                                    </div>
                                    <div className="form-group half">
                                        <label>Candidate Photo (Left Col)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleCandidateChange(i, 'photo', e.target.files[0])}
                                        />
                                        {photoUrl && <img src={photoUrl} className="preview-img" alt="Photo" />}
                                    </div>
                                </div>

                                <div className="form-group checkbox-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={candidate.hasPhoto || false}
                                            onChange={(e) => handleCandidateChange(i, 'hasPhoto', e.target.checked)}
                                        /> Display Photo Column?
                                    </label>
                                </div>

                                <button className="btn btn-save" onClick={() => handleSaveCandidate(i)}>
                                    <Save size={16} /> Save Candidate
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
};

export default ManageWard;
