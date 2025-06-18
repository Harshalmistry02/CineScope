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
      className="group relative overflow-hidden rounded-xl bg-[#EDE0D4] shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] border border-[#E6CCB2] cursor-pointer"
    >
      {/* Movie Poster Container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-gradient-to-br from-[#EDE0D4] to-[#E6CCB2]">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Genre Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-[#7F5539]/95 text-[#EDE0D4] text-xs font-bold rounded-full shadow-sm">
            {movie.genre}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#7F5539]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-5">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-[#EDE0D4]/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#EDE0D4]/30">
              <i className="fas fa-circle-exclamation text-[#EDE0D4] text-sm" />
            </div>
            <span className="text-[#EDE0D4] text-sm font-semibold">Movie Detail</span>
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-[#9C6644]/90 text-[#EDE0D4] text-xs font-medium rounded-md flex items-center gap-1">
            <i className="fas fa-clock text-xs" />
            {movie.duration}m
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-base font-bold text-[#7F5539] leading-tight line-clamp-2 group-hover:text-[#9C6644] transition-colors duration-300">
          {movie.title}
        </h3>

        {/* Movie Info Row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 px-2 py-1 bg-[#E6CCB2]/60 rounded-md">
            <i className="fas fa-language text-[#B08968]" />
            <span className="font-medium text-[#7F5539]">{movie.language}</span>
          </div>

          <div className="flex items-center gap-1 text-[#B08968]">
            <i className="fas fa-check-circle" />
            <span className="font-medium text-xs">{movie.availability}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#9C6644] leading-relaxed line-clamp-2 opacity-80">
          {movie.description.length > 65
            ? movie.description.slice(0, 65) + "..."
            : movie.description}
        </p>

        {/* Action Button */}
        <button
          onClick={handleReviewClick}
          className="w-full bg-gradient-to-r from-[#B08968] to-[#9C6644] text-[#EDE0D4] font-semibold py-2.5 px-4 rounded-lg hover:from-[#9C6644] hover:to-[#7F5539] transform hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-md text-sm"
        >
          <span className="flex items-center justify-center gap-2">
            <i className="fas fa-star text-sm" />
            Write Review
          </span>
        </button>
      </div>

      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#DDB892] via-[#B08968] to-[#9C6644] opacity-60"></div>

      {/* Corner Accent */}
      <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[15px] border-r-[#DDB892]/20 border-b-[15px] border-b-transparent"></div>
    </div>
  );
};

export default MovieCard;