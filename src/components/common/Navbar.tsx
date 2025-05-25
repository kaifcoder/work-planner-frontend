import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';

const Navbar = () => {
  const { token, logout } = useAuth();
  // Parse role from JWT
  let role: 'manager' | 'team' | null = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'ROLE_MANAGER') role = 'manager';
      else if (payload.role === 'ROLE_TEAM_MEMBER') role = 'team';
      else role = null;
    } catch {
      // Ignore invalid token
    }
  }

  return (
    <nav className="flex items-center justify-between px-6 py-3 text-white bg-gray-800 shadow-md">
      <div className="flex items-center gap-6">
        <Link to={role === 'manager' ? '/manager' : '/team'} className="text-xl font-bold transition hover:text-green-300">Work Planner</Link>
        {role === 'manager' && (
          <>
            <Link to="/manager" className="transition hover:text-green-300">Dashboard</Link>
            <Link to="/manager/reports" className="transition hover:text-green-300">Reports</Link>
          </>
        )}
        {role === 'team' && (
          <>
            <Link to="/team" className="transition hover:text-green-300">Dashboard</Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        {token ? (
          <button onClick={logout} className="px-4 py-2 transition bg-red-500 rounded hover:bg-red-600">Logout</button>
        ) : (
          <>
            <Link to="/login" className="transition hover:text-green-300">Login</Link>
            <Link to="/register" className="transition hover:text-green-300">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;