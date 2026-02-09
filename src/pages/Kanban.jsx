import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Comments from "../components/Comments";
import CreateIssueModal from "../components/CreateIssueModal";
import DraggableCard from "../components/DraggableCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

const STATUSES = [
  { key: "TODO", label: "To Do" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "DONE", label: "Done" },
];

export default function Kanban() {
  const [issues, setIssues] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState("");
  const { projectId: projectIdParam } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (projectIdParam) {
      const parsedId = Number(projectIdParam);
      setProjectId(Number.isNaN(parsedId) ? null : parsedId);
      setProjectName("");
    } else {
      setProjectId(null);
      setProjectName("");
    }
  }, [projectIdParam]);

  useEffect(() => {
    if (!projectIdParam) {
      fetchDefaultProject();
    }
  }, [projectIdParam]);

  useEffect(() => {
    if (!projectId) {
      setIssues([]);
      setLoading(false);
      return;
    import { useEffect, useState } from "react";
    import { useNavigate, useParams } from "react-router-dom";
    import api from "../api/axios";
    import CreateIssueModal from "../components/CreateIssueModal";
    import DraggableCard from "../components/DraggableCard";
    import Header from "../components/Header";
    import Footer from "../components/Footer";

    const STATUSES = [
      { key: "TODO", label: "To Do" },
      { key: "IN_PROGRESS", label: "In Progress" },
      { key: "DONE", label: "Done" },
    ];

    export default function Kanban() {
      const [issues, setIssues] = useState([]);
      const [isDragging, setIsDragging] = useState(false);
      const [loading, setLoading] = useState(true);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [statusFilter, setStatusFilter] = useState("");
      const [priorityFilter, setPriorityFilter] = useState("");
      const [search, setSearch] = useState("");
      const [user, setUser] = useState(null);
      const [projectId, setProjectId] = useState(null);
      const [projectName, setProjectName] = useState("");
      const { projectId: projectIdParam } = useParams();
      const navigate = useNavigate();

      useEffect(() => {
        fetchUser();
      }, []);

      useEffect(() => {
        if (projectIdParam) {
          const parsedId = Number(projectIdParam);
          setProjectId(Number.isNaN(parsedId) ? null : parsedId);
          setProjectName("");
        } else {
          setProjectId(null);
          setProjectName("");
        }
      }, [projectIdParam]);

      useEffect(() => {
        if (!projectIdParam) {
          fetchDefaultProject();
        }
      }, [projectIdParam]);

      useEffect(() => {
        if (!projectId) {
          setIssues([]);
          setLoading(false);
          return;
        }

        fetchIssues();
      }, [projectId, statusFilter, priorityFilter, search]);

      const fetchUser = async () => {
        try {
          const res = await api.get("/auth/me");
          setUser(res.data);
        } catch (err) {
          console.error("Failed to fetch user", err);
        }
      };

      const fetchIssues = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/issues/project/${projectId}`);
          console.log("Issues fetched:", res.data);

          let data = res.data;

          if (statusFilter) {
            data = data.filter((i) => i.status === statusFilter);
          }

          if (priorityFilter) {
            data = data.filter((i) => i.priority === priorityFilter);
          }

          if (search) {
            data = data.filter((i) =>
              i.title.toLowerCase().includes(search.toLowerCase())
            );
          }

          setIssues(data);
        } catch (err) {
          console.error("Failed to fetch issues", err);
        } finally {
          setLoading(false);
        }
      };

      const fetchDefaultProject = async () => {
        setLoading(true);
        try {
          const res = await api.get("/projects");
          if (res.data.length > 0) {
            setProjectId(res.data[0].id);
            setProjectName(res.data[0].name || "");
          }
        } catch (err) {
          console.error("Failed to fetch projects", err);
        } finally {
          setLoading(false);
        }
      };

      const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      };

      const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        const issueId = parseInt(e.dataTransfer.getData("issueId"), 10);
        const currentStatus = e.dataTransfer.getData("currentStatus");

        if (currentStatus === newStatus) {
          setIsDragging(false);
          return;
        }

        setIssues((prev) =>
          prev.map((i) =>
            i.id === issueId ? { ...i, status: newStatus } : i
          )
        );

        setIsDragging(false);

        try {
          await api.put(
            `/issues/${issueId}/status`,
            null,
            { params: { status: newStatus } }
          );
          console.log(`Issue ${issueId} moved to ${newStatus}`);
        } catch (err) {
          console.error("Failed to update status", err);
          fetchIssues();
        }
      };

      return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header user={user} />

          <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Kanban Board
              </h1>
              <p className="text-gray-600">Manage your issues with drag and drop</p>
              {projectName && (
                <p className="text-sm text-gray-500 mt-1">Project: {projectName}</p>
              )}
            </div>

            {!projectId && !loading ? (
              <div className="bg-white p-12 rounded-lg shadow-md text-center">
                <p className="text-gray-600 text-lg mb-4">
                  No project selected
                </p>
                <button
                  onClick={() => navigate("/projects")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Go to Projects
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-4 mb-6">
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="">All Priority</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Search by title..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold whitespace-nowrap"
                  >
                    ➕ Create Issue
                  </button>
                </div>

                <CreateIssueModal
                  projectId={projectId}
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onIssueCreated={fetchIssues}
                />

                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : issues.length === 0 ? (
                  <div className="bg-white p-12 rounded-lg shadow-md text-center">
                    <p className="text-gray-600 text-lg mb-4">No issues yet</p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      Create Your First Issue
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {STATUSES.map((col) => (
                      <div
                        key={col.key}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, col.key)}
                        className={`bg-gray-100 p-4 rounded-lg min-h-[600px] border-2 transition-all ${
                          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="font-bold text-lg text-gray-800">
                            {col.label}
                          </h2>
                          <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {issues.filter((issue) => issue.status === col.key).length}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {issues
                            .filter((issue) => issue.status === col.key)
                            .map((issue) => (
                              <DraggableCard
                                key={issue.id}
                                issue={issue}
                                onDragStart={() => setIsDragging(true)}
                                onRefresh={fetchIssues}
                              />
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>

          <Footer />
        </div>
      );
    }