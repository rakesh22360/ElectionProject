import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const fillCredentials = (username, password) => {
        setCredentials({ username, password });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(credentials);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="logo">
                        <span className="logo-icon">🗳️</span>
                        <h1>ElectiVote</h1>
                    </div>
                    <p>Election Monitoring System</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </div>

                <div className="demo-credentials">
                    <h4>Demo Credentials</h4>
                    <div className="cred-grid">
                        <button onClick={() => fillCredentials('admin', 'admin123')} className="cred-btn admin">👨‍💼 Admin</button>
                        <button onClick={() => fillCredentials('citizen1', 'citizen123')} className="cred-btn citizen">👤 Citizen</button>
                        <button onClick={() => fillCredentials('observer1', 'observer123')} className="cred-btn observer">👁️ Observer</button>
                        <button onClick={() => fillCredentials('analyst1', 'analyst123')} className="cred-btn analyst">📊 Analyst</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
