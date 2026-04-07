import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { getCaptcha } from '../services/api';
import './Login.css';

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [captcha, setCaptcha] = useState({ id: '', question: '' });
    const [captchaAnswer, setCaptchaAnswer] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const loadCaptcha = async () => {
        try {
            const res = await getCaptcha();
            setCaptcha({ id: res.data.captchaId, question: res.data.question });
            setCaptchaAnswer('');
        } catch (err) {
            console.error('Failed to load captcha');
        }
    };

    useEffect(() => { loadCaptcha(); }, []);

    const fillCredentials = (username, password) => {
        setCredentials({ username, password });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captchaAnswer.trim()) {
            setError('Please solve the math problem');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const captchaToken = `${captcha.id}:${captchaAnswer.trim()}`;
            await login({ ...credentials, captchaToken });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
            setLoading(false);
            loadCaptcha();
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Google Login failed');
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

                    <div className="captcha-box">
                        <div className="captcha-header">
                            <span className="captcha-icon">🔒</span>
                            <span>Security Check</span>
                        </div>
                        <div className="captcha-question">{captcha.question || 'Loading...'}</div>
                        <div className="captcha-input-row">
                            <input
                                type="number"
                                value={captchaAnswer}
                                onChange={(e) => setCaptchaAnswer(e.target.value)}
                                placeholder="Your answer"
                                className="captcha-input"
                                required
                            />
                            <button type="button" onClick={loadCaptcha} className="captcha-refresh" title="New question">
                                🔄
                            </button>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="oauth-separator" style={{ margin: '20px 0', textAlign: 'center', color: '#888' }}>
                    <span>OR</span>
                </div>

                <div className="google-login-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Login failed')}
                        theme="filled_black"
                        shape="pill"
                    />
                </div>

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
