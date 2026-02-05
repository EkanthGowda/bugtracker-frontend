import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Footer from "../components/Footer";

export default function Login() {
  const [email, setEmail] = useState("koushik@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Left side - Branding */}
        <div className="hidden md:flex flex-col justify-center items-start text-white">
          <h1 className="text-5xl font-bold mb-4">IssueTrack</h1>
          <p className="text-xl text-blue-100 mb-6">
            Modern issue tracking for teams
          </p>
          <ul className="space-y-3 text-blue-100">
            <li className="flex items-center">
              <span className="text-2xl mr-3">✓</span> Kanban Board
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-3">✓</span> Real-time Collaboration
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-3">✓</span> Team Management
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-3">✓</span> Advanced Filters
            </li>
          </ul>
        </div>

        {/* Right side - Login Form */}
        <div className="flex items-center">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600 mb-6">Login to your account</p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-gray-600">
              <p className="font-semibold">Demo credentials:</p>
              <p>Email: koushik@gmail.com</p>
              <p>Password: 123456</p>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
