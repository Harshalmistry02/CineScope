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

const sortOptions = [
  { value: "default", label: "Default Order" },
  { value: "a-z", label: "A to Z" },
  { value: "z-a", label: "Z to A" },
];

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
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

    // Apply genre filter
    if (selectedGenre !== "All") {
      tempMovies = tempMovies.filter((movie) =>
        movie.genre?.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      tempMovies = tempMovies.filter((movie) =>
        movie.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortOrder === "a-z") {
      tempMovies.sort((a, b) => {
        const titleA = a.title?.toLowerCase() || "";
        const titleB = b.title?.toLowerCase() || "";
        return titleA.localeCompare(titleB);
      });
    } else if (sortOrder === "z-a") {
      tempMovies.sort((a, b) => {
        const titleA = a.title?.toLowerCase() || "";
        const titleB = b.title?.toLowerCase() || "";
        return titleB.localeCompare(titleA);
      });
    }

    setFilteredMovies(tempMovies);
  }, [movies, selectedGenre, searchTerm, sortOrder]);

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const clearAllFilters = () => {
    setSelectedGenre("All");
    setSearchTerm("");
    setSortOrder("default");
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="p-6 bg-[#D4A373] min-h-screen">
        {/* Filter and Sort Controls */}
        <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Genre Filter */}
            <div className="flex items-center">
              <label htmlFor="genre" className="mr-2 font-medium text-[#9C6644]">
                Genre:
              </label>
              <select
                id="genre"
                value={selectedGenre}
                onChange={handleGenreChange}
                className="bg-[#E6CCB2] border border-[#B08968] text-[#7F5539] font-medium px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#DDB892] min-w-[120px]"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 font-medium text-[#9C6644]">
                Sort:
              </label>
              <select
                id="sort"
                value={sortOrder}
                onChange={handleSortChange}
                className="bg-[#E6CCB2] border border-[#B08968] text-[#7F5539] font-medium px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#DDB892] min-w-[140px]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-center gap-4">
            {(selectedGenre !== "All" || searchTerm.trim() !== "" || sortOrder !== "default") && (
              <button
                onClick={clearAllFilters}
                className="bg-[#B08968] hover:bg-[#9C6644] text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#DDB892]"
              >
                Clear All Filters
              </button>
            )}
            
            {/* Results Count */}
            <span className="text-[#7F5539] font-medium">
              {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-[#7F5539] text-lg">Loading movies...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-600 text-lg font-medium">{error}</p>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-center">
            <p className="text-[#7F5539] text-lg font-medium mb-4">
              No movies found for your selection.
            </p>
            <button
              onClick={clearAllFilters}
              className="bg-[#B08968] hover:bg-[#9C6644] text-white font-medium px-6 py-3 rounded-lg shadow-md transition-colors duration-200"
            >
              Show All Movies
            </button>
          </div>
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