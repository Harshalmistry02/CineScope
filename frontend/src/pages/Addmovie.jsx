import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const genres = [
  "All",
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Drama",
  "Family",
  "History",
  "Romance",
  "Sci-Fi",
  "Sport",
  "Other",
];

const Addmovie = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    poster: null, // file
    genre: "",
    duration: "",
    language: "",
    availability: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setForm({ ...form, poster: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("genre", form.genre);
    formData.append("duration", form.duration);
    formData.append("language", form.language);
    formData.append("availability", form.availability);
    formData.append("poster", form.poster);

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
      const message = err.res?.data?.message || "Failed to add movie";
      alert(message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#D4A373]">
        <form
          onSubmit={handleSubmit}
          className="max-w-md w-full p-10 rounded-2xl shadow-2xl backdrop-blur-sm border border-[#CCD5AE] border-opacity-20 bg-gradient-to-br from-[#E9EDC9] to-[#FEFAE0]"
        >
          <div className="space-y-4">
            {/* Title */}
            <div className="relative mb-4">
              <i className="fa-solid fa-film absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"></i>
              <input
                onChange={handleChange}
                value={form.title}
                required
                type="text"
                name="title"
                placeholder="Movie title"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-[#CCD5AE] focus:outline-none focus:ring-2 focus:ring-[#FAEDCD] transition-all"
              />
            </div>

            {/* Description */}
            <div className="relative mb-4">
              <i className="fa-solid fa-quote-right absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"></i>
              <input
                onChange={handleChange}
                value={form.description}
                required
                type="text"
                name="description"
                placeholder="Movie description"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-[#CCD5AE] focus:outline-none focus:ring-2 focus:ring-[#FAEDCD] transition-all"
              />
            </div>

            {/* Poster */}
            <div className="relative mb-4">
              <i className="fa-solid fa-photo-film absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"></i>
              <input
                onChange={handleFileChange}
                required
                type="file"
                name="poster"
                accept="image/*"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-[#CCD5AE] focus:outline-none focus:ring-2 focus:ring-[#FAEDCD] transition-all"
              />
            </div>

            {/* Duration */}
            <div className="relative mb-4">
              <i className="fa-solid fa-clock absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"></i>
              <input
                onChange={handleChange}
                value={form.duration}
                required
                type="text"
                name="duration"
                placeholder="Movie duration (in minutes)"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-[#CCD5AE] focus:outline-none focus:ring-2 focus:ring-[#FAEDCD] transition-all"
              />
            </div>

            {/* Language */}
            <div className="relative mb-4">
              <i className="fa-solid fa-language absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"></i>
              <input
                onChange={handleChange}
                value={form.language}
                required
                type="text"
                name="language"
                placeholder="Movie language"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-[#CCD5AE] focus:outline-none focus:ring-2 focus:ring-[#FAEDCD] transition-all"
              />
            </div>

            {/* Availability */}
            <div className="relative mb-4">
              <i className="fa-solid fa-square-check absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"></i>
              <input
                onChange={handleChange}
                value={form.availability}
                required
                type="text"
                name="availability"
                placeholder="Movie availability"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-[#CCD5AE] focus:outline-none focus:ring-2 focus:ring-[#FAEDCD] transition-all"
              />
            </div>

            {/* Genre */}
            <div className="relative mb-4">
              <label
                htmlFor="genre"
                className="mr-2 font-medium text-[#9C6644]"
              >
                Genre:
              </label>
              <select
                id="genre"
                name="genre"
                onChange={handleChange}
                value={form.genre}
                required
                className="bg-[#E6CCB2] border border-[#B08968] text-[#7F5539] font-medium px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#DDB892]"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 rounded-lg font-semibold text-white bg-[#D4A373] hover:bg-[#FAEDCD] hover:text-[#D4A373] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 shadow-lg"
          >
            <i className="fa-solid fa-clapperboard"></i>
            <span>Add Movie</span>
          </button>
        </form>
      </div>
    </>
  );
};

export default Addmovie;
