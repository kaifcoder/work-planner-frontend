import { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import ProjectForm from "../components/forms/ProjectForm";
import Modal from "../components/common/Modal";
import { useNavigate } from "react-router-dom";
import { apiService } from "../api/apiService";

interface Project {
  id: string;
  name: string;
  description: string;
  endDate: string | null;
}

export default function ManagerDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userForm, setUserForm] = useState({ username: "", password: "" });
  const [userSuccess, setUserSuccess] = useState("");
  const [userError, setUserError] = useState("");
  const navigate = useNavigate();
  const { getAllProjects, deleteProject } = apiService;

  // Dummy fetch for projects (replace with real API)
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const projectsData = await getAllProjects();
      setProjects(projectsData);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectCreated = () => {
    setShowProjectModal(false);
  };

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError("");
    setUserSuccess("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userForm.username, password: userForm.password }),
      });
      if (!res.ok) throw new Error("Registration failed");
      setUserSuccess("Team member added successfully!");
      setUserForm({ username: "", password: "" });
    } catch (err) {
      let msg = "Registration failed";
      if (err instanceof Error) msg = err.message;
      setUserError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 min-h-screen mx-auto bg-slate-50">
        {/* welcome manager */}
        <h1 className="mb-6 text-3xl font-bold text-slate-800">Welcome, Manager!</h1>
        <div className="flex gap-4 mb-8">
          <button
            className="px-6 py-2 text-lg font-semibold text-white transition-colors bg-indigo-700 rounded-lg shadow hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onClick={() => setShowProjectModal(true)}
          >
            + Add Project
          </button>
          <button
            className="px-6 py-2 text-lg font-semibold text-white transition-colors rounded-lg shadow bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            onClick={() => setShowUserModal(true)}
          >
            + Add Team Member
          </button>
          <button
            className="px-6 py-2 text-lg font-semibold text-white transition-colors rounded-lg shadow bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => navigate('/manager/reports')}
          >
            View Task Report
          </button>
        </div>
        {/* Project Modal */}
        {showProjectModal && (
          <Modal onClose={() => setShowProjectModal(false)} title="Create Project">
            <ProjectForm onSaveSuccess={handleProjectCreated} />
          </Modal>
        )}
        {/* Add Team Member Modal */}
        {showUserModal && (
          <Modal onClose={() => setShowUserModal(false)} title="Add Team Member">
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={userForm.username}
                  onChange={handleUserInput}
                  className="w-full px-3 py-2 bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={userForm.password}
                  onChange={handleUserInput}
                  className="w-full px-3 py-2 bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                  placeholder="Enter password"
                />
              </div>
              {userError && <div className="text-red-500">{userError}</div>}
              {userSuccess && <div className="text-emerald-600">{userSuccess}</div>}
              <button
                type="submit"
                className="w-full py-2 font-semibold text-white transition-colors bg-indigo-700 rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Team Member"}
              </button>
            </form>
          </Modal>
        )}
        {/* Project List */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <div
              key={project.id}
              className="flex items-center justify-between p-6 transition bg-white border shadow-lg cursor-pointer rounded-xl hover:shadow-xl border-slate-200 group"
              onClick={() => navigate(`/manager/projects/${project.id}`)}
            >
              <div>
                <h3 className="mb-1 text-xl font-bold transition-colors text-slate-800 group-hover:text-indigo-700">{project.name}</h3>
                <p className="mb-1 text-slate-600">{project.description}</p>
                <p className="text-sm text-slate-500">Deadline: <span className="font-medium text-slate-700">{project.endDate || 'N/A'}</span></p>
              </div>
              <div className="flex items-center ml-4 gap-2">
                <button
                  className="text-red-500 hover:text-red-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
                  title="Delete Project"
                  onClick={e => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this project?')) {
                      deleteProject(project.id).then(fetchProjects);
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <span className="flex items-center ml-2 text-indigo-400 transition-colors group-hover:text-indigo-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
