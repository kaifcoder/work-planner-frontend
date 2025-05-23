import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import type { ReactElement } from 'react';
import Login from './components/Login';
import Register from './components/Register';

function Home() {
  const { token, logout } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Project Management App</h1>
      <div className="mb-4">JWT Token: <span className="break-all">{token}</span></div>
      <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={logout}>Logout</button>
    </div>
  );
}

function PrivateRoute({ children }: { children: ReactElement }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}