import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDiscussions, getElections, createDiscussion, addReply, deleteDiscussion } from '../services/api';
import './Discussions.css';

export default function Discussions() {
    const [discussions, setDiscussions] = useState([]);
    const [elections, setElections] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newD, setNewD] = useState({ title: '', content: '', electionId: '' });
    const [rc, setRc] = useState({});
    const { user } = useAuth();
    const currentUserId = user?.id || null;

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { const r = await getDiscussions(); setDiscussions(r.data); } catch { }
        try { const r = await getElections(); setElections(r.data); } catch { }
    };

    const submitDiscussion = async () => {
        if (!newD.title || !newD.content) return;
        try {
            await createDiscussion({ title: newD.title, content: newD.content }, newD.electionId || undefined);
            setShowForm(false); load(); setNewD({ title: '', content: '', electionId: '' });
        } catch { }
    };

    const submitReply = async (pid) => {
        if (!rc[pid]) return;
        try {
            await addReply(pid, { title: 'Reply', content: rc[pid] });
            setRc({ ...rc, [pid]: '' }); load();
        } catch { }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this discussion?')) return;
        try { await deleteDiscussion(id); load(); } catch { }
    };

    return (
        <div className="disc-page-container">
            <div className="disc-page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/dashboard" className="disc-back-btn">← Back</Link>
                    <div><h1>💬 Civic Discussions</h1><p>Engage in conversations about elections</p></div>
                </div>
                <button className="disc-btn-primary" onClick={() => setShowForm(!showForm)}>+ New Discussion</button>
            </div>

            {showForm && (
                <div className="disc-form-card">
                    <h3>Start a Discussion</h3>
                    <div className="disc-form-row">
                        <input type="text" value={newD.title} onChange={(e) => setNewD({ ...newD, title: e.target.value })} placeholder="Title" className="disc-input" />
                        <select value={newD.electionId} onChange={(e) => setNewD({ ...newD, electionId: e.target.value })} className="disc-input">
                            <option value="">General</option>
                            {elections.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                    <textarea value={newD.content} onChange={(e) => setNewD({ ...newD, content: e.target.value })} rows="4" placeholder="Share your thoughts..." className="disc-input disc-full"></textarea>
                    <div className="disc-form-actions">
                        <button className="disc-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                        <button className="disc-btn-submit" onClick={submitDiscussion}>Post</button>
                    </div>
                </div>
            )}

            <div className="disc-list">
                {discussions.map(d => (
                    <div key={d.id} className="disc-card">
                        <div className="disc-card-top">
                            <div className="disc-author">
                                <div className="disc-avatar">{d.user?.fullName?.charAt(0) || '?'}</div>
                                <div><b>{d.user?.fullName || 'Anon'}</b><br /><small>{d.createdAt && new Date(d.createdAt).toLocaleString()}</small></div>
                            </div>
                            {d.election && <span className="disc-tag">🏛️ {d.election.name}</span>}
                        </div>
                        <h3>{d.title}</h3>
                        <p className="disc-content">{d.content}</p>
                        <div className="disc-card-bottom">
                            {d.replies?.length > 0 && (
                                <div className="disc-replies">
                                    <h4>Replies ({d.replies.length})</h4>
                                    {d.replies.map((r, i) => (
                                        <div key={i} className="disc-reply">
                                            <b>{r.user?.fullName}</b> <small>{r.createdAt && new Date(r.createdAt).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}</small>
                                            <p>{r.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {d.user?.id === currentUserId && (
                                <button className="disc-btn-delete" onClick={() => handleDelete(d.id)}>🗑️ Delete</button>
                            )}
                        </div>
                        <div className="disc-reply-box">
                            <input value={rc[d.id] || ''} onChange={(e) => setRc({ ...rc, [d.id]: e.target.value })} placeholder="Write a reply..." onKeyDown={(e) => e.key === 'Enter' && submitReply(d.id)} className="disc-input" />
                            <button onClick={() => submitReply(d.id)} className="disc-btn-reply">Reply</button>
                        </div>
                    </div>
                ))}
            </div>
            {discussions.length === 0 && <div className="disc-empty"><span style={{ fontSize: '64px' }}>💬</span><h3>No discussions yet</h3></div>}
        </div>
    );
}
