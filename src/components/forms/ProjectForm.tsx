// src/components/forms/ProjectForm.js
import { useState, useEffect } from 'react';
import { createProject, updateProject } from '../../api/projects';
import { getUsers } from '../../api/users'; // To get TEAM_MEMBERs
import LoadingSpinner from '../common/LoadingSpinner';

// Define types for props and project
interface TeamMember {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: string;
  assignedTeamMembers: TeamMember[];
}

interface ProjectFormProps {
  project?: Project | null;
  onSaveSuccess: () => void;
}

const ProjectForm = ({ project = null, onSaveSuccess }: ProjectFormProps) => {
  const [name, setName] = useState<string>(project?.name || '');
  const [description, setDescription] = useState<string>(project?.description || '');
  const [endDate, setEndDate] = useState<string>(project?.endDate || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const projectStatuses = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED'];


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const projectData = {
      name,
      description,
      endDate: endDate || null
    };

    try {
      if (project) {
        await updateProject(project.id, projectData);
      } else {
        await createProject(projectData);
      }
      onSaveSuccess();
    } catch (err) {
      let errorMsg = 'Failed to save project.';
      if (err && typeof err === 'object' && err !== null && 'response' in err) {
        errorMsg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || errorMsg;
      }
      setError(errorMsg);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-700">Project Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
          required
          placeholder="Enter project name"
          title="Project Name"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-700">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter project description"
          title="Project Description"
        ></textarea>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Deadline: </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="End date"
            title="End Date"
          />
        </div>
      </div>
      {error && <p className="text-xs italic text-red-500">{error}</p>}
      <button
        type="submit"
        className="w-full px-4 py-2 font-bold text-white transition duration-200 bg-green-600 rounded-md shadow-md hover:bg-green-700"
      >
        {project ? 'Update Project' : 'Create Project'}
      </button>
    </form>
  );
};

export default ProjectForm;