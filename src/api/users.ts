import api from '../utils/api';

// Stub for users API
export async function getUsers(role?: string) {
  // TODO: Replace with real API call
  const { data } = await api.get('/users', { params: role ? { role } : {} });
  return data;
}

export async function assignTaskToUser(taskId: string, userId: string) {
  // TODO: Replace with real API call
  const { data } = await api.post(`/tasks/${taskId}/assign`, { userId });
  return data;
}
