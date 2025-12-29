'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './Components/Navbar';
import Header from './Components/Header';
import Services from './Components/Services';
import Car from './Components/Car';
import About from './Components/About';
import Contact from './Components/Contact';
import Footer from './Components/Footer';
import ProtectedRoute from './Components/ProtectedRoute';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize dark mode from localStorage
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && 
        window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = '';
    }
  }, [isDarkMode]);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    console.log('Home page - Checking auth...');
    console.log('Token exists:', !!token);
    console.log('User data:', userData);

    if (!token || !userData) {
      console.log('No auth, redirecting to login');
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      console.log('Home page - Parsed user:', parsedUser);
      console.log('Home page - User role:', parsedUser.role);
      
      // REMOVED: Auto-redirect for admins/moderators
      // Now admins can view the home page too!
      
      console.log('User authenticated, showing home page');
      setUser(parsedUser);
      setLoading(false);
    } catch (err) {
      console.error('Error parsing user data:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkTheme">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen font-outfit overflow-x-hidden">
        <div className="relative z-50">
          <Navbar 
            isDarkMode={isDarkMode} 
            setIsDarkMode={setIsDarkMode}
            user={user}
            onLogout={handleLogout}
          />
        </div>
        
        <Header 
          isDarkMode={isDarkMode}
          user={user}
          onLogout={handleLogout}
        />
        <Services isDarkMode={isDarkMode} />
        <Car isDarkMode={isDarkMode} />
        <About isDarkMode={isDarkMode} />

        <main className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-screen-2xl">
          <Contact isDarkMode={isDarkMode} />
        </main>

        <Footer isDarkMode={isDarkMode} />
      </div>
    </ProtectedRoute>
  );
}