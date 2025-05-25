// src/components/forms/ProjectForm.js
import React, { useState, useEffect } from 'react';
import { createProject, updateProject } from '../../api/projects';
import { getUsers } from '../../api/users'; // To get TEAM_MEMBERs

const ProjectForm = ({ project = null, onSaveSuccess }) => {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [startDate, setStartDate] = useState(project?.startDate || '');
  const [endDate, setEndDate] = useState(project?.endDate || '');
  const [status, setStatus] = useState(project?.status || 'NOT_STARTED');
  const [assignedTeamMemberIds, setAssignedTeamMemberIds] = useState(
    new Set(project?.assignedTeamMembers?.map(member => member.id) || [])
  );
  const [allTeamMembers, setAllTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const projectStatuses = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED'];

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      setError('');
      try {
        const members = await getUsers('TEAM_MEMBER');
        setAllTeamMembers(members);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load team members.');
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);

  const handleMemberToggle = (memberId) => {
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

  const handleSubmit = async (e) => {
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
      setError(err.response?.data?.message || 'Failed to save project.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">Project Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
        ></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">End Date (Optional):</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {projectStatuses.map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">Assigned Team Members:</label>
        <div className="border border-gray-300 rounded p-3 max-h-40 overflow-y-auto">
          {allTeamMembers.length === 0 ? (
            <p className="text-gray-500 text-sm">No team members available to assign.</p>
          ) : (
            allTeamMembers.map(member => (
              <div key={member.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`member-${member.id}`}
                  checked={assignedTeamMemberIds.has(member.id)}
                  onChange={() => handleMemberToggle(member.id)}
                  className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor={`member-${member.id}`} className="text-gray-700 text-sm">{member.name} ({member.email})</label>
              </div>
            ))
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md w-full transition duration-200"
      >
        {project ? 'Update Project' : 'Create Project'}
      </button>
    </form>
  );
};

export default ProjectForm;