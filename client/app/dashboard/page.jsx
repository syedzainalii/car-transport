'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    console.log('Dashboard - Checking auth...');
    console.log('Token exists:', !!token);
    console.log('User data exists:', !!userData);

    if (!token || !userData) {
      console.log('No auth found, redirecting to login');
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      console.log('Dashboard - Parsed user:', user);
      console.log('Dashboard - User role:', user.role);

      // IMPORTANT: Check if user is admin or moderator
      if (user.role !== 'admin' && user.role !== 'moderator') {
        console.log('User is not admin/moderator, redirecting to home');
        router.push('/');
        return;
      }

      console.log('User authorized for dashboard!');
      setCurrentUser(user);

      // Fetch users list
      fetch(`${API_URL}/api/users`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
        .then((res) => {
          console.log('Users API response status:', res.status);
          if (!res.ok) throw new Error('Failed to fetch users');
          return res.json();
        })
        .then((data) => {
          console.log('Users data received:', data);
          setUsers(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching users:', err);
          setError('Failed to load users');
          setLoading(false);
        });
    } catch (err) {
      console.error('Error parsing user data:', err);
      localStorage.clear();
      router.push('/login');
    }
  }, [router]);

  const logout = () => {
    console.log('Logging out...');
    localStorage.clear();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {currentUser.name}
              </p>
              <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 capitalize">
                {currentUser.role}
              </span>
            </div>
            <button 
              onClick={logout} 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Verified Users</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {users.filter(u => u.is_verified).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Active Today</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {users.filter(u => {
                    if (!u.last_login) return false;
                    const today = new Date().toDateString();
                    return new Date(u.last_login).toDateString() === today;
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">All Users</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Role</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="p-4 text-gray-800 dark:text-white font-medium">{u.name}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full capitalize ${
                          u.role === 'admin' 
                            ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                            : u.role === 'moderator'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.is_verified ? (
                          <span className="inline-flex items-center text-green-600 dark:text-green-400 text-sm">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-yellow-600 dark:text-yellow-400 text-sm">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                        {u.last_login
                          ? new Date(u.last_login).toLocaleString()
                          : 'Never'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}