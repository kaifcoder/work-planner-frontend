import type { TaskDto, UserDto } from '../../types/dto';
import React, { useState, useEffect } from 'react';
import { apiService } from '../../api/apiService';

interface TaskFormProps {
  onSaveSuccess: () => void;
  projectId: string;
  isManager: boolean;
  task?: TaskDto;
}

export default function TaskForm({ onSaveSuccess, projectId, isManager, task }: TaskFormProps) {
  const { createTask, updateTask, getTeamMembers } = apiService;
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(task?.dueDate ? (typeof task.dueDate === 'string' ? task.dueDate : new Date(task.dueDate).toISOString().slice(0, 10)) : '');
  const [assignedToUserId, setAssignedToUserId] = useState(task?.assignedToUser?.id?.toString() || '');
  const [status, setStatus] = useState(task?.status || 'ASSIGNED');
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getTeamMembers().then(setUsers).catch(() => setUsers([]));
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(task.dueDate ? (typeof task.dueDate === 'string' ? task.dueDate : new Date(task.dueDate).toISOString().slice(0, 10)) : '');
      setAssignedToUserId(task.assignedToUser?.id?.toString() || '');
      setStatus(task.status || 'ASSIGNED');
    }
  }, [task, getTeamMembers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (task) {
        await updateTask(task.id, {
          title,
          description,
          dueDate,
          projectId: Number(projectId),
          project: { id: Number(projectId), name: '', description: '', createdById: 0, endDate: '', memberIds: [], taskIds: [], createdBy: { id: 0, username: '', role: '', projectIds: [], assignedTaskIds: [], suggestedTaskIds: [] }, memberDtos: [] },
          status,
          ...(isManager && assignedToUserId ? {
            assignedToUser: { id: Number(assignedToUserId), username: '', role: '', projectIds: [], assignedTaskIds: [], suggestedTaskIds: [] }
          } : {})
        } as Partial<TaskDto>);
        setSuccess('Task updated successfully!');
      } else {
        await createTask({
          title,
          description,
          dueDate,
          projectId: Number(projectId),
          project: { id: Number(projectId), name: '', description: '', createdById: 0, endDate: '', memberIds: [], taskIds: [], createdBy: { id: 0, username: '', role: '', projectIds: [], assignedTaskIds: [], suggestedTaskIds: [] }, memberDtos: [] },
          ...(isManager && assignedToUserId ? {
            assignedToUser: { id: Number(assignedToUserId), username: '', role: '', projectIds: [], assignedTaskIds: [], suggestedTaskIds: [] }
          } : {})
        } as Pick<TaskDto, 'title' | 'description' | 'dueDate' | 'project' | 'assignedToUser'>);
        setSuccess('Task created successfully!');
        setTitle('');
        setDescription('');
        setDueDate('');
        setAssignedToUserId('');
      }
      onSaveSuccess();
    } catch {
      setError('Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded max-w-lg mx-auto">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">{success}</div>}
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
      {task && (
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="task-status">Status</label>
          <select
            id="task-status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      )}
      {isManager && (
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="task-assign">Assign to User (optional)</label>
          <select
            id="task-assign"
            value={assignedToUserId}
            onChange={e => setAssignedToUserId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Unassigned --</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (task ? 'Saving...' : 'Creating...') : (task ? 'Save Changes' : 'Create Task')}
        </button>
      </div>
    </form>
  );
}
