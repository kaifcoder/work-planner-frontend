import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import type { ReactElement } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ManagerDashboard from './pages/ManagerDashboard';
import TeamMemberDashboard from './pages/TeamMemberDashboard';
import ProjectDetails from './pages/ProjectDetailPage';
import Reports from './pages/Reports';

function PrivateRoute({ children }: { children: ReactElement }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

// Parse JWT and extract 'role' claim
function getUserRole(token: string | null): 'ROLE_MANAGER' | 'ROLE_TEAM_MEMBER' | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role === 'ROLE_MANAGER') return 'ROLE_MANAGER';
    if (payload.role === 'ROLE_TEAM_MEMBER') return 'ROLE_TEAM_MEMBER';
    return null;
  } catch {
    return null;
  }
}

function AppRoutes() {
  const { token } = useAuth();
  const role = getUserRole(token);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/manager" element={<PrivateRoute><ManagerDashboard /></PrivateRoute>} />
      <Route path="/manager/projects/:id" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
      <Route path="/manager/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      <Route path="/team" element={<PrivateRoute><TeamMemberDashboard /></PrivateRoute>} />
      <Route path="/" element={
        token ? (
          role === 'ROLE_MANAGER' ? <Navigate to="/manager" replace /> : <Navigate to="/team" replace />
        ) : <Navigate to="/login" replace />
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}