import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    });

    const login = async (credentials) => {
        const res = await api.post('/auth/login', credentials);
        const data = res.data;
        localStorage.setItem('currentUser', JSON.stringify(data));
        localStorage.setItem('token', data.token);
        setUser(data);
        return data;
    };

    const register = async (userData) => {
        const res = await api.post('/auth/register', userData);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        setUser(null);
    };

    const getRole = () => (user ? user.role : '');
    const hasRole = (role) => getRole() === role;
    const isLoggedIn = () => !!user;

    return (
        <AuthContext.Provider value={{ user, login, register, logout, getRole, hasRole, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
