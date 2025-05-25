// Stub for projects API
export async function getProjectById(id: string) {
  // TODO: Replace with real API call
  return {
    id,
    name: 'Sample Project',
    description: 'A sample project',
    startDate: '2025-01-01',
    endDate: null,
    status: 'IN_PROGRESS',
    assignedTeamMembers: [],
  };
}

export async function updateProject(id: string, data: any) {
  // TODO: Replace with real API call
  return { ...data, id };
}

export async function createProject(data: any) {
  // TODO: Replace with real API call
  return { ...data, id: 'new-project' };
}
