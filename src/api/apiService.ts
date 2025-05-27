import type { ProjectDto, UserDto, TaskDto } from '../types/dto';

const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const apiService = {
  async createProject(projectData: Pick<ProjectDto, 'name' | 'description' | 'endDate'>) {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    })
    return response.json() as Promise<ProjectDto>;
  },

  async getProjects() {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      headers: getAuthHeaders(),
    })
    return response.json() as Promise<ProjectDto[]>;
  },

  async getProjectById(projectId: number) {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
      headers: getAuthHeaders(),
    })
    return response.json() as Promise<ProjectDto>;
  },

  async getAllProjects() {
    const response = await fetch(`${API_BASE_URL}/api/projects/all`, {
      headers: getAuthHeaders(),
    })
    return response.json() as Promise<ProjectDto[]>;
  },

  async getTeamMembers() {
    const response = await fetch(`${API_BASE_URL}/api/projects/team-members`, {
      headers: getAuthHeaders(),
    })
    return response.json() as Promise<UserDto[]>;
  },

  async addMemberToProject(projectId: number, userId: number) {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/members?userId=${userId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    })
    return response.json() as Promise<ProjectDto>;
  },

  // Tasks
  async suggestTask(projectId: number, taskData: Pick<TaskDto, 'title' | 'description' | 'dueDate'>) {
    const response = await fetch(`${API_BASE_URL}/api/task/suggest/${projectId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    })
    return response.json() as Promise<TaskDto>;
  },

  async approveTask(taskId: number) {
    const response = await fetch(`${API_BASE_URL}/api/task/approve/${taskId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    })
    return response.json() as Promise<TaskDto>;
  },

  async rejectTask(taskId: number) {
    const response = await fetch(`${API_BASE_URL}/api/task/reject/${taskId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    })
    return response.json() as Promise<TaskDto>;
  },

  async createTask(taskData: Pick<TaskDto, 'title' | 'description' | 'dueDate' | 'project'>) {
    const response = await fetch(`${API_BASE_URL}/api/task`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    })
    return response.json() as Promise<TaskDto>;
  },

  async updateTask(taskId: number, taskData: Partial<TaskDto>) {
    const response = await fetch(`${API_BASE_URL}/api/task/${taskId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    })
    return response.json() as Promise<TaskDto>;
  },

  async assignTask(taskId: number, userId: number) {
    const response = await fetch(`${API_BASE_URL}/api/task/assign/${taskId}/${userId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    })
    return response.json() as Promise<TaskDto>;
  },

  async getTasksForProject(projectId: number) {
    const response = await fetch(`${API_BASE_URL}/api/task/project/${projectId}`, {
      headers: getAuthHeaders(),
    })
    return response.json() as Promise<TaskDto[]>;
  },

  async getAssignedTasks() {
    const response = await fetch(`${API_BASE_URL}/api/task/assigned`, {
      headers: getAuthHeaders(),
    })
    return response.json() as Promise<TaskDto[]>;
  },

  async deleteTask(taskId: string) {
    const response = await fetch(`${API_BASE_URL}/api/task/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return response.status === 204 ? {} : (await response.json() as TaskDto);
  },

  // Projects
  async deleteProject(projectId: string) {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete project');
    return response.status === 204 ? {} : (await response.json() as ProjectDto);
  },

  async updateProject(projectId: string, projectData: Pick<ProjectDto, 'name' | 'description' | 'endDate'>) {
    const response = await fetch(`${API_BASE_URL}/api/projects/update/${projectId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json() as Promise<ProjectDto>;
  },

  // Reports
  async getManagerReport(filters: { status?: string; teamMemberId?: number; projectId?: number } = {}) {
    const params = new URLSearchParams()
    if (filters.status) params.append("status", filters.status)
    if (filters.teamMemberId) params.append("teamMemberId", String(filters.teamMemberId))
    if (filters.projectId) params.append("projectId", String(filters.projectId))

    const response = await fetch(`${API_BASE_URL}/api/report/manager/tasks?${params}`, {
      headers: getAuthHeaders(),
    })
    return response.json() as Promise<TaskDto[]>;
  },

  async getMemberReport(filters: { status?: string; projectId?: number } = {}) {
    const params = new URLSearchParams()
    if (filters.status) params.append("status", filters.status)
    if (filters.projectId) params.append("projectId", String(filters.projectId))

    const response = await fetch(`${API_BASE_URL}/api/report/member/tasks?${params}`, {
      headers: getAuthHeaders(),
    })
    return response.json() as Promise<TaskDto[]>;
  },
}
