// src/components/layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Home, PlusCircle, LogOut } from 'lucide-react';
import Logo from '/Users/rizon/Desktop/Buddhir_Bati_2/frontend/src/assets/output-onlinepngtools (1).png'; // Add path to your logo image

export const Navbar = ({ unreadCount }) => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex">
            <Link to="/" className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-gray-900">
              <img src={Logo} alt="Logo" className="h-14 w-15" />
              <span className="text-xl font-bold">BuddhirBati</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="p-2 text-gray-600 hover:text-gray-900 rounded-full">
              <Home className="h-6 w-6" />
            </Link>

            <Link to="/create-post" className="p-2 text-gray-600 hover:text-gray-900 rounded-full">
              <PlusCircle className="h-6 w-6" />
            </Link>

            <Link to="/notifications" className="relative p-2 text-gray-600 hover:text-gray-900 rounded-full">
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => {
                signout();
                navigate('/signin');
              }}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
