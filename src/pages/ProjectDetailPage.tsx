// src/pages/ProjectDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById, updateProject } from '../api/projects';
import { getTasks, createTask } from '../api/tasks';
import { getUsers } from '../api/users';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import TaskForm from '../components/forms/TaskForm';
import ProjectForm from '../components/forms/ProjectForm';
import TaskCard from '../components/common/TaskCard';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAssignMembersModal, setShowAssignMembersModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState(new Set());

  const fetchProjectData = async () => {
    setLoading(true);
    setError('');
    try {
      const projectData = await getProjectById(id);
      setProject(projectData);
      setSelectedMembers(new Set(projectData.assignedTeamMembers.map(member => member.id)));

      const tasksData = await getTasks({ projectId: id });
      setProjectTasks(tasksData);

      const allTeamMembers = await getUsers('TEAM_MEMBER');
      setTeamMembers(allTeamMembers);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch project details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleAssignMembers = async () => {
    setLoading(true);
    setError('');
    try {
      const updatedProject = await updateProject(id, {
        ...project,
        // Ensure project details are up-to-date and pass original id
        id: project.id,
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        assignedTeamMemberIds: Array.from(selectedMembers)
      });
      setProject(updatedProject);
      setShowAssignMembersModal(false);
      alert('Team members assigned successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign team members.');
    } finally {
      setLoading(false);
    }
  };


  const handleTaskFormSuccess = () => {
    setShowCreateTaskModal(false);
    fetchProjectData();
  };

  const handleProjectFormSuccess = () => {
    setShowEditProjectModal(false);
    fetchProjectData();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!project) return <p className="text-gray-600 text-center text-lg mt-8">Project not found.</p>;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Project: {project.name}</h1>
      <p className="text-gray-700 mb-2">
        <strong className="font-semibold">Description:</strong> {project.description}
      </p>
      <p className="text-gray-700 mb-2">
        <strong className="font-semibold">Dates:</strong> {project.startDate} to {project.endDate || 'Ongoing'}
      </p>
      <p className="text-gray-700 mb-4">
        <strong className="font-semibold">Status:</strong>{' '}
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          project.status === 'COMPLETED' ? 'bg-green-200 text-green-800' :
          project.status === 'IN_PROGRESS' ? 'bg-blue-200 text-blue-800' :
          'bg-gray-200 text-gray-800'
        }`}>
          {project.status.replace(/_/g, ' ')}
        </span>
      </p>

      <button
        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md shadow-md mb-6 transition duration-200"
        onClick={() => setShowEditProjectModal(true)}
      >
        Edit Project Details
      </button>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">Assigned Team Members</h2>
        {project.assignedTeamMembers.length === 0 ? (
          <p className="text-gray-600">No team members assigned to this project yet.</p>
        ) : (
          <ul className="list-disc list-inside text-gray-700 pl-4">
            {project.assignedTeamMembers.map(member => (
              <li key={member.id}>{member.name} ({member.email})</li>
            ))}
          </ul>
        )}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md mt-4 transition duration-200"
          onClick={() => setShowAssignMembersModal(true)}
        >
          Assign Team Members
        </button>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">Tasks for this Project</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md mb-4 transition duration-200"
          onClick={() => setShowCreateTaskModal(true)}
        >
          Create New Task
        </button>
        {projectTasks.length === 0 ? (
          <p className="text-gray-600">No tasks found for this project.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectTasks.map(task => (
              <TaskCard key={task.id} task={task} showActions={true} />
            ))}
          </div>
        )}
      </section>

      {showAssignMembersModal && (
        <Modal onClose={() => setShowAssignMembersModal(false)} title="Assign Team Members">
          <div className="space-y-3">
            {teamMembers.length === 0 ? (
              <p className="text-gray-600">No team members available to assign.</p>
            ) : (
              teamMembers.map(member => (
                <div key={member.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`assign-member-${member.id}`}
                    checked={selectedMembers.has(member.id)}
                    onChange={(e) => {
                      const newSelection = new Set(selectedMembers);
                      if (e.target.checked) {
                        newSelection.add(member.id);
                      } else {
                        newSelection.delete(member.id);
                      }
                      setSelectedMembers(newSelection);
                    }}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`assign-member-${member.id}`} className="text-gray-700 font-medium">
                    {member.name} ({member.email})
                  </label>
                </div>
              ))
            )}
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md mt-4 w-full transition duration-200"
              onClick={handleAssignMembers}
            >
              Save Assignment
            </button>
          </div>
        </Modal>
      )}

      {showCreateTaskModal && (
        <Modal onClose={() => setShowCreateTaskModal(false)} title="Create New Task">
          <TaskForm onSaveSuccess={handleTaskFormSuccess} projectId={project.id} isManager={true} />
        </Modal>
      )}

      {showEditProjectModal && (
        <Modal onClose={() => setShowEditProjectModal(false)} title="Edit Project">
          <ProjectForm project={project} onSaveSuccess={handleProjectFormSuccess} />
        </Modal>
      )}
    </div>
  );
};

export default ProjectDetailPage;