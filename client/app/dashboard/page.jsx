'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/app/Components/admin/AdminLayout';
import OverviewSection from './sections/OverviewSection';
import UsersSection from './sections/UsersSection';
import BookingsSection from './sections/BookingsSection';
import ContentSection from './sections/ContentSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Dashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      
      // Check if user is admin or moderator
      if (user.role !== 'admin' && user.role !== 'moderator') {
        router.push('/');
        return;
      }

      setCurrentUser(user);
      setLoading(false);
    } catch (err) {
      console.error('Error parsing user data:', err);
      localStorage.clear();
      router.push('/login');
    }
  }, [router]);

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewSection />;
      case 'users':
        return <UsersSection />;
      case 'bookings':
        return <BookingsSection />;
      case 'content':
        return <ContentSection />;
      default:
        return <OverviewSection />;
    }
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
    return null;
  }

  return (
    <AdminLayout
      currentUser={currentUser}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderActiveSection()}
    </AdminLayout>
  );
}
