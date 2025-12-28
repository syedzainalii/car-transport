import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = ({ isDarkMode, setIsDarkMode, user, onLogout }) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const sideMenuRef = useRef();
  const userMenuRef = useRef();

  const navLinks = [
    { href: "#top", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#car", label: "Cars" },
    { href: "#about", label: "About Us" },
    { href: "#contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleDashboard = () => {
    setShowUserMenu(false);
    if (user?.role === 'admin' || user?.role === 'moderator') {
      router.push('/dashboard');
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-darkTheme backdrop-blur-md shadow-lg'
            : 'bg-white/80 dark:bg-darkTheme backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <a 
              href="#top" 
              className="flex-shrink-0 group"
            >
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105">
                Car Transportation
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-3 lg:px-4 py-2 text-sm lg:text-base font-medium text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 dark:bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 active:scale-90"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* User Authentication Section */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="hidden lg:flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {/* User Avatar */}
                    <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    
                    {/* User Info */}
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {user.role}
                      </p>
                    </div>

                    {/* Dropdown Arrow */}
                    <svg 
                      className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      {/* User Info in Dropdown */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 capitalize">
                          {user.role}
                        </span>
                      </div>

                      {/* Dashboard Link - Only for admin/moderator */}
                      {(user.role === 'admin' || user.role === 'moderator') && (
                        <button
                          onClick={handleDashboard}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Dashboard
                        </button>
                      )}

                      {/* My Bookings */}
                      <button
                        onClick={() => setShowUserMenu(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Bookings
                      </button>

                      {/* Profile Settings */}
                      <button
                        onClick={() => setShowUserMenu(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile Settings
                      </button>

                      {/* Divider */}
                      <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    onClick={() => router.push('/login')}
                    className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95 text-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Slide-out Menu */}
      <div
        ref={sideMenuRef}
        className={`fixed top-0 right-0 h-full w-64 sm:w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Menu
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Info in Mobile Menu */}
          {user && (
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Links */}
          <nav className="flex-1 px-6 py-8">
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg transition-all duration-200"
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}

              {/* Mobile User Actions */}
              {user && (
                <>
                  {(user.role === 'admin' || user.role === 'moderator') && (
                    <li>
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          handleDashboard();
                        }}
                        className="w-full text-left px-4 py-3 text-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg transition-all duration-200"
                      >
                        Dashboard
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={closeMobileMenu}
                      className="w-full text-left px-4 py-3 text-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg transition-all duration-200"
                    >
                      My Bookings
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={closeMobileMenu}
                      className="w-full text-left px-4 py-3 text-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg transition-all duration-200"
                    >
                      Profile Settings
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
            {user ? (
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
                className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-300 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    router.push('/login');
                  }}
                  className="w-full px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    router.push('/register');
                  }}
                  className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  <span>Sign Up</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;