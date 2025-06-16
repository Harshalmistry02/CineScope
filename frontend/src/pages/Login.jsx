import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { saveToken } from "../utils/auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/v1/users/login", form);
      saveToken(res.data.accessToken); // assuming your backend returns accessToken
      navigate("/Home");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      alert(message);
      if (message.toLowerCase().includes("not found")) navigate("/register");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#D4A373]">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full p-10 rounded-2xl shadow-2xl backdrop-blur-sm border border-[#CCD5AE] border-opacity-20 bg-gradient-to-br from-[#E9EDC9] to-[#FEFAE0]"
      >
        {/* Centered Icon and Heading */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 flex items-center justify-center rounded-full mb-4 bg-[#D4A373] mx-auto">
            <i className="fas fa-film text-3xl text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#D4A373]">CineScope Login</h2>
          <p className="mt-2 text-[#A68A64] text-sm">Your gateway to the world of movies</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {["email", "password"].map((field) => (
            <div className="relative" key={field}>
              <i
                className={`fas fa-${field === "email" ? "envelope" : "lock"} absolute left-3 top-1/2 -translate-y-1/2 text-gray-400`}
              />
              <input
                name={field}
                type={field}
                placeholder={`Enter your ${field}`}
                onChange={handleChange}
                value={form[field]}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-[#CCD5AE] focus:outline-none focus:ring-2 focus:ring-[#FAEDCD] transition-all"
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 py-3 rounded-lg font-semibold text-white bg-[#D4A373] hover:bg-[#FAEDCD] hover:text-[#D4A373] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 shadow-lg"
        >
          <i className="fas fa-play-circle" />
          <span>Start Watching</span>
        </button>

        {/* Register Link */}
        <div className="text-center mt-6 text-[#D4A373]">
          <p>
            New to CinemaHub?{" "}
            <Link
              to="/register"
              className="font-semibold underline inline-flex items-center space-x-1 hover:text-[#FAEDCD]"
            >
              <span>Join Now</span>
              <i className="fas fa-ticket-alt text-xs ml-1" />
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
