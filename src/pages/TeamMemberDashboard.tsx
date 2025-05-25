import { useAuth } from '../contexts/useAuth';

export default function TeamMemberDashboard() {
  const { logout } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Team Member Dashboard</h1>
      <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={logout}>Logout</button>
    </div>
  );
}
