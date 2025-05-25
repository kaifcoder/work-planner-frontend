import { Link } from 'react-router-dom';

const TaskCard = ({ task, showProject = false, showActions = false, showProgressUpdateBtn = false, onProgressUpdate }) => {
  const getProgressBarColor = (progress: any) => {
    if (progress === 100) return 'bg-green-500';
    if (progress > 70) return 'bg-lime-500'; // Lighter green
    if (progress > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const statusColors = {
    'PENDING_APPROVAL': 'bg-yellow-200 text-yellow-800',
    'ASSIGNED': 'bg-blue-200 text-blue-800',
    'IN_PROGRESS': 'bg-purple-200 text-purple-800',
    'COMPLETED': 'bg-green-200 text-green-800',
    'REJECTED': 'bg-red-200 text-red-800',
    'OVERDUE': 'bg-red-300 text-red-900 font-bold',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-4 border border-gray-200">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{task.title}</h3>
      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      {showProject && <p className="text-gray-700 text-sm mb-1">
        <strong className="font-medium">Project:</strong> {task.project?.name}
      </p>}
      <p className="text-gray-700 text-sm mb-1">
        <strong className="font-medium">Assigned To:</strong> {task.assignedTo?.name || 'N/A'}
      </p>
      <p className="text-gray-700 text-sm mb-1">
        <strong className="font-medium">Due Date:</strong> {task.dueDate}
      </p>
      <p className="text-gray-700 text-sm mb-1">
        <strong className="font-medium">Priority:</strong> {task.priority}
      </p>
      <p className="text-gray-700 text-sm mb-3">
        <strong className="font-medium">Status:</strong>{' '}
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[task.status] || 'bg-gray-200 text-gray-800'}`}>
          {task.status.replace(/_/g, ' ')}
        </span>
      </p>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
        <div
          className={`h-2.5 rounded-full text-xs font-medium text-white text-center p-0.5 leading-none ${getProgressBarColor(task.progressPercentage)}`}
          style={{ width: `${task.progressPercentage}%` }}
        >
          {task.progressPercentage}%
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {showActions && (
          <>
            {/* You'd likely have a dedicated TaskDetail page for "View Progress History" */}
            <Link to={`/tasks/${task.id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-md text-sm shadow-sm transition duration-200">
              View Details
            </Link>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded-md text-sm shadow-sm transition duration-200">
              Edit
            </button> {/* Manager only */}
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm shadow-sm transition duration-200">
              Delete
            </button> {/* Manager only */}
          </>
        )}

        {showProgressUpdateBtn && (
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-md text-sm shadow-sm transition duration-200"
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