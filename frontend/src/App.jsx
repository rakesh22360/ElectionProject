import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Elections from './pages/Elections';
import Anomalies from './pages/Anomalies';
import Reports from './pages/Reports';
import Discussions from './pages/Discussions';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/elections" element={<ProtectedRoute><Elections /></ProtectedRoute>} />
          <Route path="/anomalies" element={<ProtectedRoute><Anomalies /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/discussions" element={<ProtectedRoute><Discussions /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['ROLE_ADMIN']}><Admin /></ProtectedRoute>} />
          <Route path="/admin/elections" element={<ProtectedRoute roles={['ROLE_ADMIN']}><Admin /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
