import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      setFormData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch profile", err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await api.put("/auth/profile", formData);
      setUser(res.data);
      setEditing(false);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to update profile");
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

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Profile Header */}
          <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-200">
            <img
              src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-blue-600"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600 mt-1">{user?.email}</p>
              <div className="mt-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {message && (
            <div className={`mb-4 p-4 rounded-lg ${message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}

          {/* Profile Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{user?.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <p className="text-gray-900">{user?.email}</p>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role
              </label>
              <p className="text-gray-900">{user?.role}</p>
              <p className="text-xs text-gray-500 mt-1">Contact admin to change role</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData(user);
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-gray-900 font-semibold">January 2024</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Login</p>
                <p className="text-gray-900 font-semibold">Today</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Issues Assigned</p>
                <p className="text-gray-900 font-semibold">5</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Projects</p>
                <p className="text-gray-900 font-semibold">3</p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-12 pt-8 border-t border-red-200 bg-red-50 p-6 rounded-lg">
            <h2 className="text-lg font-bold text-red-900 mb-4">Danger Zone</h2>
            <p className="text-red-800 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
              Delete Account
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
