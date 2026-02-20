import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAnomalies, getElections, createAnomaly, updateAnomalyStatus } from '../services/api';
import './Anomalies.css';

export default function Anomalies() {
    const [anomalies, setAnomalies] = useState([]);
    const [elections, setElections] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newAnomaly, setNewAnomaly] = useState({ description: '', severity: 'MEDIUM', location: '', electionId: '' });
    const { getRole } = useAuth();
    const role = getRole();
    const canReport = ['ROLE_OBSERVER', 'ROLE_CITIZEN', 'ROLE_ADMIN'].includes(role);
    const canResolve = ['ROLE_ADMIN', 'ROLE_OBSERVER'].includes(role);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try { const r = await getAnomalies(); setAnomalies(r.data); } catch { }
        try { const r = await getElections(); setElections(r.data); } catch { }
    };

    const submitAnomaly = async () => {
        if (!newAnomaly.description || !newAnomaly.electionId) return;
        try {
            await createAnomaly({ description: newAnomaly.description, severity: newAnomaly.severity, location: newAnomaly.location }, newAnomaly.electionId);
            setShowForm(false); loadData(); setNewAnomaly({ description: '', severity: 'MEDIUM', location: '', electionId: '' });
        } catch (err) { alert(err.response?.data?.message || 'Failed to submit'); }
    };

    const handleUpdateStatus = async (id, status) => {
        try { await updateAnomalyStatus(id, status); loadData(); } catch { }
    };

    return (
        <div className="anom-page-container">
            <div className="anom-page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/dashboard" className="anom-back-btn">← Back</Link>
                    <div><h1>⚠️ Anomaly Reports</h1><p>Monitor and report election irregularities</p></div>
                </div>
                {canReport && <button className="anom-btn-primary" onClick={() => setShowForm(!showForm)}>+ Report Anomaly</button>}
            </div>

            {showForm && (
                <div className="anom-form-card">
                    <h3>Report New Anomaly</h3>
                    <div className="anom-form-grid">
                        <div className="anom-form-group">
                            <label>Election</label>
                            <select value={newAnomaly.electionId} onChange={(e) => setNewAnomaly({ ...newAnomaly, electionId: e.target.value })}>
                                <option value="">Select election</option>
                                {elections.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div className="anom-form-group">
                            <label>Severity</label>
                            <select value={newAnomaly.severity} onChange={(e) => setNewAnomaly({ ...newAnomaly, severity: e.target.value })}>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>
                        <div className="anom-form-group">
                            <label>Location</label>
                            <input type="text" value={newAnomaly.location} onChange={(e) => setNewAnomaly({ ...newAnomaly, location: e.target.value })} placeholder="Location of anomaly" />
                        </div>
                        <div className="anom-form-group anom-full-width">
                            <label>Description</label>
                            <textarea value={newAnomaly.description} onChange={(e) => setNewAnomaly({ ...newAnomaly, description: e.target.value })} rows="4" placeholder="Describe the anomaly..."></textarea>
                        </div>
                    </div>
                    <div className="anom-form-actions">
                        <button className="anom-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                        <button className="anom-btn-submit" onClick={submitAnomaly}>Submit Report</button>
                    </div>
                </div>
            )}

            <div className="anom-anomaly-list">
                {anomalies.map(a => (
                    <div key={a.id} className="anom-anomaly-card">
                        <div className="anom-anomaly-header">
                            <span className={`anom-severity-badge ${a.severity.toLowerCase()}`}>{a.severity}</span>
                            <span className={`anom-status-badge ${a.status.toLowerCase().replace('_', '-')}`}>{a.status}</span>
                        </div>
                        <p className="anom-anomaly-desc">{a.description}</p>
                        <div className="anom-anomaly-meta">
                            {a.election && <span>🏛️ {a.election.name}</span>}
                            {a.location && <span>📍 {a.location}</span>}
                            <span>📅 {a.createdAt && new Date(a.createdAt).toLocaleString()}</span>
                        </div>
                        {canResolve && (
                            <div className="anom-anomaly-actions">
                                {a.status === 'REPORTED' && <button className="anom-btn-sm" onClick={() => handleUpdateStatus(a.id, 'UNDER_REVIEW')}>Review</button>}
                                {a.status !== 'RESOLVED' && <button className="anom-btn-sm anom-resolve" onClick={() => handleUpdateStatus(a.id, 'RESOLVED')}>Resolve</button>}
                                {a.status !== 'DISMISSED' && <button className="anom-btn-sm anom-dismiss" onClick={() => handleUpdateStatus(a.id, 'DISMISSED')}>Dismiss</button>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {anomalies.length === 0 && <div className="anom-empty-state"><span className="anom-empty-icon">✅</span><h3>No anomalies reported</h3><p>All elections are running smoothly.</p></div>}
        </div>
    );
}
