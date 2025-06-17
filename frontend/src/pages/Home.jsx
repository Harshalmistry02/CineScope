import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";

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

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/movies/all");
        const movieList = response.data.data || [];
        setMovies(movieList);
        setFilteredMovies(movieList);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to load movies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    let tempMovies = [...movies];

    if (selectedGenre !== "All") {
      tempMovies = tempMovies.filter((movie) =>
        movie.genre?.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    if (searchTerm.trim() !== "") {
      tempMovies = tempMovies.filter((movie) =>
        movie.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMovies(tempMovies);
  }, [movies, selectedGenre, searchTerm]);

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="p-6 bg-[#D4A373] min-h-screen">
        <div className="mb-6">
          <label htmlFor="genre" className="mr-2 font-medium text-[#9C6644]">
            Filter by Genre:
          </label>
          <select
            id="genre"
            value={selectedGenre}
            onChange={handleGenreChange}
            className="bg-[#E6CCB2] border border-[#B08968] text-[#7F5539] font-medium px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#DDB892]"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading movies...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredMovies.length === 0 ? (
          <p>No movies found for your selection.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Home;
