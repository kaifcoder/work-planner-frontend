import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { apiService } from '../api/apiService';
import TaskCard from '../components/common/TaskCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Navbar from '../components/common/Navbar';
import Modal from '../components/common/Modal';

interface User { id: string; name: string; }
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  project?: { id: string; name: string };
  assignedToId?: string;
  assignedToUser?: User;
}

export default function TeamMemberDashboard() {
  const { logout, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Replace with your real API call
  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getAssignedTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProgressUpdate = (task: Task) => {
    setSelectedTask(task);
    setShowProgressModal(true);
  };

  const handleProgressModalClose = () => {
    setShowProgressModal(false);
    setSelectedTask(null);
    fetchTasks();
  };

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="text-gray-500 text-center">No tasks assigned to you yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                showProject={true}
                showProgressUpdateBtn={task.status === 'ASSIGNED' || task.status === 'IN_PROGRESS'}
                onProgressUpdate={handleProgressUpdate}
              />
            ))}
          </div>
        )}
        {showProgressModal && selectedTask && (
          <Modal onClose={handleProgressModalClose} title="Update Task Progress">
            {/* You can implement a TaskProgressForm here for updating progress */}
            <div className="text-center">Task progress update form goes here for <b>{selectedTask.title}</b>.</div>
            <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded" onClick={handleProgressModalClose}>Close</button>
          </Modal>
        )}
      </div>
    </>
  );
}
