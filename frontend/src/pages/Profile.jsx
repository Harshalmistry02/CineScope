import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    email: "",
    username: ""
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Check multiple possible token storage locations
        const token = localStorage.getItem("accessToken") || 
                     localStorage.getItem("token") || 
                     sessionStorage.getItem("accessToken") ||
                     sessionStorage.getItem("token");
        
        if (!token) {
          setError("No authentication token found. Please log in again.");
          setLoading(false);
          return;
        }

        console.log("Using token:", token.substring(0, 20) + "..."); // Debug log
        
        const response = await axios.get(
          "http://localhost:5000/api/v1/users/current-user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // Include cookies if your backend uses them
          }
        );
        
        const userData = response.data.data;
        setUser(userData);
        setEditForm({
          email: userData.email || "",
          username: userData.username || ""
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
        
        if (err.response?.status === 401) {
          setError("Session expired or invalid. Please log in again.");
          // Clear invalid tokens
          localStorage.removeItem("accessToken");
          localStorage.removeItem("token");
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("token");
        } else {
          setError("Failed to load profile. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form to original values if canceling
      setEditForm({
        email: user.email || "",
        username: user.username || ""
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken") || 
                   localStorage.getItem("token") || 
                   sessionStorage.getItem("accessToken") ||
                   sessionStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found. Please log in again.");
        return;
      }
      
      // Assuming you have an update profile endpoint
      const response = await axios.patch(
        "http://localhost:5000/api/v1/users/update-profile",
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      
      setUser(response.data.data);
      setIsEditing(false);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error updating profile:", err);
      
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Failed to update profile. Please try again.");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#D4A373] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#9C6644] mx-auto"></div>
            <p className="mt-4 text-[#7F5539] font-medium">Loading profile...</p>
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto">
            <h3 className="font-semibold mb-2">Authentication Error</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.href = '/login'} 
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Go to Login
            </button>
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
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#E6CCB2] rounded-lg shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-[#B08968] px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">My Profile</h1>
                <button
                  onClick={handleEditToggle}
                  className="bg-[#7F5539] hover:bg-[#6B4423] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Avatar Section */}
                <div className="md:col-span-1">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-[#9C6644] rounded-full flex items-center justify-center mx-auto mb-4">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl text-white font-bold">
                          {user?.username?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-[#7F5539] mb-2">
                      {user?.username || "User"}
                    </h2>
                    <p className="text-[#9C6644]">@{user?.username}</p>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="md:col-span-2">
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#7F5539] mb-4 border-b border-[#B08968] pb-2">
                        Personal Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#9C6644] mb-1">
                            Username
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="username"
                              value={editForm.username}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#B08968] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DDB892]"
                            />
                          ) : (
                            <p className="text-[#7F5539] font-medium">
                              {user?.username || "Not provided"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#9C6644] mb-1">
                            Email
                          </label>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={editForm.email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#B08968] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DDB892]"
                            />
                          ) : (
                            <p className="text-[#7F5539] font-medium">
                              {user?.email || "Not provided"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#9C6644] mb-1">
                            Member Since
                          </label>
                          <p className="text-[#7F5539] font-medium">
                            {formatDate(user?.createdAt)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#9C6644] mb-1">
                            Last Updated
                          </label>
                          <p className="text-[#7F5539] font-medium">
                            {formatDate(user?.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Account Statistics */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#7F5539] mb-4 border-b border-[#B08968] pb-2">
                        Account Statistics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#DDB892] p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-[#7F5539]">
                            {user?.watchHistory?.length || 0}
                          </p>
                          <p className="text-sm text-[#9C6644]">Movies Watched</p>
                        </div>
                        <div className="bg-[#DDB892] p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-[#7F5539]">
                            {formatDate(user?.createdAt)}
                          </p>
                          <p className="text-sm text-[#9C6644]">Member Since</p>
                        </div>
                        <div className="bg-[#DDB892] p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-[#7F5539]">
                            {Math.floor((new Date() - new Date(user?.createdAt)) / (1000 * 60 * 60 * 24)) || 0}
                          </p>
                          <p className="text-sm text-[#9C6644]">Days Active</p>
                        </div>
                      </div>
                    </div>

                    {/* Save Button for Edit Mode */}
                    {isEditing && (
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={handleEditToggle}
                          className="px-4 py-2 border border-[#B08968] text-[#7F5539] rounded-lg hover:bg-[#DDB892] transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-[#7F5539] text-white rounded-lg hover:bg-[#6B4423] transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;