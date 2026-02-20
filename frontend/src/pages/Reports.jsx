import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getReports, getElections, createReport } from '../services/api';
import './Reports.css';

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [elections, setElections] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newReport, setNewReport] = useState({ title: '', content: '', type: 'ANALYSIS', electionId: '' });
    const { getRole } = useAuth();
    const canCreate = ['ROLE_ANALYST', 'ROLE_ADMIN', 'ROLE_OBSERVER'].includes(getRole());

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try { const r = await getReports(); setReports(r.data); } catch { }
        try { const r = await getElections(); setElections(r.data); } catch { }
    };

    const submitReport = async () => {
        if (!newReport.title || !newReport.content) return;
        try {
            await createReport({ title: newReport.title, content: newReport.content, type: newReport.type }, newReport.electionId || undefined);
            setShowForm(false); loadData(); setNewReport({ title: '', content: '', type: 'ANALYSIS', electionId: '' });
        } catch { }
    };

    return (
        <div className="rpt-page-container">
            <div className="rpt-page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/dashboard" className="rpt-back-btn">← Back</Link>
                    <div><h1>📄 Reports</h1><p>Election analysis and reports</p></div>
                </div>
                {canCreate && <button className="rpt-btn-primary" onClick={() => setShowForm(!showForm)}>+ Create Report</button>}
            </div>

            {showForm && (
                <div className="rpt-form-card">
                    <h3>Create New Report</h3>
                    <div className="rpt-form-grid">
                        <div className="rpt-form-group"><label>Title</label><input type="text" value={newReport.title} onChange={(e) => setNewReport({ ...newReport, title: e.target.value })} placeholder="Report title" /></div>
                        <div className="rpt-form-group"><label>Type</label>
                            <select value={newReport.type} onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}>
                                <option value="ANALYSIS">Analysis</option><option value="TURNOUT">Turnout</option><option value="FRAUD">Fraud</option><option value="GENERAL">General</option>
                            </select>
                        </div>
                        <div className="rpt-form-group"><label>Election (optional)</label>
                            <select value={newReport.electionId} onChange={(e) => setNewReport({ ...newReport, electionId: e.target.value })}>
                                <option value="">None</option>{elections.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div className="rpt-form-group rpt-full-width"><label>Content</label><textarea value={newReport.content} onChange={(e) => setNewReport({ ...newReport, content: e.target.value })} rows="6" placeholder="Write your report..."></textarea></div>
                    </div>
                    <div className="rpt-form-actions">
                        <button className="rpt-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                        <button className="rpt-btn-submit" onClick={submitReport}>Publish</button>
                    </div>
                </div>
            )}

            <div className="rpt-reports-grid">
                {reports.map(r => (
                    <div key={r.id} className="rpt-report-card">
                        <div className="rpt-report-header">
                            <span className={`rpt-type-badge ${r.type.toLowerCase()}`}>{r.type}</span>
                            <span className="rpt-report-date">{r.createdAt && new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3>{r.title}</h3>
                        <p className="rpt-report-content">{r.content}</p>
                        <div className="rpt-report-meta">
                            {r.election && <span>🏛️ {r.election.name}</span>}
                            {r.createdBy && <span>👤 {r.createdBy.fullName}</span>}
                        </div>
                    </div>
                ))}
            </div>
            {reports.length === 0 && <div className="rpt-empty-state"><span className="rpt-empty-icon">📄</span><h3>No reports yet</h3><p>Create the first election report.</p></div>}
        </div>
    );
}
