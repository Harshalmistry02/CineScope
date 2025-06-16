import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:5000/api/v1/users/register", form);
      alert("Registered successfully. Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.response); // Debugging line
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 409 || message === "User already exists") {
        alert("User already exists, redirecting to login...");
        navigate("/login");
      } else {
        setError("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#D4A373]">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full p-10 rounded-2xl shadow-2xl backdrop-blur-sm border border-[#CCD5AE] border-opacity-60 bg-gradient-to-br from-[#E9EDC9] to-[#FEFAE0]"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-[#D4A373]">
            <i className="fas fa-video text-3xl text-white"></i>
          </div>
          <h2 className="text-3xl font-bold text-[#D4A373]">Join CineScope</h2>
        </div>

        <div className="space-y-4">
          {/* Username Field */}
          <div className="relative">
            <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              value={form.username}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-[#CCD5AE] focus:outline-none focus:ring-2 focus:ring-[#FAEDCD] transition-all"
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              value={form.email}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-[#CCD5AE] focus:outline-none focus:ring-2 focus:ring-[#FAEDCD] transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              onChange={handleChange}
              value={form.password}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-[#CCD5AE] focus:outline-none focus:ring-2 focus:ring-[#FAEDCD] transition-all"
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-100 border border-red-300 flex items-center space-x-2">
            <i className="fas fa-exclamation-triangle text-red-500"></i>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 py-3 rounded-lg font-semibold text-white bg-[#D4A373] hover:bg-[#FAEDCD] hover:text-[#D4A373] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center space-x-2"
        >
          <i className="fas fa-user-plus"></i>
          <span>Create Account</span>
        </button>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-[#D4A373]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium underline transition-colors text-[#D4A373] hover:text-[#FAEDCD] inline-flex items-center space-x-1"
            >
              <span>Sign In</span>
              <i className="fas fa-sign-in-alt text-xs ml-1"></i>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
