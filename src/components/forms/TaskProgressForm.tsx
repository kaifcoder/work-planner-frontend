import React, { useState } from 'react';

interface TaskProgressFormProps {
  taskId: string;
  currentStatus: string;
  onSave: (progress: { status: string }) => Promise<void>;
  onClose: () => void;
}

const statusOptions = [
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'BLOCKED', label: 'Blocked' },
];

export default function TaskProgressForm({ taskId, currentStatus, onSave, onClose }: TaskProgressFormProps) {
  const [status, setStatus] = useState(currentStatus === 'ASSIGNED' ? 'IN_PROGRESS' : currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await onSave({ status });
      setSuccess('Progress updated!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1000);
    } catch {
      setError('Failed to update progress.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded max-w-lg mx-auto">
      <div>
        <label htmlFor="status-select" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status-select"
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">{success}</div>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Update Progress'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
