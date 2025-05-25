import React from 'react';
import { Project } from '../../pages/ManagerDashboard';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onAssign: (project: Project) => void;
  onTasks: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onEdit, onDelete, onAssign, onTasks }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {projects.map(project => (
      <div key={project.id} className="flex flex-col p-4 bg-white rounded-lg shadow">
        <h2 className="mb-2 text-xl font-semibold">{project.name}</h2>
        <p className="mb-2 text-gray-600">{project.description}</p>
        <div className="flex gap-2 mt-auto">
          <button className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600" onClick={() => onEdit(project)}>Edit</button>
          <button className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600" onClick={() => onDelete(project.id)}>Delete</button>
          <button className="px-3 py-1 text-white bg-purple-500 rounded hover:bg-purple-600" onClick={() => onAssign(project)}>Assign Members</button>
          <button className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600" onClick={() => onTasks(project)}>Tasks</button>
        </div>
      </div>
    ))}
  </div>
);

export default ProjectList;
