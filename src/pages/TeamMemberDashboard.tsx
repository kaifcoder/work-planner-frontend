/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { apiService } from '../api/apiService';
import TaskCard from '../components/common/TaskCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Navbar from '../components/common/Navbar';
import Modal from '../components/common/Modal';
import TaskProgressForm from '../components/forms/TaskProgressForm';
import SuggestTaskForm from '../components/forms/SuggestTaskForm';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface User { id: string; name: string; username: string; }
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showSuggestTaskModal, setShowSuggestTaskModal] = useState(false);
  const [, setSelectedProjectId] = useState<string | null>(null);
  const [projectOptions, setProjectOptions] = useState<{ id: string; name: string }[]>([]);
  const [filterProjectId, setFilterProjectId] = useState<string>('');
  const [filterDueDate, setFilterDueDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const filters: any = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterProjectId) filters.projectId = filterProjectId;
      const data = await apiService.getMemberReport(filters);
      setTasks(
        data.map((taskDto: any) => ({
          id: String(taskDto.id),
          title: taskDto.title,
          description: taskDto.description,
          dueDate: typeof taskDto.dueDate === 'string' ? taskDto.dueDate : String(taskDto.dueDate),
          status: taskDto.status,
          project: taskDto.project
            ? { id: String(taskDto.project.id), name: taskDto.project.name }
            : undefined,
          assignedToId: taskDto.assignedToUser ? String(taskDto.assignedToUser.id) : undefined,
          assignedToUser: taskDto.assignedToUser
            ? { id: String(taskDto.assignedToUser.id), name: taskDto.assignedToUser.username, username: taskDto.assignedToUser.username }
            : undefined,
        }))
      );
    } catch {
      setError('Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterProjectId]);

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const allProjects = await apiService.getAllProjects();
        // Map to { id, name } for dropdown
        setProjectOptions(allProjects.map((p: any) => ({ id: String(p.id), name: p.name })));
      } catch {
        // fallback: keep current projectOptions
      }
    };
    fetchAllProjects();
  }, []);

  useEffect(() => {
    let result = tasks;
    if (filterDueDate) {
      // Only show tasks where dueDate is on or after the selected date
      result = result.filter(t => {
        if (!t.dueDate) return false;
        // Compare as yyyy-mm-dd
        return t.dueDate >= filterDueDate;
      });
    }
    setFilteredTasks(result);
  }, [tasks, filterDueDate]);

  const handleProgressUpdate = (task: Task) => {
    setSelectedTask(task);
    setShowProgressModal(true);
  };

  const handleProgressSave = async (progress: { status: string }) => {
    if (!selectedTask) return;
    await apiService.updateTask(Number(selectedTask.id), {
      status: progress.status
    });
    setShowProgressModal(false);
    setSelectedTask(null);
    fetchTasks();
  };

  const handleProgressModalClose = () => {
    setShowProgressModal(false);
    setSelectedTask(null);
    fetchTasks();
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    doc.text('Task Report', 14, 16);
    const tableColumn = ['Title', 'Description', 'Due Date', 'Status', 'Project'];
    const tableRows = filteredTasks.map(task => [
      task.title,
      task.description,
      task.dueDate,
      task.status,
      task.project?.name || ''
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 22 });
    doc.save('task_report.pdf');
  };

  return (
    <>
      <Navbar />
      <div className="p-8 w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0 whitespace-nowrap">Your Tasks</h1>
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
            {projectOptions.length > 0 && (
              <div>
                <label htmlFor="filter-project" className="sr-only">Filter by project</label>
                <select
                  id="filter-project"
                  value={filterProjectId}
                  onChange={e => setFilterProjectId(e.target.value)}
                  className="py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 min-w-[150px]"
                  aria-label="Filter by project"
                >
                  <option value="">All Projects</option>
                  {projectOptions.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label htmlFor="filter-status" className="sr-only">Filter by status</label>
              <select
                id="filter-status"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 min-w-[150px]"
                aria-label="Filter by status"
              >
                <option value="">All Statuses</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>
            <div>
              <label htmlFor="filter-due-date" className="sr-only">Filter by due date</label>
              <input
                id="filter-due-date"
                type="date"
                value={filterDueDate}
                onChange={e => setFilterDueDate(e.target.value)}
                className="py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 min-w-[150px]"
                aria-label="Filter by due date"
              />
            </div>
            <div>
              <button
                type="button"
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-[100px]"
                onClick={() => {
                  setFilterProjectId('');
                  setFilterDueDate('');
                  setFilterStatus('');
                }}
              >
                Reset Filters
              </button>
            </div>
            <div>
              <button
                type="button"
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-[120px]"
                onClick={handleGenerateReport}
              >
                Generate Report
              </button>
            </div>
            <div>
              <button
                className="py-2 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50 min-w-[120px]"
                onClick={() => {
                  if (projectOptions.length === 0) {
                    alert('No project found to suggest a task for.');
                  } else if (projectOptions.length === 1) {
                    setSelectedProjectId(projectOptions[0].id);
                    setShowSuggestTaskModal(true);
                  } else {
                    setShowSuggestTaskModal(true);
                  }
                }}
              >
                Suggest Task
              </button>
            </div>
          </div>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-gray-500 text-center">No tasks assigned to you yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
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
            <TaskProgressForm
              taskId={selectedTask.id}
              currentStatus={selectedTask.status}
              onSave={handleProgressSave}
              onClose={handleProgressModalClose}
            />
          </Modal>
        )}
        {showSuggestTaskModal && (
          <Modal onClose={() => setShowSuggestTaskModal(false)} title="Suggest a Task">
            <SuggestTaskForm
              projectId={projectOptions.length === 1 ? projectOptions[0].id : undefined}
              onSaveSuccess={() => {
                setShowSuggestTaskModal(false);
                fetchTasks();
              }}
            />
          </Modal>
        )}
      </div>
    </>
  );
}
