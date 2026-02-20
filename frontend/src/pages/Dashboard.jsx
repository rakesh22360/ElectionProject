import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getDashboardStats } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const userName = user?.fullName || user?.username || '';
    const userInitial = userName.charAt(0).toUpperCase();
    const role = user?.role || '';
    const isAdmin = role === 'ROLE_ADMIN';
    const isCitizen = role === 'ROLE_CITIZEN';
    const isObserver = role === 'ROLE_OBSERVER';
    const isAnalyst = role === 'ROLE_ANALYST';
    const roleMap = { ROLE_ADMIN: 'Admin', ROLE_CITIZEN: 'Citizen', ROLE_OBSERVER: 'Observer', ROLE_ANALYST: 'Analyst' };
    const userRoleDisplay = roleMap[role] || role;
    const roleBadgeClass = role.replace('ROLE_', '').toLowerCase();
    const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        getDashboardStats().then(res => setStats(res.data)).catch(() => { });
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <span className="logo-icon">🗳️</span>
                    <h2>ElectiVote</h2>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="nav-item active"><span className="nav-icon">📊</span> Dashboard</Link>
                    <Link to="/elections" className="nav-item"><span className="nav-icon">🏛️</span> Elections</Link>

                    {isAdmin && <>
                        <div className="nav-section">Admin</div>
                        <Link to="/admin/users" className="nav-item"><span className="nav-icon">👥</span> User Management</Link>
                        <Link to="/admin/elections" className="nav-item"><span className="nav-icon">⚙️</span> Manage Elections</Link>
                    </>}

                    {isCitizen && <>
                        <div className="nav-section">Citizen</div>
                        <Link to="/discussions" className="nav-item"><span className="nav-icon">💬</span> Discussions</Link>
                    </>}

                    {isObserver && <>
                        <div className="nav-section">Observer</div>
                        <Link to="/anomalies" className="nav-item"><span className="nav-icon">⚠️</span> Anomalies</Link>
                    </>}

                    {isAnalyst && <>
                        <div className="nav-section">Analyst</div>
                        <Link to="/reports" className="nav-item"><span className="nav-icon">📄</span> Reports</Link>
                    </>}

                    <div className="nav-section">More</div>
                    {!isCitizen && <Link to="/discussions" className="nav-item"><span className="nav-icon">💬</span> Discussions</Link>}
                    {!isObserver && <Link to="/anomalies" className="nav-item"><span className="nav-icon">⚠️</span> Anomalies</Link>}
                    {!isAnalyst && <Link to="/reports" className="nav-item"><span className="nav-icon">📄</span> Reports</Link>}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">{userInitial}</div>
                        <div className="user-details">
                            <span className="user-name">{userName}</span>
                            <span className="user-role">{userRoleDisplay}</span>
                        </div>
                    </div>
                    <button className="theme-toggle" onClick={toggleTheme}>
                        <span className="theme-toggle-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
                        <span className="theme-toggle-label">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-bar">
                    <div className="welcome">
                        <h1>Welcome, {userName}!</h1>
                        <p>{todayDate}</p>
                    </div>
                    <div className={`role-badge ${roleBadgeClass}`}>{userRoleDisplay}</div>
                </header>

                {stats && (
                    <div className="stats-grid">
                        <div className="stat-card" style={{ '--accent': '#6c5ce7' }}>
                            <div className="stat-icon">🏛️</div>
                            <div className="stat-info"><span className="stat-value">{stats.totalElections}</span><span className="stat-label">Total Elections</span></div>
                        </div>
                        <div className="stat-card" style={{ '--accent': '#00b894' }}>
                            <div className="stat-icon">✅</div>
                            <div className="stat-info"><span className="stat-value">{stats.activeElections}</span><span className="stat-label">Active Elections</span></div>
                        </div>
                        <div className="stat-card" style={{ '--accent': '#e17055' }}>
                            <div className="stat-icon">🗳️</div>
                            <div className="stat-info"><span className="stat-value">{(stats.totalVotesCast || 0).toLocaleString()}</span><span className="stat-label">Votes Cast</span></div>
                        </div>
                        {isAdmin && (
                            <div className="stat-card" style={{ '--accent': '#fdcb6e' }}>
                                <div className="stat-icon">👥</div>
                                <div className="stat-info"><span className="stat-value">{stats.totalUsers}</span><span className="stat-label">Total Users</span></div>
                            </div>
                        )}
                        {!isCitizen && (
                            <div className="stat-card" style={{ '--accent': '#ff6b6b' }}>
                                <div className="stat-icon">⚠️</div>
                                <div className="stat-info"><span className="stat-value">{stats.pendingAnomalies}</span><span className="stat-label">Pending Anomalies</span></div>
                            </div>
                        )}
                        {!isCitizen && (
                            <div className="stat-card" style={{ '--accent': '#a29bfe' }}>
                                <div className="stat-icon">📄</div>
                                <div className="stat-info"><span className="stat-value">{stats.totalReports}</span><span className="stat-label">Reports</span></div>
                            </div>
                        )}
                        <div className="stat-card" style={{ '--accent': '#55efc4' }}>
                            <div className="stat-icon">💬</div>
                            <div className="stat-info"><span className="stat-value">{stats.totalDiscussions}</span><span className="stat-label">Discussions</span></div>
                        </div>
                        {!isCitizen && (
                            <div className="stat-card" style={{ '--accent': '#fab1a0' }}>
                                <div className="stat-icon">🔒</div>
                                <div className="stat-info"><span className="stat-value">{stats.totalAnomalies}</span><span className="stat-label">Total Anomalies</span></div>
                            </div>
                        )}
                    </div>
                )}

                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/elections" className="action-card"><span className="action-icon">🏛️</span><span className="action-text">View Elections</span></Link>
                        {(isCitizen || isAdmin) && <Link to="/discussions" className="action-card"><span className="action-icon">💬</span><span className="action-text">Join Discussion</span></Link>}
                        {(isObserver || isAdmin) && <Link to="/anomalies" className="action-card"><span className="action-icon">⚠️</span><span className="action-text">Report Anomaly</span></Link>}
                        {(isAnalyst || isAdmin) && <Link to="/reports" className="action-card"><span className="action-icon">📊</span><span className="action-text">View Reports</span></Link>}
                    </div>
                </div>
            </main>
        </div>
    );
}
