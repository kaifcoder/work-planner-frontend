/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from '../components/common/Navbar';
import { apiService } from '../api/apiService';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  project?: { id: string; name: string };
  assignedToUser?: { id: string; username: string };
  suggestedBy?: { id: string; name?: string; username?: string };
  suggestedByUser?: { id: string; username: string };
}

export default function Reports() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [projectOptions, setProjectOptions] = useState<{ id: string; name: string }[]>([]);
  const [filterProjectId, setFilterProjectId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDueDate, setFilterDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const filters: Record<string, string> = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterProjectId) filters.projectId = filterProjectId;
      const data = await apiService.getManagerReport(filters);
      setTasks(
        data.map((task: any) => ({
          ...task,
          id: String(task.id),
          project: task.project
            ? { ...task.project, id: String(task.project.id) }
            : undefined,
          assignedToUser: task.assignedToUser
            ? { ...task.assignedToUser, id: String(task.assignedToUser.id) }
            : undefined,
          suggestedBy: task.suggestedBy
            ? {
                ...task.suggestedBy,
                id: String(task.suggestedBy.id),
                name: task.suggestedBy.name,
                username: task.suggestedBy.username,
              }
            : undefined,
          suggestedByUser: task.suggestedByUser
            ? { ...task.suggestedByUser, id: String(task.suggestedByUser.id) }
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
        setProjectOptions(allProjects.map((p: { id: number; name: string }) => ({ id: String(p.id), name: p.name })));
      } catch {
        // fallback: keep current projectOptions
      }
    };
    fetchAllProjects();
  }, []);

  useEffect(() => {
    let result = tasks;
    if (filterDueDate) {
      result = result.filter(t => t.dueDate && t.dueDate >= filterDueDate);
    }
    setFilteredTasks(result);
  }, [tasks, filterDueDate]);

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    doc.text('Manager Task Report', 14, 16);
    const tableColumn = ['Title', 'Description', 'Due Date', 'Status', 'Project', 'Assigned To', 'Suggested By'];
    const tableRows = filteredTasks.map(task => [
      task.title,
      task.description,
      task.dueDate,
      task.status,
      task.project?.name || '-',
      task.assignedToUser?.username || '-',
      task.suggestedBy?.name || task.suggestedByUser?.username || '-'
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 22 });
    doc.save('manager_task_report.pdf');
  };

  return (
    <>
      <Navbar />
      <div className="p-8 w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0 whitespace-nowrap">Manager Task Report</h1>
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
          </div>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-gray-500 text-center">No tasks found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b text-left">Title</th>
                  <th className="px-4 py-2 border-b text-left">Description</th>
                  <th className="px-4 py-2 border-b text-left">Due Date</th>
                  <th className="px-4 py-2 border-b text-left">Status</th>
                  <th className="px-4 py-2 border-b text-left">Project</th>
                  <th className="px-4 py-2 border-b text-left">Assigned To</th>
                  <th className="px-4 py-2 border-b text-left">Suggested By</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{task.title}</td>
                    <td className="px-4 py-2 border-b">{task.description}</td>
                    <td className="px-4 py-2 border-b">{task.dueDate}</td>
                    <td className="px-4 py-2 border-b">{task.status}</td>
                    <td className="px-4 py-2 border-b">{task.project?.name || '-'}</td>
                    <td className="px-4 py-2 border-b">{task.assignedToUser?.username || '-'}</td>
                    <td className="px-4 py-2 border-b">{task.suggestedBy?.name || task.suggestedByUser?.username || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
