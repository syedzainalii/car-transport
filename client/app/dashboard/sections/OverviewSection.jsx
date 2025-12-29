'use client';
import { useEffect, useState } from 'react';
import StatsCard from '@/app/Components/admin/StatsCard';
import { LineChartPanel, BarChartPanel, PieChartPanel } from '@/app/Components/admin/ChartPanel';
import { dashboardAPI } from '@/app/lib/api';

export default function OverviewSection() {
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartRange, setChartRange] = useState('7d');

  useEffect(() => {
    loadData();
  }, [chartRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [summaryData, chartsData] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.getCharts(chartRange),
      ]);
      setSummary(summaryData.summary);
      setCharts(chartsData.charts);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!summary || !charts) {
    return <div>No data available</div>;
  }

  // Prepare pie chart data for booking status
  const bookingStatusData = Object.entries(summary.bookings)
    .filter(([key]) => key !== 'total' && key !== 'recent_7_days')
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value,
    }));

  return (
    <div className="space-y-6">
      {/* Chart Range Selector */}
      <div className="flex justify-end gap-2">
        {['7d', '30d', '90d'].map((range) => (
          <button
            key={range}
            onClick={() => setChartRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              chartRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={summary.users.total}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          color="blue"
        />
        <StatsCard
          title="Verified Users"
          value={summary.users.verified}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
        />
        <StatsCard
          title="Total Bookings"
          value={summary.bookings.total}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          }
          color="purple"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${summary.revenue.total.toFixed(2)}`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="orange"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Admins"
          value={summary.users.admins}
          color="purple"
        />
        <StatsCard
          title="Moderators"
          value={summary.users.moderators}
          color="blue"
        />
        <StatsCard
          title="Recent Bookings (7d)"
          value={summary.bookings.recent_7_days}
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartPanel
          data={charts.bookings_over_time}
          dataKey="bookings"
          name="Bookings"
          color="#3b82f6"
          title="Bookings Over Time"
        />
        <BarChartPanel
          data={charts.revenue_over_time}
          dataKey="revenue"
          name="Revenue ($)"
          color="#10b981"
          title="Revenue Over Time"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartPanel
          data={charts.users_over_time}
          dataKey="users"
          name="New Users"
          color="#8b5cf6"
          title="User Registrations Over Time"
        />
        <PieChartPanel
          data={bookingStatusData}
          dataKey="value"
          nameKey="name"
          title="Booking Status Distribution"
        />
      </div>
    </div>
  );
}

