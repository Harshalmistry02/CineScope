import { Link, useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleReviewClick = (e) => {
    e.stopPropagation(); // Prevent card click navigation
    // Navigate to Reviews page with preselected movie
    navigate('/review', {
      state: {
        movieId: movie._id,
        movieTitle: movie.title
      }
    });
  };

  const handleCardClick = () => {
    // Navigate to movie detail page
    navigate(`/movie/${movie._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EDE0D4] to-[#E6CCB2] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#DDB892]/30 cursor-pointer"
    >
      {/* Movie Poster with Overlay */}
      <div className="relative overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-72 object-contain bg-[#EDE0D4] transition-transform duration-300 group-hover:scale-105"
        />

        {/* Floating Genre Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-[#7F5539]/90 text-[#EDE0D4] text-xs font-semibold rounded-full border border-[#EDE0D4]/20 flex items-center gap-1">
            <i className="fas fa-star text-xs" />
            {movie.genre}
          </span>
        </div>

        {/* Play Icon Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <i className="fas fa-play text-4xl text-white" />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 space-y-3">
        {/* Title */}
        <h2 className="text-lg font-bold text-[#7F5539] leading-tight line-clamp-2 group-hover:text-[#9C6644] transition-colors duration-300">
          {movie.title}
        </h2>

        {/* Movie Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-2 py-1 bg-[#DDB892]/40 rounded-lg">
            <i className="fas fa-clock text-xs text-[#7F5539]" />
            <span className="text-xs font-medium text-[#7F5539]">{movie.duration}m</span>
          </div>

          <div className="flex items-center gap-2 px-2 py-1 bg-[#B08968]/20 rounded-lg">
            <i className="fas fa-language text-xs text-[#7F5539]" />
            <span className="text-xs font-medium text-[#7F5539]">{movie.language}</span>
          </div>
        </div>

        {/* Availability Status */}
        <div className="flex items-center justify-between p-2 bg-[#EDE0D4]/60 rounded-xl border border-[#DDB892]/30">
          <div className="flex items-center gap-2">
            <i className="fas fa-check-circle text-xs text-[#B08968]" />
            <span className="text-xs font-medium text-[#B08968]">Available</span>
          </div>
          <span className="text-xs font-bold text-[#7F5539] bg-[#DDB892]/50 px-2 py-1 rounded-md">
            {movie.availability}
          </span>
        </div>

        {/* Description */}
        <div className="relative">
          <p className="text-xs text-[#9C6644] leading-relaxed line-clamp-2">
            {movie.description.length > 80
              ? movie.description.slice(0, 80) + "..."
              : movie.description}
          </p>
        </div>

        {/* Action Button - Updated for direct review functionality */}
        <div className="pt-1">
          <button
            onClick={handleReviewClick}
            className="w-full bg-gradient-to-r from-[#B08968] to-[#9C6644] text-[#EDE0D4] font-semibold py-2 px-3 rounded-xl hover:from-[#9C6644] hover:to-[#7F5539] transform hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span className="flex items-center justify-center gap-2 text-sm">
              <i className="fas fa-pen-to-square text-sm" />
              Write Review
            </span>
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#DDB892] via-[#B08968] to-[#9C6644]"></div>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-[#7F5539]/10"></div>
    </div>
  );
};

export default MovieCard;