import api from '../utils/api';

export async function getTasks(params: { projectId: string }) {
  // TODO: Replace with real API call
  const { data } = await api.get('/tasks', { params });
  return data;
}

export async function createTask(task: any) {
  // TODO: Replace with real API call
  const { data } = await api.post('/tasks', task);
  return data;
}

export async function updateTask(id: string, task: any) {
  // TODO: Replace with real API call
  const { data } = await api.put(`/tasks/${id}`, task);
  return data;
}

export async function deleteTask(id: string) {
  // TODO: Replace with real API call
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
}
