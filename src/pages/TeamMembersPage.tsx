import { useEffect, useState } from 'react';
import { apiService } from '../api/apiService';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { UserDto } from '../types/dto';

export default function TeamMembersPage() {
  const [members, setMembers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiService.getTeamMembers();
        setMembers(data);
      } catch {
        setError('Failed to fetch team members.');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-8 w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <button
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={async () => {
              const username = prompt('Enter username for new team member:');
              if (!username) return;
              const password = prompt('Enter password for new team member:');
              if (!password) return;
              try {
                const res = await fetch('http://localhost:8080/auth/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username, password }),
                });
                if (!res.ok) throw new Error('Registration failed');
                alert('Team member added successfully!');
                // Refresh list
                const data = await apiService.getTeamMembers();
                setMembers(data);
              } catch {
                alert('Failed to add team member.');
              }
            }}
          >
            + Add Team Member
          </button>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : members.length === 0 ? (
          <div className="text-gray-500 text-center">No team members found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b text-left">Username</th>
                  <th className="px-4 py-2 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{member.username}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className="py-1 px-3 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-700"
                        onClick={async () => {
                          if (!window.confirm(`Remove ${member.username}?`)) return;
                          try {
                            await fetch(`http://localhost:8080/auth/remove-user`, {
                              method: 'POST',
                              headers: { 
                                'Content-Type': 'application/json',
                                'authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                               },
                              body: member.username
                            });
                            // Refresh list
                            setMembers(members.filter(m => m.id !== member.id));
                          } catch {
                            alert('Failed to remove team member.');
                          }
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
