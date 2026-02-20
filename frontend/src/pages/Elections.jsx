import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getElections, hasVoted, castVote, getResults } from '../services/api';
import './Elections.css';

export default function Elections() {
    const [elections, setElections] = useState([]);
    const [filteredElections, setFilteredElections] = useState([]);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedElection, setSelectedElection] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [votedElections, setVotedElections] = useState({});
    const [electionResults, setElectionResults] = useState({});
    const { getRole } = useAuth();
    const isCitizen = getRole() === 'ROLE_CITIZEN';

    useEffect(() => { loadElections(); }, []);

    const loadElections = async () => {
        try {
            const res = await getElections();
            setElections(res.data);
            filterList(res.data, statusFilter);
            if (isCitizen) {
                const voted = {};
                for (const e of res.data) {
                    try {
                        const v = await hasVoted(e.id);
                        voted[e.id] = v.data.hasVoted;
                    } catch { }
                }
                setVotedElections(voted);
            }
        } catch { }
    };

    const filterList = (list, filter) => {
        setFilteredElections(filter === 'ALL' ? list : list.filter(e => e.status === filter));
    };

    const handleFilterChange = (val) => {
        setStatusFilter(val);
        filterList(elections, val);
    };

    const handleVote = async () => {
        if (!selectedElection || !selectedCandidate) return;
        try {
            await castVote(selectedElection.id, selectedCandidate);
            setVotedElections({ ...votedElections, [selectedElection.id]: true });
            setSelectedElection(null);
            setSelectedCandidate(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Vote failed');
        }
    };

    const toggleResults = async (election) => {
        if (electionResults[election.id]) {
            const copy = { ...electionResults };
            delete copy[election.id];
            setElectionResults(copy);
            return;
        }
        try {
            const res = await getResults(election.id);
            setElectionResults({ ...electionResults, [election.id]: res.data });
        } catch { }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/dashboard" className="back-btn">← Back</Link>
                    <div><h1>🏛️ Elections</h1><p>Browse and participate in elections</p></div>
                </div>
                <div className="header-actions">
                    <select value={statusFilter} onChange={(e) => handleFilterChange(e.target.value)} className="filter-select">
                        <option value="ALL">All Elections</option>
                        <option value="UPCOMING">Upcoming</option>
                        <option value="ONGOING">Ongoing</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>
            </div>

            <div className="elections-grid">
                {filteredElections.map(e => (
                    <div key={e.id} className={`election-card ${e.status.toLowerCase()}`}>
                        <div className="card-header">
                            <span className={`status-badge ${e.status.toLowerCase()}`}>{e.status}</span>
                            <span className="region-tag">📍 {e.region}</span>
                        </div>
                        <h3>{e.name}</h3>
                        <p className="description">{e.description}</p>
                        <div className="card-meta">
                            <span>📅 {e.electionDate}</span>
                            <span>👥 {(e.totalRegisteredVoters || 0).toLocaleString()} voters</span>
                        </div>
                        {e.candidates && e.candidates.length > 0 && (
                            <div className="candidates-section">
                                <h4>Candidates</h4>
                                <div className="candidates-list">
                                    {e.candidates.map(c => (
                                        <div key={c.id} className="candidate-chip">
                                            <span className="candidate-name">{c.name}</span>
                                            <span className="candidate-party">{c.party}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="card-actions">
                            {isCitizen && e.status === 'ONGOING' && !votedElections[e.id] && (
                                <button className="btn-vote" onClick={() => { setSelectedElection(e); setSelectedCandidate(null); }}>🗳️ Cast Vote</button>
                            )}
                            {votedElections[e.id] && <span className="voted-badge">✅ Voted</span>}
                            <button className="btn-results" onClick={() => toggleResults(e)}>📊 View Results</button>
                        </div>
                        {electionResults[e.id] && (
                            <div className="results-section">
                                <h4>Results</h4>
                                {electionResults[e.id].map((r, i) => (
                                    <div key={i} className="result-bar">
                                        <div className="result-info">
                                            <span className="result-name">{r.candidateName} ({r.party})</span>
                                            <span className="result-votes">{r.voteCount} votes ({r.percentage.toFixed(1)}%)</span>
                                        </div>
                                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${r.percentage}%` }}></div></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedElection && (
                <div className="modal-overlay" onClick={() => setSelectedElection(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>🗳️ Cast Your Vote</h2>
                        <h3>{selectedElection.name}</h3>
                        <div className="vote-options">
                            {selectedElection.candidates?.map(c => (
                                <button key={c.id} className={`vote-option ${selectedCandidate === c.id ? 'selected' : ''}`} onClick={() => setSelectedCandidate(c.id)}>
                                    <span className="vote-name">{c.name}</span>
                                    <span className="vote-party">{c.party}</span>
                                </button>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setSelectedElection(null)}>Cancel</button>
                            <button className="btn-confirm" onClick={handleVote} disabled={!selectedCandidate}>Confirm Vote</button>
                        </div>
                    </div>
                </div>
            )}

            {filteredElections.length === 0 && (
                <div className="empty-state"><span className="empty-icon">🏛️</span><h3>No elections found</h3><p>No elections match the selected filter.</p></div>
            )}
        </div>
    );
}
