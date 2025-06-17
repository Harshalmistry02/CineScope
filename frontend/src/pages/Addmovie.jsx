import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const genres = [
  "All", "Action", "Adventure", "Animation", "Comedy",
  "Drama", "Family", "History", "Romance", "Sci-Fi",
  "Sport", "Other"
];

const availabilityOptions = ["","In Theatres","Prime","Netflix","Jio Hotstar","Apple TV","Other Platform", "Online", "Coming Soon"];

const Addmovie = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    poster: null,
    genre: "",
    duration: "",
    language: "",
    availability: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, poster: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await axios.post(
        "http://localhost:5000/api/v1/movies/createMovie",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Movie added successfully!");
      navigate("/Home");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to add movie";
      alert(message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#EDE0D4] flex items-center justify-center py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-white/70 rounded-2xl shadow-2xl p-8 md:p-10 space-y-6 border border-[#DDB892]"
        >
          <h2 className="text-3xl font-bold text-[#7F5539] mb-4">Add New Movie</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#7F5539] font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[#DDB892] bg-[#E6CCB2]/40 focus:ring-2 focus:ring-[#B08968] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-[#7F5539] font-medium mb-2">Genre</label>
              <select
                name="genre"
                value={form.genre}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[#DDB892] bg-[#E6CCB2]/40 focus:ring-2 focus:ring-[#B08968] focus:border-transparent"
                required
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#7F5539] font-medium mb-2">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[#DDB892] bg-[#E6CCB2]/40 focus:ring-2 focus:ring-[#B08968] focus:border-transparent"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-[#7F5539] font-medium mb-2">Language</label>
              <input
                type="text"
                name="language"
                value={form.language}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[#DDB892] bg-[#E6CCB2]/40 focus:ring-2 focus:ring-[#B08968] focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#7F5539] font-medium mb-2">Availability</label>
              <select
                name="availability"
                value={form.availability}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[#DDB892] bg-[#E6CCB2]/40 focus:ring-2 focus:ring-[#B08968] focus:border-transparent"
                required
              >
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#7F5539] font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-[#DDB892] bg-[#E6CCB2]/40 focus:ring-2 focus:ring-[#B08968] focus:border-transparent resize-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#7F5539] font-medium mb-2">Upload Poster</label>
              <input
                type="file"
                name="poster"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 rounded-lg border border-[#DDB892] bg-[#E6CCB2]/40 focus:ring-2 focus:ring-[#B08968] focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-[#B08968] to-[#9C6644] text-white font-semibold py-3 rounded-xl hover:from-[#9C6644] hover:to-[#7F5539] transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus"></i>
            Add Movie
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Addmovie;
