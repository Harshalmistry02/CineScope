import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Reviews = () => {
  const location = useLocation();
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // New state variables for movie search feature
  const [movieSearchTerm, setMovieSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [showMovieDropdown, setShowMovieDropdown] = useState(false);
  
  // Form state for creating new review
  const [newReview, setNewReview] = useState({
    email: "",
    movieId: "",
    rating: 5,
    comment: ""
  });

  // Check if we came from a MovieCard with preselected movie
  useEffect(() => {
    if (location.state?.movieId) {
      setNewReview(prev => ({ ...prev, movieId: location.state.movieId }));
      // Set the movie search term to the preselected movie title
      const preselectedMovie = movies.find(movie => movie._id === location.state.movieId);
      if (preselectedMovie) {
        setMovieSearchTerm(preselectedMovie.title);
      }
      setShowCreateForm(true);
    }
  }, [location.state, movies]);

  // Filter movies based on search term
  useEffect(() => {
    if (movieSearchTerm.trim() === "") {
      setFilteredMovies([]);
      setShowMovieDropdown(false);
    } else {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(movieSearchTerm.toLowerCase())
      );
      setFilteredMovies(filtered);
      setShowMovieDropdown(true);
    }
  }, [movieSearchTerm, movies]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all movies for dropdown
        const moviesResponse = await axios.get("http://localhost:5000/api/v1/movies/all");
        const moviesData = moviesResponse.data.data || [];
        setMovies(moviesData);

        // Create a movie lookup map for better performance
        const movieMap = {};
        moviesData.forEach(movie => {
          movieMap[movie._id] = movie;
        });

        // Fetch all reviews
        const reviewsData = [];
        for (const movie of moviesData) {
          try {
            const reviewResponse = await axios.get(`http://localhost:5000/api/v1/reviews/movie/${movie._id}`);
            const movieReviews = reviewResponse.data.data || [];
            // Add movie data to each review for easier display
            movieReviews.forEach(review => {
              review.movieData = movieMap[review.movieId] || { title: "Unknown Movie" };
            });
            reviewsData.push(...movieReviews);
          } catch {
            console.log(`No reviews found for movie ${movie.title}`);
          }
        }
        setReviews(reviewsData);
        setFilteredReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load reviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let tempReviews = [...reviews];

    // Movie Filter
    if (selectedMovie !== "All") {
      tempReviews = tempReviews.filter((review) => review.movieId === selectedMovie);
    }

    // Rating Filter
    if (selectedRating !== "All") {
      tempReviews = tempReviews.filter((review) => review.rating === parseInt(selectedRating));
    }

    // Search Filter
    if (searchTerm.trim() !== "") {
      tempReviews = tempReviews.filter((review) =>
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.movieData?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReviews(tempReviews);
  }, [reviews, selectedMovie, selectedRating, searchTerm]);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle movie selection from dropdown
  const handleMovieSelect = (movie) => {
    setNewReview({...newReview, movieId: movie._id});
    setMovieSearchTerm(movie.title);
    setShowMovieDropdown(false);
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(newReview.email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/v1/reviews/create", newReview);
      const newReviewData = response.data.data;
      // Add movie data to the new review
      const movie = movies.find(m => m._id === newReviewData.movieId);
      newReviewData.movieData = movie || { title: "Unknown Movie" };
      
      setReviews([newReviewData, ...reviews]);
      setNewReview({ email: "", movieId: "", rating: 5, comment: "" });
      setMovieSearchTerm("");
      setShowCreateForm(false);
      alert("Review created successfully!");
    } catch (error) {
      console.error("Error creating review:", error);
      alert(error.response?.data?.message || "Failed to create review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`http://localhost:5000/api/v1/reviews/${reviewId}`);
        setReviews(reviews.filter(review => review._id !== reviewId));
        alert("Review deleted successfully!");
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review");
      }
    }
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const maskEmail = (email) => {
    if (!email) return "Anonymous";
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart.substring(0, 3)}***@${domain}`;
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="p-6 bg-[#D4A373] min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#7F5539] mb-4">Movie Reviews</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-[#9C6644] hover:bg-[#7F5539] text-white font-medium px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
          >
            {showCreateForm ? "Cancel" : "Write a Review"}
          </button>
        </div>

        {/* Create Review Form - Enhanced UI with Search Feature */}
        {showCreateForm && (
          <div className="bg-gradient-to-br from-[#EDE0D4] to-[#E6CCB2] rounded-2xl p-6 mb-6 shadow-xl max-w-2xl mx-auto border border-[#DDB892]/40 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#9C6644] to-[#7F5539] rounded-full flex items-center justify-center">
                <i className="fas fa-pen-fancy text-[#EDE0D4] text-sm"></i>
              </div>
              <h2 className="text-xl font-bold text-[#7F5539]">Write a New Review</h2>
            </div>
            
            <form onSubmit={handleCreateReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#7F5539] font-semibold text-sm">
                    <i className="fas fa-envelope text-[#9C6644]"></i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newReview.email}
                    onChange={(e) => setNewReview({...newReview, email: e.target.value})}
                    className="w-full bg-white/80 border-2 border-[#DDB892] text-[#7F5539] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C6644] focus:border-[#9C6644] text-sm placeholder-[#B08968] transition-all duration-200"
                    placeholder="Enter your email address"
                    required
                  />
                  {newReview.email && !validateEmail(newReview.email) && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <i className="fas fa-exclamation-circle"></i>
                      Please enter a valid email address
                    </p>
                  )}
                </div>
                
                <div className="space-y-2 relative">
                  <label className="flex items-center gap-2 text-[#7F5539] font-semibold text-sm">
                    <i className="fas fa-film text-[#9C6644]"></i>
                    Search & Select Movie
                  </label>
                  <input
                    type="text"
                    value={movieSearchTerm}
                    onChange={(e) => {
                      setMovieSearchTerm(e.target.value);
                      if (e.target.value === "") {
                        setNewReview({...newReview, movieId: ""});
                      }
                    }}
                    onFocus={() => {
                      if (movieSearchTerm.trim() !== "") {
                        setShowMovieDropdown(true);
                      }
                    }}
                    className="w-full bg-white/80 border-2 border-[#DDB892] text-[#7F5539] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C6644] focus:border-[#9C6644] text-sm placeholder-[#B08968] transition-all duration-200"
                    placeholder="Type to search for a movie..."
                    required={!newReview.movieId}
                  />
                  
                  {/* Dropdown for filtered movies */}
                  {showMovieDropdown && filteredMovies.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border-2 border-[#DDB892] rounded-xl mt-1 max-h-48 overflow-y-auto shadow-lg">
                      {filteredMovies.map((movie) => (
                        <div
                          key={movie._id}
                          onClick={() => handleMovieSelect(movie)}
                          className="px-4 py-3 hover:bg-[#EDE0D4] cursor-pointer text-[#7F5539] text-sm border-b border-[#DDB892]/30 last:border-b-0 transition-colors duration-200"
                        >
                          {movie.title}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Show message when no movies found */}
                  {showMovieDropdown && movieSearchTerm.trim() !== "" && filteredMovies.length === 0 && (
                    <div className="absolute z-10 w-full bg-white border-2 border-[#DDB892] rounded-xl mt-1 px-4 py-3 text-[#B08968] text-sm shadow-lg">
                      No movies found matching "{movieSearchTerm}"
                    </div>
                  )}
                  
                  {/* Selected movie indicator */}
                  {newReview.movieId && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-[#9C6644] bg-[#DDB892]/40 px-2 py-1 rounded-full">
                        ✓ Selected
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#7F5539] font-semibold text-sm">
                  <i className="fas fa-star text-[#9C6644]"></i>
                  Rating & Your Review
                </label>
                <div className="flex gap-4">
                  <div className="min-w-fit">
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                      className="bg-gradient-to-r from-[#DDB892] to-[#B08968] border-2 border-[#9C6644] text-[#7F5539] font-semibold px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C6644] text-sm transition-all duration-200"
                    >
                      {[1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating} className="bg-[#EDE0D4] text-[#7F5539]">
                          {renderStars(rating)} ({rating})
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    rows="3"
                    className="flex-1 bg-white/80 border-2 border-[#DDB892] text-[#7F5539] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C6644] focus:border-[#9C6644] resize-none text-sm placeholder-[#B08968] transition-all duration-200"
                    placeholder="Share your honest thoughts about this movie... What did you love? What could be better?"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setMovieSearchTerm("");
                    setNewReview({ email: "", movieId: "", rating: 5, comment: "" });
                  }}
                  className="bg-gradient-to-r from-[#B08968] to-[#9C6644] hover:from-[#9C6644] hover:to-[#7F5539] text-[#EDE0D4] font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#9C6644] to-[#7F5539] hover:from-[#7F5539] hover:to-[#9C6644] text-[#EDE0D4] font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <i className="fas fa-paper-plane"></i>
                  Submit Review
                </button>
              </div>
            </form>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#DDB892] via-[#9C6644] to-[#7F5539] rounded-t-2xl"></div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label htmlFor="movie" className="mr-2 font-medium text-[#9C6644] text-sm">
              Filter by Movie:
            </label>
            <select
              id="movie"
              value={selectedMovie}
              onChange={(e) => setSelectedMovie(e.target.value)}
              className="bg-[#E6CCB2] border border-[#B08968] text-[#7F5539] font-medium px-3 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#DDB892] text-sm"
            >
              <option value="All">All Movies</option>
              {movies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="rating" className="mr-2 font-medium text-[#9C6644] text-sm">
              Filter by Rating:
            </label>
            <select
              id="rating"
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="bg-[#E6CCB2] border border-[#B08968] text-[#7F5539] font-medium px-3 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#DDB892] text-sm"
            >
              <option value="All">All Ratings</option>
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Star{rating !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reviews Display - Compact Cards */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-[#7F5539] text-lg">Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#7F5539] text-lg">No reviews found for your selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredReviews.map((review) => (
              <div
                key={review._id}
                className="bg-gradient-to-br from-[#EDE0D4] to-[#E6CCB2] rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#DDB892]/30 relative"
              >
                {/* Review Header - Compact */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-[#7F5539] mb-1 line-clamp-1">
                      {review.movieData?.title || "Unknown Movie"}
                    </h3>
                    <p className="text-[#9C6644] text-xs">
                      by {review.email ? maskEmail(review.email) : "Anonymous"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium ml-2 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>

                {/* Rating - Compact */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-yellow-500 text-lg">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-[#9C6644] text-xs bg-[#DDB892]/40 px-2 py-1 rounded-full">
                    {review.rating}/5
                  </span>
                </div>

                {/* Comment - Compact */}
                <div className="mb-3">
                  <p className="text-[#7F5539] text-sm leading-relaxed line-clamp-3">
                    {review.comment}
                  </p>
                </div>

                {/* Date - Compact */}
                <div className="text-[#B08968] text-xs flex items-center">
                  <i className="fas fa-calendar-alt mr-1"></i>
                  {formatDate(review.createdAt)}
                </div>

                {/* Decorative border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#DDB892] via-[#B08968] to-[#9C6644] rounded-t-xl"></div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Reviews;