import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, getElections, toggleUser, deleteElection, createElection } from '../services/api';
import './Admin.css';

export default function Admin() {
    const [users, setUsers] = useState([]);
    const [elections, setElections] = useState([]);
    const [showElectionForm, setShowElectionForm] = useState(false);
    const [newEl, setNewEl] = useState({ name: '', description: '', electionDate: '', region: '', status: 'UPCOMING', totalRegisteredVoters: 0 });

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { const r = await getUsers(); setUsers(r.data); } catch { }
        try { const r = await getElections(); setElections(r.data); } catch { }
    };

    const handleToggleUser = async (id) => { try { await toggleUser(id); load(); } catch { } };
    const handleDeleteElection = async (id) => { try { await deleteElection(id); load(); } catch { } };
    const handleCreateElection = async () => {
        if (!newEl.name) return;
        try {
            await createElection(newEl);
            setShowElectionForm(false); load();
            setNewEl({ name: '', description: '', electionDate: '', region: '', status: 'UPCOMING', totalRegisteredVoters: 0 });
        } catch { }
    };

    return (
        <div className="adm-page-container">
            <div className="adm-page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/dashboard" className="adm-back-btn">← Back</Link>
                    <div><h1>⚙️ Admin Panel</h1><p>Manage users and elections</p></div>
                </div>
            </div>

            <div className="adm-section">
                <h2>👥 User Management</h2>
                <div className="adm-table-container">
                    <table>
                        <thead><tr><th>Username</th><th>Full Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.username}</td><td>{u.fullName}</td><td>{u.email}</td>
                                    <td><span className="adm-role-tag">{u.role?.replace('ROLE_', '')}</span></td>
                                    <td><span className={`adm-status-dot ${u.enabled ? 'active' : ''}`}>{u.enabled ? 'Active' : 'Disabled'}</span></td>
                                    <td><button className="adm-btn-sm" onClick={() => handleToggleUser(u.id)}>{u.enabled ? 'Disable' : 'Enable'}</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="adm-section">
                <h2>🏛️ Election Management</h2>
                <button className="adm-btn-primary" onClick={() => setShowElectionForm(!showElectionForm)}>+ Add Election</button>
                {showElectionForm && (
                    <div className="adm-form-card">
                        <div className="adm-form-row">
                            <input value={newEl.name} onChange={(e) => setNewEl({ ...newEl, name: e.target.value })} placeholder="Election Name" className="adm-input" />
                            <input value={newEl.region} onChange={(e) => setNewEl({ ...newEl, region: e.target.value })} placeholder="Region" className="adm-input" />
                        </div>
                        <div className="adm-form-row">
                            <input type="date" value={newEl.electionDate} onChange={(e) => setNewEl({ ...newEl, electionDate: e.target.value })} className="adm-input" />
                            <select value={newEl.status} onChange={(e) => setNewEl({ ...newEl, status: e.target.value })} className="adm-input">
                                <option value="UPCOMING">Upcoming</option><option value="ONGOING">Ongoing</option><option value="COMPLETED">Completed</option>
                            </select>
                            <input type="number" value={newEl.totalRegisteredVoters} onChange={(e) => setNewEl({ ...newEl, totalRegisteredVoters: parseInt(e.target.value) || 0 })} placeholder="Registered Voters" className="adm-input" />
                        </div>
                        <textarea value={newEl.description} onChange={(e) => setNewEl({ ...newEl, description: e.target.value })} placeholder="Description" rows="3" className="adm-input adm-full"></textarea>
                        <div className="adm-form-actions">
                            <button className="adm-btn-cancel" onClick={() => setShowElectionForm(false)}>Cancel</button>
                            <button className="adm-btn-submit" onClick={handleCreateElection}>Create</button>
                        </div>
                    </div>
                )}
                <div className="adm-election-admin-list">
                    {elections.map(e => (
                        <div key={e.id} className="adm-admin-card">
                            <div className="adm-ac-header">
                                <h3>{e.name}</h3>
                                <span className={`adm-status-badge ${e.status.toLowerCase()}`}>{e.status}</span>
                            </div>
                            <p>{e.region} · {e.electionDate} · {(e.totalRegisteredVoters || 0).toLocaleString()} voters</p>
                            <button className="adm-btn-sm adm-danger" onClick={() => handleDeleteElection(e.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
