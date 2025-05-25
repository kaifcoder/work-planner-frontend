import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import type { ReactElement } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ManagerDashboard from './pages/ManagerDashboard';
import TeamMemberDashboard from './pages/TeamMemberDashboard';
import ProjectDetails from './pages/ProjectDetailPage';
import TaskDetails from './pages/TaskDetails';
import Reports from './pages/Reports';

function PrivateRoute({ children }: { children: ReactElement }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

// TODO: Replace with real role logic from user profile/JWT
function getUserRole(token: string | null): 'manager' | 'team' | null {
  if (!token) return null;
  return token.includes('manager') ? 'manager' : 'team';
}

function AppRoutes() {
  const { token } = useAuth();
  const role = getUserRole(token);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/manager" element={<PrivateRoute><ManagerDashboard /></PrivateRoute>} />
      <Route path="/manager/projects/:projectId" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
      <Route path="/manager/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      <Route path="/team" element={<PrivateRoute><TeamMemberDashboard /></PrivateRoute>} />
      <Route path="/team/tasks/:taskId" element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
      <Route path="/" element={
        token ? (
          role === 'manager' ? <Navigate to="/manager" replace /> : <Navigate to="/team" replace />
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