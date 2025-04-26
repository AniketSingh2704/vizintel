import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import AdminNavbar from "./AdminNavbar";

const clientId = "707979060917-pvhb5npqbqed3c7vsqg530n2hbls1qik.apps.googleusercontent.com";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const response = await axios.post("http://localhost:5000/api/auth/superadminlogin", { email, password });
      setMessage("Login successful");
      const adminData = {
        email,
        token: response.data.authToken,
        name: response.data.name,
        identity: response.data.identity || 1,
      };
      dispatch(loginSuccess(adminData));
      document.cookie = `authToken=${adminData.token}; path=/; max-age=604800; Secure`;
      setTimeout(() => navigate("/AdminDashboard", { replace: true }), 500);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (data) => {
    setIsLoading(true);
    setMessage("");
    const { credential } = data;
    try {
      const response = await axios.post("http://localhost:5000/adminAuth/google", { token: credential });
      setMessage("Login successful");
      const adminData = {
        email: response.data.email,
        token: response.data.authToken,
        name: response.data.name,
        identity: response.data.identity || 1,
      };
      dispatch(loginSuccess(adminData));
      document.cookie = `authToken=${adminData.token}; path=/; max-age=604800; Secure`;
      setTimeout(() => navigate("/AdminDashboard", { replace: true }), 500);
    } catch (error) {
      setMessage("Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <AdminNavbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <motion.div
          className="w-full max-w-md p-8 rounded-xl shadow-2xl border border-gray-600 bg-gray-900"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-orange-500 mb-6">Admin Login</h2>

          {/* Message Display */}
          {message && (
            <motion.p
              className={`text-center p-2 rounded-lg ${message === "Login successful" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {message}
            </motion.p>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6 mt-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Email</label>
              <input
                type="email"
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:from-orange-600 hover:to-orange-700 transition duration-300 flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
                  </svg>
                ) : null}
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;