import React, { useState, useEffect } from 'react';
import type { TaskDto, ProjectDto } from '../../types/dto';
import { apiService } from '../../api/apiService';

interface SuggestTaskFormProps {
  projectId?: string; // Optional, for pre-selecting a project
  onSaveSuccess: () => void;
}

export default function SuggestTaskForm({ projectId, onSaveSuccess }: SuggestTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || '');
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!projectId) {
      apiService.getAllProjects().then(setProjects).catch(() => setProjects([]));
    }
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const pid = Number(projectId || selectedProjectId);
      if (!pid) {
        setError('Please select a project.');
        setLoading(false);
        return;
      }
      const res: TaskDto = await apiService.suggestTask(pid, {
        title,
        description,
        dueDate
      });
      if (res && res.id) {
        setSuccess('Task suggestion submitted!');
        setTimeout(() => {
          setSuccess('');
          onSaveSuccess();
        }, 1000);
      } else {
        setError(typeof res === 'object' && res && 'message' in res ? (res as { message: string }).message : 'Failed to suggest task.');
      }
    } catch {
      setError('Failed to suggest task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded max-w-lg mx-auto">
      {!projectId && (
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="project-select">Project</label>
          <select
            id="project-select"
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            title="Select Project"
          >
            <option value="">-- Select Project --</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="task-title">Title</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          placeholder="Enter task title"
          title="Task Title"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="task-desc">Description</label>
        <textarea
          id="task-desc"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          placeholder="Enter task description"
          title="Task Description"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="task-due">Due Date</label>
        <input
          id="task-due"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          required
          placeholder="Due date"
          title="Due Date"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">{success}</div>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Suggest Task'}
        </button>
      </div>
    </form>
  );
}
