import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Comments({ issueId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [issueId]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/issues/${issueId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const addComment = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      await api.post(`/issues/${issueId}/comments`, {
        content: text,
      });

      setText("");
      fetchComments();
    } catch (err) {
      console.error("Failed to add comment", err);
      alert("Failed to add comment: " + err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-300">
      <h4 className="font-semibold mb-3 text-gray-700">Comments</h4>

      <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
        {comments.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No comments yet</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="bg-gray-50 p-2 rounded text-xs border border-gray-200"
            >
              <p className="text-gray-800">{c.content}</p>
              <span className="text-gray-500 text-xs">
                {c.user?.email || "Unknown"}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="border border-gray-300 p-2 flex-1 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") addComment();
          }}
        />
        <button
          onClick={addComment}
          disabled={loading}
          className="bg-blue-600 text-white px-3 rounded text-xs hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
