import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
    const { isLoggedIn, getRole } = useAuth();

    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    if (roles && roles.length > 0 && !roles.includes(getRole())) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
