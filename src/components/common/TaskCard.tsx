import { Link } from 'react-router-dom';
import { HiOutlineUser, HiOutlineCalendar, HiOutlineClipboardList, HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';
import type { ReactElement } from 'react';

interface Project {
  id: string;
  name: string;
}
interface User { id: string; name: string; }
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  project?: Project;
  assignedToId?: string;
  assignedToUser?: User;
  
}

interface TaskCardProps {
  task: Task;
  showProject?: boolean;
  showActions?: boolean;
  showProgressUpdateBtn?: boolean;
  onProgressUpdate?: (task: Task) => void;
  onEdit?: (task: Task) => void;
}

const statusIcons: Record<string, ReactElement> = {
  'PENDING_APPROVAL': <HiOutlineExclamationCircle className="inline mr-1 text-yellow-500" />,
  'ASSIGNED': <HiOutlineClipboardList className="inline mr-1 text-blue-500" />,
  'IN_PROGRESS': <HiOutlineClipboardList className="inline mr-1 text-purple-500" />,
  'COMPLETED': <HiOutlineCheckCircle className="inline mr-1 text-green-500" />,
  'REJECTED': <HiOutlineExclamationCircle className="inline mr-1 text-red-500" />,
  'OVERDUE': <HiOutlineExclamationCircle className="inline mr-1 text-red-700" />,
};

const statusColors: Record<string, string> = {
  'PENDING_APPROVAL': 'bg-yellow-100 text-yellow-800',
  'ASSIGNED': 'bg-blue-100 text-blue-800',
  'IN_PROGRESS': 'bg-purple-100 text-purple-800',
  'COMPLETED': 'bg-green-100 text-green-800',
  'REJECTED': 'bg-red-100 text-red-800',
  'OVERDUE': 'bg-red-200 text-red-900 font-bold',
};

const TaskCard = ({ task, showProject = false, showActions = false, showProgressUpdateBtn = false, onProgressUpdate, onEdit }: TaskCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-200 group relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">{task.title}</h3>
        <span className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status] || 'bg-gray-200 text-gray-800'}`}
          title={task.status.replace(/_/g, ' ')}>
          {statusIcons[task.status] || null}
          {task.status.replace(/_/g, ' ')}
        </span>
      </div>
      <p className="text-gray-700 text-base mb-4">{task.description}</p>
      <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
        {showProject && (
          <div className="flex items-center gap-1">
            <HiOutlineClipboardList className="text-blue-400" />
            <span><strong>Project:</strong> {task.project?.name}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <HiOutlineUser className="text-green-400" />
          <span><strong>Assigned To:</strong> {task.assignedToUser?.username || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-1">
          <HiOutlineCalendar className="text-purple-400" />
          <span><strong>Due Date:</strong> {task.dueDate}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {showActions && (
          <>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md text-sm shadow-sm transition duration-200" onClick={() => onEdit && onEdit(task)}>
              Edit
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md text-sm shadow-sm transition duration-200">
              Delete
            </button>
          </>
        )}
        {showProgressUpdateBtn && onProgressUpdate && (
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md text-sm shadow-sm transition duration-200"
            onClick={() => onProgressUpdate(task)}
          >
            Update Progress
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;