import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Chrome,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Settings,
  LogOut,
  Shield,
  Activity,
  Package
} from 'lucide-react';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="bg-gray-950 text-white min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">Please log in to view your profile.</p>
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors">
            Login
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen px-4 sm:px-6 py-4 sm:py-6">
      {/* Navigation */}
      <nav className="flex flex-col sm:flex-row sm:justify-between sm:items-center max-w-7xl mx-auto mb-6 sm:mb-8 gap-4">
        <Link to="/" className="flex items-center gap-2">
          <Chrome className="text-blue-500" size={24} />
          <span className="text-xl sm:text-2xl font-bold text-blue-500">Prompt2Plugin</span>
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
            Home
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={32} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">{user.name}</h1>
              <p className="text-gray-400 mb-4 text-sm sm:text-base">Chrome Extension Developer</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <span className={`px-3 py-1 rounded-full inline-block ${
                  user.accountStatus === 'active' 
                    ? 'bg-green-900/50 text-green-400 border border-green-500' 
                    : 'bg-red-900/50 text-red-400 border border-red-500'
                }`}>
                  {user.accountStatus === 'active' ? 'Active Account' : 'Inactive Account'}
                </span>
                <span className="text-gray-400">
                  Member since {formatDate(user.joinedDate)}
                </span>
              </div>
            </div>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors text-sm sm:text-base">
              <Settings size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="text-blue-500" size={24} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold">0</h3>
                <p className="text-gray-400 text-sm sm:text-base">Extensions Generated</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Activity className="text-green-500" size={24} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold">0%</h3>
                <p className="text-gray-400 text-sm sm:text-base">Success Rate</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="text-purple-500" size={24} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold">Free</h3>
                <p className="text-gray-400 text-sm sm:text-base">Account Type</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Account Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3">
                <Mail className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-400 mb-1">Email Address</p>
                  <p className="font-medium text-sm sm:text-base break-words">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-400 mb-1">Phone Number</p>
                  <p className="font-medium text-sm sm:text-base">{user.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3">
                <Calendar className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-400 mb-1">Join Date</p>
                  <p className="font-medium text-sm sm:text-base">{formatDate(user.joinedDate)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-400 mb-1">Last Login</p>
                  <p className="font-medium text-sm sm:text-base">{formatDate(user.lastLogin)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Getting Started</h2>
          <div className="text-center py-8 sm:py-12">
            <Package className="mx-auto mb-4 text-gray-600" size={40} />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Ready to Create Your First Extension?</h3>
            <p className="text-gray-400 mb-6 text-sm sm:text-base max-w-md mx-auto">
              Start by describing what you want your Chrome extension to do, and our AI will generate it for you.
            </p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg transition-all transform hover:scale-105 font-semibold text-sm sm:text-base"
            >
              Generate Your First Extension
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
