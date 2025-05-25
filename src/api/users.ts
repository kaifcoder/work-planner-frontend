import api from '../utils/api';
import { setAuthToken } from '../utils/api';
// Stub for users API
export async function getUsers() {
  setAuthToken(localStorage.getItem('jwtToken') || null);
  const { data } = await api.get('/projects/team-members');
  return data;
}

export async function assignTaskToUser(taskId: string, userId: string) {
  // TODO: Replace with real API call
  setAuthToken(localStorage.getItem('jwtToken') || null);
  const { data } = await api.post(`/tasks/${taskId}/assign`, { userId });
  return data;
}
