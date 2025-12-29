'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = ({ isDarkMode, setIsDarkMode, user, onLogout }) => {
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuRef = useRef(null);

  const navLinks = [
    { href: "#top", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#car", label: "Cars" },
    { href: "#about", label: "About Us" },
    { href: "#contact", label: "Contact" },
  ];

  /* Scroll effect */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-darkTheme backdrop-blur-md shadow-lg'
            : 'bg-white/80 dark:bg-darkTheme backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <a
            href="#top"
            className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
          >
            Car Transportation
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 dark:text-gray-200 hover:text-orange-500 transition"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>

            {/* User Dropdown */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="w-9 h-9 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block text-sm font-medium">
                    {user.name}
                  </span>
                </button>

                {/* 🔥 UPDATED DROPDOWN */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden z-50">

                    {/* Admin Email */}
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-xs text-gray-400">Account</p>
                      <p className="text-sm truncate">{user.email}</p>
                    </div>

                    {/* Role Badge */}
                    <div className="px-4 py-2 border-b border-gray-700">
                      <span className="px-3 py-1 bg-orange-600 text-xs rounded-full capitalize">
                        {user.role}
                      </span>
                    </div>

                    {/* Dashboard */}
                    {(user.role === 'admin' || user.role === 'moderator') && (
                      <button
                        onClick={() => router.push('/dashboard')}
                        className="dropdown-btn"
                      >
                        📊 Dashboard
                      </button>
                    )}

                    {/* My Bookings */}
                    <button
                      onClick={() => router.push('/my-bookings')}
                      className="dropdown-btn"
                    >
                      📋 My Bookings
                    </button>

                    {/* Profile Settings */}
                    <button
                      onClick={() => router.push('/profile-settings')}
                      className="dropdown-btn"
                    >
                      ⚙️ Profile Settings
                    </button>

                    {/* Logout */}
                    <button
                      onClick={onLogout}
                      className="dropdown-btn text-red-400"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="text-gray-700 dark:text-gray-300"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="px-4 py-2 bg-orange-500 text-white rounded-full"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Dropdown button styles */}
      <style jsx>{`
        .dropdown-btn {
          width: 100%;
          text-align: left;
          padding: 10px 16px;
          font-size: 14px;
          transition: background 0.2s;
        }
        .dropdown-btn:hover {
          background: #374151;
        }
      `}</style>
    </>
  );
};

export default Navbar;
