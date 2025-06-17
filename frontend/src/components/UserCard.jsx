import React from 'react';

const UserCard = ({ user }) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EDE0D4] to-[#E6CCB2] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#DDB892]/30 max-w-md mx-auto">
      
      {/* Header Section with Avatar */}
      <div className="p-6 text-center">
        {/* Profile Avatar */}
        <div className="w-20 h-20 mx-auto mb-4 bg-[#7F5539] rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl font-bold text-[#EDE0D4]">
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </span>
        </div>
        
        {/* Username */}
        <h2 className="text-xl font-bold text-[#7F5539] mb-2">
          {user.username || 'Unknown User'}
        </h2>
      </div>

      {/* User Details */}
      <div className="px-6 pb-6 space-y-4">
        
        {/* Email */}
        <div className="bg-white/50 rounded-lg p-3 border border-[#DDB892]/20">
          <div className="flex items-center gap-3">
            <i className="fas fa-envelope text-[#7F5539]"></i>
            <div className="flex-1">
              <p className="text-xs text-[#7F5539]/70 font-medium">Email</p>
              <p className="text-[#7F5539] font-semibold text-sm break-all">
                {user.email || 'Not provided'}
              </p>
            </div>
          </div>
        </div>

        {/* User ID */}
        <div className="bg-white/50 rounded-lg p-3 border border-[#DDB892]/20">
          <div className="flex items-center gap-3">
            <i className="fas fa-id-card text-[#7F5539]"></i>
            <div className="flex-1">
              <p className="text-xs text-[#7F5539]/70 font-medium">User ID</p>
              <p className="text-[#7F5539] font-mono text-xs break-all">
                {user._id || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Join Date */}
        <div className="bg-white/50 rounded-lg p-3 border border-[#DDB892]/20">
          <div className="flex items-center gap-3">
            <i className="fas fa-calendar-alt text-[#7F5539]"></i>
            <div className="flex-1">
              <p className="text-xs text-[#7F5539]/70 font-medium">Member Since</p>
              <p className="text-[#7F5539] font-semibold text-sm">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="bg-white/50 rounded-lg p-3 border border-[#DDB892]/20">
          <div className="flex items-center gap-3">
            <i className="fas fa-clock text-[#7F5539]"></i>
            <div className="flex-1">
              <p className="text-xs text-[#7F5539]/70 font-medium">Last Updated</p>
              <p className="text-[#7F5539] font-semibold text-sm">
                {formatDate(user.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Watch History Count */}
        <div className="bg-white/50 rounded-lg p-3 border border-[#DDB892]/20">
          <div className="flex items-center gap-3">
            <i className="fas fa-history text-[#7F5539]"></i>
            <div className="flex-1">
              <p className="text-xs text-[#7F5539]/70 font-medium">Watch History</p>
              <p className="text-[#7F5539] font-semibold text-sm">
                {user.watchHistory ? user.watchHistory.length : 0} items
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-[#7F5539]/10"></div>
    </div>
  );
};

export default UserCard;