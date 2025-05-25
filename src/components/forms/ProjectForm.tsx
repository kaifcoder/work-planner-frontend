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
  const [startDate, setStartDate] = useState<string>(project?.startDate || '');
  const [endDate, setEndDate] = useState<string>(project?.endDate || '');
  const [status, setStatus] = useState<string>(project?.status || 'NOT_STARTED');
  const [assignedTeamMemberIds, setAssignedTeamMemberIds] = useState<Set<string>>(
    new Set(project?.assignedTeamMembers?.map((member: TeamMember) => member.id) || [])
  );
  const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const projectStatuses = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED'];

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      setError('');
      try {
        const members = await getUsers('TEAM_MEMBER');
        setAllTeamMembers(members);
      } catch (err) {
        let errorMsg = 'Failed to load team members.';
        if (err && typeof err === 'object' && err !== null && 'response' in err) {
          errorMsg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || errorMsg;
        }
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);

  const handleMemberToggle = (memberId: string) => {
    setAssignedTeamMemberIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const projectData = {
      name,
      description,
      startDate,
      endDate: endDate || null, // Ensure empty string becomes null
      status,
      assignedTeamMemberIds: Array.from(assignedTeamMemberIds),
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
          <label className="block mb-2 text-sm font-semibold text-gray-700">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            placeholder="Start date"
            title="Start Date"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">End Date (Optional):</label>
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
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-700">Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500"
          title="Project Status"
        >
          {projectStatuses.map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-700">Assigned Team Members:</label>
        <div className="p-3 overflow-y-auto border border-gray-300 rounded max-h-40">
          {allTeamMembers.length === 0 ? (
            <p className="text-sm text-gray-500">No team members available to assign.</p>
          ) : (
            allTeamMembers.map(member => (
              <div key={member.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`member-${member.id}`}
                  checked={assignedTeamMemberIds.has(member.id)}
                  onChange={() => handleMemberToggle(member.id)}
                  className="w-4 h-4 mr-2 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor={`member-${member.id}`} className="text-sm text-gray-700">{member.name} ({member.email})</label>
              </div>
            ))
          )}
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