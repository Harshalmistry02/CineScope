import { Link } from "react-router-dom";

const LogoutDisplay = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6CCB2] text-center px-4">
      <div className="bg-[#EDE0D4] p-10 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-[#7F5539] mb-4">Thank You for Visiting!</h1>
        <p className="text-[#9C6644] mb-6">
          You have been successfully logged out. We hope to see you again soon!
        </p>
        <Link
          to="/login"
          className="inline-block bg-[#B08968] hover:bg-[#DDB892] text-white font-semibold py-2 px-6 rounded-xl transition duration-200"
        >
          Login Again
        </Link>
      </div>
    </div>
  );
};

export default LogoutDisplay;
