import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Register() {
    const [user, setUser] = useState({ username: '', fullName: '', email: '', password: '', role: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await register(user);
            setSuccess('Account created! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
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
                    <p>Create your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} placeholder="Choose a username" required />
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={user.fullName} onChange={(e) => setUser({ ...user, fullName: e.target.value })} placeholder="Enter your full name" required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="Enter your email" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="Create a password" required />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })} required style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}>
                            <option value="" style={{ background: '#1a1a2e' }}>Select your role</option>
                            <option value="CITIZEN" style={{ background: '#1a1a2e' }}>Citizen</option>
                            <option value="OBSERVER" style={{ background: '#1a1a2e' }}>Election Observer</option>
                            <option value="ANALYST" style={{ background: '#1a1a2e' }}>Data Analyst</option>
                        </select>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}
