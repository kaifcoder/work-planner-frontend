const API_BASE_URL = "http://localhost:8080"

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const apiService = {
  async createProject(projectData: any) {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    })
    return response.json()
  },

  async getProjects() {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async getProjectById(projectId: number) {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async getAllProjects() {
    const response = await fetch(`${API_BASE_URL}/api/projects/all`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async getTeamMembers() {
    const response = await fetch(`${API_BASE_URL}/api/projects/team-members`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async addMemberToProject(projectId: number, userId: number) {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/members?userId=${userId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  // Tasks
  async suggestTask(projectId: number, taskData: any) {
    const response = await fetch(`${API_BASE_URL}/api/task/suggest/${projectId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    })
    return response.json()
  },

  async approveTask(taskId: number) {
    const response = await fetch(`${API_BASE_URL}/api/task/approve/${taskId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async rejectTask(taskId: number) {
    const response = await fetch(`${API_BASE_URL}/api/task/reject/${taskId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async createTask(taskData: any) {
    const response = await fetch(`${API_BASE_URL}/api/task`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    })
    return response.json()
  },

  async updateTask(taskId: number, taskData: any) {
    const response = await fetch(`${API_BASE_URL}/api/task/${taskId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    })
    return response.json()
  },

  async assignTask(taskId: number, userId: number) {
    const response = await fetch(`${API_BASE_URL}/api/task/assign/${taskId}/${userId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async getTasksForProject(projectId: number) {
    const response = await fetch(`${API_BASE_URL}/api/task/project/${projectId}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async getAssignedTasks() {
    const response = await fetch(`${API_BASE_URL}/api/task/assigned`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async deleteTask(taskId: string) {
    const response = await fetch(`${API_BASE_URL}/api/task/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete task');
    // Refresh state after deletion
    return response.status === 204 ? {} : response.json();
  },

  // Projects
  async deleteProject(projectId: string) {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete project');
    // Refresh state after deletion
    return response.status === 204 ? {} : response.json();
  },

  // Reports
  async getManagerReport(filters: any = {}) {
    const params = new URLSearchParams()
    if (filters.status) params.append("status", filters.status)
    if (filters.teamMemberId) params.append("teamMemberId", filters.teamMemberId)
    if (filters.projectId) params.append("projectId", filters.projectId)

    const response = await fetch(`${API_BASE_URL}/api/report/manager/tasks?${params}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async getMemberReport(filters: any = {}) {
    const params = new URLSearchParams()
    if (filters.status) params.append("status", filters.status)
    if (filters.projectId) params.append("projectId", filters.projectId)

    const response = await fetch(`${API_BASE_URL}/api/report/member/tasks?${params}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },
}
