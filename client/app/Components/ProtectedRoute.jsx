'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      console.log('ProtectedRoute - Checking auth...');
      console.log('Required role:', requiredRole);
      console.log('Token exists:', !!token);
      console.log('User data exists:', !!userData);

      // No token - redirect to login
      if (!token || !userData) {
        console.log('ProtectedRoute - No auth, redirecting to login');
        router.push('/login');
        return;
      }

      try {
        const user = JSON.parse(userData);
        console.log('ProtectedRoute - User role:', user.role);

        // Check role if required
        if (requiredRole) {
          if (Array.isArray(requiredRole)) {
            // Multiple roles allowed (e.g., ['admin', 'moderator'])
            console.log('ProtectedRoute - Checking against array:', requiredRole);
            if (!requiredRole.includes(user.role)) {
              console.log('ProtectedRoute - Role not in array, redirecting to /');
              router.push('/');
              return;
            }
          } else {
            // Single role required (e.g., 'admin')
            console.log('ProtectedRoute - Checking against single role:', requiredRole);
            if (user.role !== requiredRole) {
              console.log('ProtectedRoute - Role mismatch, redirecting to /');
              router.push('/');
              return;
            }
          }
        }

        // Authorized - show content
        console.log('ProtectedRoute - User authorized!');
        setIsAuthorized(true);
        setIsLoading(false);
      } catch (err) {
        console.error('ProtectedRoute - Auth error:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, requiredRole]);

  // Show loading state while checking authorization
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't show anything if not authorized (already redirected)
  if (!isAuthorized) {
    return null;
  }

  // User is authorized - render children
  return <>{children}</>;
}