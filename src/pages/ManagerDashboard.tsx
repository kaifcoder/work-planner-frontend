import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import ProjectForm from "../components/forms/ProjectForm";
import TaskForm from "../components/forms/TaskForm";
import TaskCard from "../components/common/TaskCard";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getProjectById, updateProject, createProject } from "../api/projects";
import { getTasks, createTask } from "../api/tasks";
import { getUsers } from "../api/users";

// Project and TeamMember types
interface TeamMember {
  id: string;
  name: string;
  email: string;
}
interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: string;
  assignedTeamMembers: TeamMember[];
}

export default function ManagerDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all projects
  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      // Use getProjectById as a stub for now, or replace with a static array
      // TODO: Replace with real getProjects API
      setProjects([]); // No real API, so just empty for now
    } catch {
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectCreated = () => {
    setShowProjectModal(false);
    fetchProjects();
  };

  const handleProjectEdited = () => {
    setShowEditProjectModal(false);
    fetchProjects();
  };

  const handleProjectDeleted = async (projectId: string) => {
    // TODO: Implement deleteProject API
    setProjects(projects.filter(p => p.id !== projectId));
  };

  return (
    <div>
      <Navbar />
      <div className="container p-6 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manager Dashboard</h1>
          <button
            className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md shadow-md hover:bg-green-700"
            onClick={() => setShowProjectModal(true)}
          >
            + New Project
          </button>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <div key={project.id} className="flex flex-col p-4 bg-white rounded-lg shadow">
                <h2 className="mb-2 text-xl font-semibold">{project.name}</h2>
                <p className="mb-2 text-gray-600">{project.description}</p>
                <div className="flex gap-2 mt-auto">
                  <button
                    className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    onClick={() => { setSelectedProject(project); setShowEditProjectModal(true); }}
                  >Edit</button>
                  <button
                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={() => handleProjectDeleted(project.id)}
                  >Delete</button>
                  <button
                    className="px-3 py-1 text-white bg-purple-500 rounded hover:bg-purple-600"
                    onClick={() => { setSelectedProject(project); setShowAssignModal(true); }}
                  >Assign Members</button>
                  <button
                    className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                    onClick={() => { setSelectedProject(project); setShowTaskModal(true); }}
                  >Tasks</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Project Create Modal */}
      {showProjectModal && (
        <Modal onClose={() => setShowProjectModal(false)} title="Create Project">
          <ProjectForm onSaveSuccess={handleProjectCreated} />
        </Modal>
      )}
      {/* Project Edit Modal */}
      {showEditProjectModal && selectedProject && (
        <Modal onClose={() => setShowEditProjectModal(false)} title="Edit Project">
          <ProjectForm project={selectedProject} onSaveSuccess={handleProjectEdited} />
        </Modal>
      )}
      {/* Assign Members Modal */}
      {showAssignModal && selectedProject && (
        <Modal onClose={() => setShowAssignModal(false)} title="Assign Team Members">
          {/* TODO: Implement assign members UI */}
          <div>Assign members UI goes here.</div>
        </Modal>
      )}
      {/* Task Modal */}
      {showTaskModal && selectedProject && (
        <Modal onClose={() => setShowTaskModal(false)} title={`Tasks for ${selectedProject.name}`}>
          {/* TODO: Implement task CRUD UI for selected project */}
          <div>Task CRUD UI goes here.</div>
        </Modal>
      )}
    </div>
  );
}
