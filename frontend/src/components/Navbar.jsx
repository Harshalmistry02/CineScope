// src/components/Navbar.js
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await axios.get("/api/v1/users/logout", { withCredentials: true });
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        window.history.go(1);
      };
      navigate("/logout-display", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-[#E6CCB2] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 h-20 flex items-center justify-between">
        <Link to="/Home" className="logo">
          <img src={logo} alt="CineScope Logo" className="w-20" />
        </Link>
        
        <div className="relative w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-[#7F5539]" />
          </div>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-[#B08968]/30 rounded-xl bg-white/50 text-[#7F5539] placeholder-[#9C6644]/70 focus:outline-none focus:ring-2 focus:ring-[#DDB892] focus:border-transparent transition-all duration-200"
          />
        </div>
        
        <nav className="space-x-6 flex items-center">
          <Link to="/addmovie" className="text-[#B08968] hover:text-[#DDB892] font-medium">
            Add Movies
          </Link>
          
          <Link to="/review" className="text-[#B08968] hover:text-[#DDB892] font-medium">
            Reviews
          </Link>
         
          <Link to="/profile" className="text-[#B08968] hover:text-[#DDB892] font-medium">
            Profile
          </Link>
         
          <button
            onClick={handleLogout}
            className="bg-[#B08968] hover:bg-[#DDB892] text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;