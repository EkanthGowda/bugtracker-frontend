import { useState, useEffect } from "react";
import Comments from "./Comments";
import api from "../api/axios";

export default function DraggableCard({ issue, onDragStart, onRefresh }) {
  const [open, setOpen] = useState(false);
  const [showAssignees, setShowAssignees] = useState(false);
  const [assignees, setAssignees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showAssignees) {
      fetchAssignees();
    }
  }, [showAssignees]);

  const fetchAssignees = async () => {
    try {
      const res = await api.get("/auth/users");
      setAssignees(res.data);
    } catch (err) {
      console.error("Failed to fetch assignees", err);
    }
  };

  const handleAssign = async (userId) => {
    setLoading(true);
    try {
      await api.put(`/issues/${issue.id}/assign/${userId}`);
      setShowAssignees(false);
      onRefresh();
    } catch (err) {
      console.error("Failed to assign issue", err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: "bg-blue-100 text-blue-700",
      MEDIUM: "bg-yellow-100 text-yellow-700",
      HIGH: "bg-red-100 text-red-700",
    };
    return colors[priority] || "bg-gray-100 text-gray-700";
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        if (open || showAssignees) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("issueId", issue.id);
        e.dataTransfer.setData("currentStatus", issue.status);
        onDragStart();
      }}
      className={`rounded-lg shadow transition-all ${
        open ? "bg-white border-2 border-blue-500" : "bg-white hover:shadow-lg"
      }`}
    >
      <div onClick={() => setOpen(!open)} className="p-4 cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 flex-1">{issue.title}</h3>
          <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getPriorityColor(issue.priority)}`}>
            {issue.priority}
          </span>
        </div>

        {issue.description && (
          <p className="text-sm text-gray-600 mb-3">{issue.description}</p>
        )}

        {/* Assignee Section */}
        <div className="mb-3">
          {issue.assignee ? (
            <div className="flex items-center space-x-2">
              <img
                src={issue.assignee.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${issue.assignee.email}`}
                alt="Assignee"
                className="w-6 h-6 rounded-full"
                title={issue.assignee.name}
              />
              <span className="text-xs text-gray-600">{issue.assignee.name}</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">Unassigned</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAssignees(!showAssignees);
            }}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
          >
            👤 Assign
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
          >
            💬 Comment
          </button>
        </div>
      </div>

      {/* Assignee Dropdown */}
      {showAssignees && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <p className="text-xs font-semibold text-gray-600 mb-2">Assign to:</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {assignees.map((assignee) => (
              <button
                key={assignee.id}
                onClick={() => handleAssign(assignee.id)}
                disabled={loading}
                className="w-full flex items-center space-x-2 p-2 hover:bg-white rounded transition text-left text-sm"
              >
                <img
                  src={assignee.avatar}
                  alt={assignee.name}
                  className="w-6 h-6 rounded-full"
                />
                <span>{assignee.name}</span>
                {issue.assignee?.id === assignee.id && (
                  <span className="ml-auto text-green-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      {open && (
        <div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <Comments issueId={issue.id} />
        </div>
      )}
    </div>
  );
}
