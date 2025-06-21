import React, { useState } from "react";
import SearchBar from "./SearchBar/SearchBar";
import ProfileInfo from "./Cards/ProfileInfo";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  signoutFailure,
  signoutStart,
  signoutSuccess,
} from "../redux/user/userSlice";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { persistor } from "../redux/store";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  const onLogout = async () => {
    try {
      dispatch(signoutStart());
      let res;
      try {
        res = await axios.get(`${API_BASE_URL}/auth/signout`, {
          withCredentials: true,
        });
      } catch (err) {
        // If error is 401 or network, still proceed to clear state
        dispatch(signoutFailure(err.response?.data?.message || err.message));
        toast.error(err.response?.data?.message || err.message);
        dispatch(signoutSuccess());
        persistor.purge();
        navigate("/login");
        return;
      }

      if (res.data.success === false) {
        dispatch(signoutFailure(res.data.message));
        toast.error(res.data.message);
        // Still clear state and redirect
        dispatch(signoutSuccess());
        persistor.purge();
        navigate("/login");
        return;
      }

      toast.success(res.data.message);
      dispatch(signoutSuccess());
      persistor.purge();
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      dispatch(signoutFailure(error.message));
      // Still clear state and redirect
      dispatch(signoutSuccess());
      persistor.purge();
      navigate("/login");
    }
  };

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-primary-200 dark:border-primary-900/60 bg-white/90 dark:bg-dark800/90 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={"/"} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <h2 className="text-xl font-bold">
              <span className="text-gray-500 dark:text-gray-400">Note</span>
              <span className="text-gradient">In</span>
            </h2>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar
              value={searchQuery}
              onChange={({ target }) => setSearchQuery(target.value)}
              handleSearch={handleSearch}
              onClearSearch={onClearSearch}
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <FiSun className="w-5 h-5 text-yellow-500" />
              ) : (
                <FiMoon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Profile */}
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <FiSun className="w-5 h-5 text-yellow-500" />
              ) : (
                <FiMoon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <ProfileInfo
              userInfo={userInfo}
              onLogout={onLogout}
              isMobileMenuTrigger
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        </div>

        {/* Mobile Menu */}
        {/* Mobile menu dropdown is now handled by ProfileInfo trigger */}
      </div>
    </nav>
  );
};

export default Navbar;
