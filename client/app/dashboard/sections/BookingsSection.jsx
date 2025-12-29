'use client';
import { useEffect, useState } from 'react';
import DataTable from '@/app/Components/admin/DataTable';
import { bookingAPI } from '@/app/lib/api';

export default function BookingsSection() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const filters = statusFilter ? { status: statusFilter } : {};
      const data = await bookingAPI.getAll(filters);
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdatingBookingId(bookingId);
      await bookingAPI.updateStatus(bookingId, newStatus);
      await loadBookings(); // Reload bookings
      alert('Booking status updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update booking status');
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300';
      case 'confirmed':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    }
  };



  const columns = [
    {
      header: 'User',
      accessor: 'user_name',
      render: (booking) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white">{booking.user_name || 'N/A'}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{booking.user_email || ''}</div>
        </div>
      ),
    },
    {
      header: 'Pickup',
      accessor: 'pickup_location',
      render: (booking) => (
        <span className="text-gray-800 dark:text-white">{booking.pickup_location}</span>
      ),
    },
    {
      header: 'Dropoff',
      accessor: 'dropoff_location',
      render: (booking) => (
        <span className="text-gray-800 dark:text-white">{booking.dropoff_location}</span>
      ),
    },
    {
      header: 'Car Type',
      accessor: 'car_type',
      render: (booking) => (
        <span className="text-gray-600 dark:text-gray-400">{booking.car_type}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (booking) => (
        <span className={`inline-block px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      ),
    },
    {
      header: 'Created',
      accessor: 'created_at',
      render: (booking) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {booking.created_at
            ? new Date(booking.created_at).toLocaleDateString()
            : 'N/A'}
        </span>
      ),
    },
  ];

  const actions = (booking) => (
    <select
      value={booking.status}
      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
      disabled={updatingBookingId === booking.id}
      className="text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    >
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Booked Rides</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all ride bookings
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={loadBookings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={bookings}
        loading={loading}
        emptyMessage="No bookings found"
        actions={actions}
      />
    </div>
  );
}

