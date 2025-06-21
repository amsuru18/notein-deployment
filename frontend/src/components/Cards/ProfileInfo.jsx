import React, { useState } from "react";
import { getInitials } from "../../utils/helper";
import { FiLogOut, FiUser, FiChevronDown } from "react-icons/fi";

const ProfileInfo = ({
  onLogout,
  userInfo,
  isMobileMenuTrigger,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // For mobile menu trigger, use parent state
  const isOpen = isMobileMenuTrigger ? isMobileMenuOpen : isDropdownOpen;
  const handleToggle = () => {
    if (isMobileMenuTrigger && setIsMobileMenuOpen) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 focus:bg-primary-100 dark:focus:bg-dark700 transition-colors duration-200 ring-0 focus:outline-none ${
          isMobileMenuTrigger ? "md:hidden" : ""
        }`}
        aria-label={
          isMobileMenuTrigger ? "Toggle mobile menu" : "Open profile menu"
        }
      >
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-blue-600 text-white font-medium text-sm shadow-lg">
          {getInitials(userInfo?.username)}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {userInfo?.username}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {userInfo?.email}
          </p>
        </div>
        <FiChevronDown
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          } ${userInfo?.username ? "block" : "hidden"}`}
        />
      </button>

      {/* Dropdown Menu (unified for desktop and mobile) */}
      {isOpen &&
        (isMobileMenuTrigger ? (
          // Mobile menu dropdown: full width below navbar
          <div className="fixed inset-x-0 top-16 z-40 md:hidden pb-4 pt-4 animate-slide-up bg-white dark:bg-dark800 shadow-xl border-t border-primary-100 dark:border-primary-900/40">
            <div className="px-4 py-2 border-b border-primary-50 dark:border-dark700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {userInfo?.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userInfo?.email}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 rounded-b-xl"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        ) : (
          // Desktop dropdown
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark800 rounded-xl shadow-2xl border border-primary-100 dark:border-primary-900/40 py-1 z-50 animate-slide-up">
            <div className="px-4 py-2 border-b border-primary-50 dark:border-dark700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {userInfo?.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userInfo?.email}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 rounded-b-xl"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        ))}
    </div>
  );
};

export default ProfileInfo;
