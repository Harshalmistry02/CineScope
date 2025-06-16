import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    duration: "",
    language: "",
    availability: ""
  });
  const [posterFile, setPosterFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  const genres = [
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
    "Other"
  ];

  const availabilityOptions = [
    "In Theaters",
    "Streaming",
    "Digital Rental",
    "DVD/Blu-ray",
    "Coming Soon",
    "Not Available"
  ];

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/v1/movies/getMovieById/${id}`);
        const movieData = response.data.data;
        setMovie(movieData);
        setFormData({
          title: movieData.title,
          description: movieData.description,
          genre: movieData.genre,
          duration: movieData.duration,
          language: movieData.language,
          availability: movieData.availability
        });
      } catch (err) {
        console.error("Error fetching movie:", err);
        setError("Failed to load movie details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setPosterFile(e.target.files[0]);
  };

  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const updateData = new FormData();
      updateData.append("title", formData.title);
      updateData.append("description", formData.description);
      updateData.append("genre", formData.genre);
      updateData.append("duration", formData.duration);
      updateData.append("language", formData.language);
      updateData.append("availability", formData.availability);
      
      if (posterFile) {
        updateData.append("poster", posterFile);
      }

      const response = await axios.put(
        `http://localhost:5000/api/v1/movies/updateMovie/${id}`,
        updateData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMovie(response.data.data);
      setIsEditing(false);
      setPosterFile(null);
      alert("Movie updated successfully!");
    } catch (err) {
      console.error("Error updating movie:", err);
      alert("Failed to update movie. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleReviewClick = () => {
    navigate('/review', {
      state: {
        movieId: movie._id,
        movieTitle: movie.title
      }
    });
  };

  const handleDeleteMovie = async () => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await axios.delete(`http://localhost:5000/api/v1/movies/deleteMovie/${id}`);
        alert("Movie deleted successfully!");
        navigate("/");
      } catch (err) {
        console.error("Error deleting movie:", err);
        alert("Failed to delete movie. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#D4A373] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#7F5539] mx-auto mb-4"></div>
            <p className="text-[#7F5539] font-medium">Loading movie details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#D4A373] flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
            <p className="text-red-500 font-medium">{error}</p>
            <Link 
              to="/" 
              className="mt-4 inline-block bg-[#7F5539] text-white px-6 py-2 rounded-lg hover:bg-[#9C6644] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#D4A373] py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[#7F5539] hover:text-[#9C6644] font-medium mb-6 transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Movies
          </Link>

          {/* Movie Detail Card */}
          <div className="bg-gradient-to-br from-[#EDE0D4] to-[#E6CCB2] rounded-3xl shadow-2xl overflow-hidden border border-[#DDB892]/30">
            <div className="lg:flex">
              {/* Movie Poster */}
              <div className="lg:w-1/3 relative">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-96 lg:h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[#7F5539] text-[#EDE0D4] text-sm font-semibold rounded-full">
                    {movie.genre}
                  </span>
                </div>
              </div>

              {/* Movie Info */}
              <div className="lg:w-2/3 p-8">
                {!isEditing ? (
                  /* View Mode */
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <h1 className="text-4xl font-bold text-[#7F5539] leading-tight">
                        {movie.title}
                      </h1>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-[#B08968] text-white px-4 py-2 rounded-lg hover:bg-[#9C6644] transition-colors flex items-center gap-2"
                        >
                          <i className="fas fa-edit"></i>
                          Edit
                        </button>
                        <button
                          onClick={handleDeleteMovie}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                          <i className="fas fa-trash"></i>
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-[#DDB892]/40 p-3 rounded-lg text-center">
                        <i className="fas fa-clock text-[#7F5539] mb-1"></i>
                        <p className="text-sm font-medium text-[#7F5539]">{movie.duration} min</p>
                      </div>
                      <div className="bg-[#DDB892]/40 p-3 rounded-lg text-center">
                        <i className="fas fa-language text-[#7F5539] mb-1"></i>
                        <p className="text-sm font-medium text-[#7F5539]">{movie.language}</p>
                      </div>
                      <div className="bg-[#DDB892]/40 p-3 rounded-lg text-center col-span-2">
                        <i className="fas fa-tv text-[#7F5539] mb-1"></i>
                        <p className="text-sm font-medium text-[#7F5539]">{movie.availability}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-[#7F5539] mb-3">Description</h3>
                      <p className="text-[#9C6644] leading-relaxed">
                        {movie.description}
                      </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleReviewClick}
                        className="flex-1 bg-gradient-to-r from-[#B08968] to-[#9C6644] text-white font-semibold py-3 px-6 rounded-xl hover:from-[#9C6644] hover:to-[#7F5539] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-pen-to-square"></i>
                        Write Review
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Edit Mode */
                  <form onSubmit={handleUpdateMovie} className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-[#7F5539]">Edit Movie</h2>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="text-[#7F5539] hover:text-[#9C6644] transition-colors"
                      >
                        <i className="fas fa-times text-2xl"></i>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[#7F5539] font-medium mb-2">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-[#DDB892] focus:ring-2 focus:ring-[#B08968] focus:border-transparent bg-white/50"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#7F5539] font-medium mb-2">Genre</label>
                        <select
                          name="genre"
                          value={formData.genre}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-[#DDB892] focus:ring-2 focus:ring-[#B08968] focus:border-transparent bg-white/50"
                          required
                        >
                          {genres.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#7F5539] font-medium mb-2">Duration (minutes)</label>
                        <input
                          type="number"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-[#DDB892] focus:ring-2 focus:ring-[#B08968] focus:border-transparent bg-white/50"
                          required
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="block text-[#7F5539] font-medium mb-2">Language</label>
                        <input
                          type="text"
                          name="language"
                          value={formData.language}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-[#DDB892] focus:ring-2 focus:ring-[#B08968] focus:border-transparent bg-white/50"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[#7F5539] font-medium mb-2">Availability</label>
                        <select
                          name="availability"
                          value={formData.availability}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-[#DDB892] focus:ring-2 focus:ring-[#B08968] focus:border-transparent bg-white/50"
                          required
                        >
                          {availabilityOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[#7F5539] font-medium mb-2">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows="4"
                          className="w-full px-4 py-3 rounded-lg border border-[#DDB892] focus:ring-2 focus:ring-[#B08968] focus:border-transparent bg-white/50 resize-none"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[#7F5539] font-medium mb-2">Update Poster (optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full px-4 py-3 rounded-lg border border-[#DDB892] focus:ring-2 focus:ring-[#B08968] focus:border-transparent bg-white/50"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={updating}
                        className="flex-1 bg-gradient-to-r from-[#B08968] to-[#9C6644] text-white font-semibold py-3 px-6 rounded-xl hover:from-[#9C6644] hover:to-[#7F5539] transition-all duration-300 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {updating ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save"></i>
                            Update Movie
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 border border-[#7F5539] text-[#7F5539] rounded-xl hover:bg-[#7F5539] hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MovieDetail;