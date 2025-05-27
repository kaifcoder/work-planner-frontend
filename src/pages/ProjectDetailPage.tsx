/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/ProjectDetailPage.js
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import TaskForm from '../components/forms/TaskForm';
import ProjectForm from '../components/forms/ProjectForm';
import TaskCard from '../components/common/TaskCard';
import Navbar from '../components/common/Navbar';
import NotFoundPages from './NotFoundPages';
import { apiService } from '../api/apiService';

interface Member { id: string; name: string; }
interface Project { id: string; name: string; description: string; endDate?: string; memberDtos: Member[]; startDate?: string; status?: string; assignedTeamMembers?: Member[]; }
interface Task { id: string; title: string; description: string; dueDate: string; status: string; createdDate?: string; project?: Project; assignedTo?: Member; }

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { getProjectById, getTasksForProject } = apiService;

  const fetchProjectData = async () => {
    setLoading(true);
    setError('');
    try {
      const projectData = await getProjectById(Number(id));
      setProject({
              ...projectData,
              id: String(projectData.id),
              endDate: projectData.endDate ? String(projectData.endDate) : '',
              memberDtos: projectData.memberDtos
                ? projectData.memberDtos.map((member: any) => ({
                    ...member,
                    id: String(member.id),
                  }))
                : [],
            });
      const tasksData = await getTasksForProject(projectData.id);
      setProjectTasks(
        tasksData.map((taskDto: any) => ({
          ...taskDto,
          id: String(taskDto.id),
          dueDate: String(taskDto.dueDate),
          status: taskDto.status,
          title: taskDto.title,
          description: taskDto.description,
          project: taskDto.project
            ? {
                ...taskDto.project,
                id: String(taskDto.project.id),
                memberDtos: taskDto.project.memberDtos
                  ? taskDto.project.memberDtos.map((member: any) => ({
                      ...member,
                      id: String(member.id),
                    }))
                  : [],
              }
            : undefined,
          assignedTo: taskDto.assignedToUser
            ? {
                ...taskDto.assignedToUser,
                id: String(taskDto.assignedToUser.id),
                name: taskDto.assignedToUser.username,
              }
            : undefined,
        }))
      );
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response === 'object' &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else {
        setError('Failed to fetch project details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await apiService.deleteTask(taskId);
      fetchProjectData();
    }
  };

  useEffect(() => {
    fetchProjectData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleTaskFormSuccess = () => {
    setShowCreateTaskModal(false);
    fetchProjectData();
  };

  const handleProjectFormSuccess = () => {
    setShowEditProjectModal(false);
    fetchProjectData();
  };

  if (loading) return <LoadingSpinner />;
  if (error) {
    if (error.toLowerCase().includes('not found')) {
      return <NotFoundPages />;
    }
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }
  if (!project) return <NotFoundPages />;

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 border-b pb-4">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-gray-900">{project.name}</h1>
            <p className="text-gray-700 mb-1 text-lg">
              <span className="font-semibold">Description:</span> {project.description}
            </p>
            <p className="text-gray-700 mb-1 text-lg">
              <span className="font-semibold">Deadline:</span> {project.endDate || <span className="italic text-gray-400">Ongoing</span>}
            </p>
          </div>
          <button
            className="bg-gray-700 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 mt-4 md:mt-0"
            onClick={() => setShowEditProjectModal(true)}
          >
            Edit Project Details
          </button>
        </div>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Tasks for this Project</h2>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-200"
              onClick={() => setShowCreateTaskModal(true)}
            >
              + Create New Task
            </button>
          </div>
          {projectTasks.length === 0 ? (
            <p className="text-gray-500 italic">No tasks found for this project.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {projectTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  showActions={true}
                  onEdit={() => setSelectedTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              ))}
            </div>
          )}
        </section>

        {showCreateTaskModal && (
          <Modal onClose={() => setShowCreateTaskModal(false)} title="Create New Task">
            <TaskForm onSaveSuccess={handleTaskFormSuccess} projectId={project.id} isManager={true} />
          </Modal>
        )}

        {selectedTask && (
          <Modal onClose={() => setSelectedTask(null)} title="Edit Task">
            <TaskForm
              onSaveSuccess={() => {
                setSelectedTask(null);
                fetchProjectData();
              }}
              projectId={project.id}
              isManager={true}
              task={{
                ...selectedTask,
                id: Number(selectedTask.id),
                createdDate: selectedTask.createdDate || '',
                assignedToUser: selectedTask.assignedTo
                  ? {
                      id: Number(selectedTask.assignedTo.id),
                      username: selectedTask.assignedTo.name || '',
                      role: '', // Set appropriately if available
                      projectIds: [],
                      assignedTaskIds: [],
                      suggestedTaskIds: [],
                    }
                  : null,
                suggestedByUser: (selectedTask as any).suggestedByUser || null,
                project: project
                  ? {
                      id: Number(project.id),
                      name: project.name,
                      description: project.description,
                      createdById: (project as any).createdById ?? 0,
                      endDate: project.endDate ?? null,
                      memberIds: (project as any).memberIds ?? [],
                      taskIds: (project as any).taskIds ?? [],
                      createdBy: (project as any).createdBy ?? {
                        id: 0,
                        username: '',
                        role: '',
                        projectIds: [],
                        assignedTaskIds: [],
                        suggestedTaskIds: [],
                      },
                      memberDtos: project.memberDtos
                        ? project.memberDtos.map((member: any) => ({
                            ...member,
                            id: Number(member.id),
                            username: member.name || '',
                            role: '',
                            projectIds: [],
                            assignedTaskIds: [],
                            suggestedTaskIds: [],
                          }))
                        : [],
                    }
                  : undefined,
                // Ensure all TaskDto fields are present
              }}
            />
          </Modal>
        )}

        {showEditProjectModal && (
          <Modal onClose={() => setShowEditProjectModal(false)} title="Edit Project">
            <ProjectForm
              project={{
                ...project,
                id: Number(project.id),
                createdById: (project as any).createdById ?? 0,
                memberIds: (project as any).memberIds ?? [],
                taskIds: (project as any).taskIds ?? [],
                createdBy: (project as any).createdBy ?? {
                  id: 0,
                  username: '',
                  role: '',
                  projectIds: [],
                  assignedTaskIds: [],
                  suggestedTaskIds: [],
                },
                memberDtos: project.memberDtos
                  ? project.memberDtos.map((member: any) => ({
                      ...member,
                      id: Number(member.id),
                      username: member.name || '',
                      role: '',
                      projectIds: [],
                      assignedTaskIds: [],
                      suggestedTaskIds: [],
                    }))
                  : [],
                endDate: project.endDate ?? null, // Ensure endDate is always present
              }}
              onSaveSuccess={handleProjectFormSuccess}
            />
          </Modal>
        )}
      </div>
    </>
  );
};

export default ProjectDetailPage;