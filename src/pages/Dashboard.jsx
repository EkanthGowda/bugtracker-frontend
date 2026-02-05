import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../api/axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, inProgress: 0, done: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await api.get("/auth/me");
      setUser(userRes.data);

      const projectRes = await api.get("/projects");
      setProjects(projectRes.data);

      // Fetch issues from first project
      if (projectRes.data.length > 0) {
        const issuesRes = await api.get(`/issues/project/${projectRes.data[0].id}`);
        setRecentIssues(issuesRes.data.slice(0, 5));

        // Calculate stats
        const total = issuesRes.data.length;
        const inProgress = issuesRes.data.filter(i => i.status === "IN_PROGRESS").length;
        const done = issuesRes.data.filter(i => i.status === "DONE").length;
        setStats({ total, inProgress, done });
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">Here's your team's activity overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Issues"
            value={stats.total}
            color="blue"
            icon="📋"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            color="yellow"
            icon="⚙️"
          />
          <StatCard
            label="Completed"
            value={stats.done}
            color="green"
            icon="✅"
          />
          <StatCard
            label="Team Members"
            value={projects.length > 0 ? "5" : "0"}
            color="purple"
            icon="👥"
          />
        </div>

        {/* Projects & Recent Issues */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Projects</h2>
                <button
                  onClick={() => navigate("/projects")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                >
                  View All →
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No projects yet</p>
                  <button
                    onClick={() => navigate("/projects")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Create Project
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition cursor-pointer"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <h3 className="font-semibold text-gray-900">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {project.description || "No description"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Issues */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Issues</h2>
                <button
                  onClick={() => navigate("/kanban")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                >
                  View Board →
                </button>
              </div>

              {recentIssues.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No issues yet</p>
                  <button
                    onClick={() => navigate("/kanban")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Create Issue
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton
              label="Create Issue"
              icon="➕"
              onClick={() => navigate("/kanban")}
            />
            <ActionButton
              label="Start Project"
              icon="🚀"
              onClick={() => navigate("/projects")}
            />
            <ActionButton
              label="Manage Team"
              icon="👥"
              onClick={() => navigate("/settings")}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({ label, value, color, icon }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className={`${colors[color]} rounded-lg p-6 shadow-sm border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}

function IssueCard({ issue }) {
  const statusColors = {
    TODO: "bg-gray-100 text-gray-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    DONE: "bg-green-100 text-green-700",
  };

  const priorityColors = {
    LOW: "text-blue-600",
    MEDIUM: "text-yellow-600",
    HIGH: "text-red-600",
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{issue.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{issue.description}</p>
          <div className="flex gap-2 mt-3">
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[issue.status]}`}>
              {issue.status.replace("_", " ")}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[issue.priority]}`}>
              {issue.priority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition text-left"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p className="font-semibold">{label}</p>
    </button>
  );
}
