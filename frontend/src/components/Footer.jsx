import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br pt-5 from-[#7F5539] via-[#8B5A3C] to-[#6B4423] text-[#EDE0D4] mt-auto relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#DDB892] rounded-full blur-3xl transform -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#B08968] rounded-full blur-3xl transform translate-x-20 translate-y-20"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#E6CCB2] rounded-full blur-2xl opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Logo and Brand Section */}
          <div className="flex-1 lg:flex-[2]">
            <div className="flex items-center mb-3">
              <div className="relative">
                <img src={logo} alt="CineScope Logo" className="w-30 h-8 mr-3 drop-shadow-lg" />
                <div className="absolute -inset-1 bg-gradient-to-r from-[#DDB892] to-[#B08968] rounded-lg blur opacity-20"></div>
              </div>
            </div>
            <p className="text-[#E6CCB2] mb-4 max-w-md leading-relaxed">
              Your ultimate destination for discovering, reviewing, and managing your favorite movies.
              <span className="block mt-1 text-[#DDB892] font-medium">
                Explore our vast collection and share your thoughts with the community.
              </span>
            </p>

            {/* Movie Stats */}
            {/* <div className="flex gap-4 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold text-[#DDB892]">10K+</div>
                <div className="text-xs text-[#E6CCB2]">Movies</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#DDB892]">5K+</div>
                <div className="text-xs text-[#E6CCB2]">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#DDB892]">1K+</div>
                <div className="text-xs text-[#E6CCB2]">Users</div>
              </div>
            </div> */}
          </div>

          {/* Quick Links */}
          <div className="flex-1 min-w-[200px]">
            <h4 className="text-lg font-bold text-[#DDB892] mb-3 relative">
              Quick Links
              <div className="absolute -bottom-1 left-0 w-10 h-0.5 bg-gradient-to-r from-[#DDB892] to-[#B08968] rounded-full"></div>
            </h4>
            <div className="space-y-2">
              <Link to="/Home" className="group flex items-center text-[#E6CCB2] hover:text-[#DDB892] transition-all duration-300 transform hover:translate-x-2">
                <div className="w-1.5 h-1.5 bg-[#B08968] rounded-full mr-2 group-hover:bg-[#DDB892] transition-colors duration-300"></div>
                <span>Home</span>
              </Link>
              <Link to="/addmovie" className="group flex items-center text-[#E6CCB2] hover:text-[#DDB892] transition-all duration-300 transform hover:translate-x-2">
                <div className="w-1.5 h-1.5 bg-[#B08968] rounded-full mr-2 group-hover:bg-[#DDB892] transition-colors duration-300"></div>
                <span>Add Movies</span>
              </Link>
              <Link to="/Review" className="group flex items-center text-[#E6CCB2] hover:text-[#DDB892] transition-all duration-300 transform hover:translate-x-2">
                <div className="w-1.5 h-1.5 bg-[#B08968] rounded-full mr-2 group-hover:bg-[#DDB892] transition-colors duration-300"></div>
                <span>Reviews</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Copyright Section */}
        <div className="relative mt-8">
          <div className="relative bg-[#7F5539] px-6 py-3 mx-auto max-w-md rounded-xl shadow-lg border border-[#9C6644]/30">
            <div className="text-center">
              <p className="text-[#E6CCB2] text-lg font-medium">
                © 2024 CineScope. All rights reserved.
              </p>
              <p className="text-[#B08968] text-sm mt-1">
                Made with ❤️ for movie lovers
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;