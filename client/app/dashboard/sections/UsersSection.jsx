'use client';
import { useEffect, useState } from 'react';
import DataTable from '@/app/Components/admin/DataTable';
import { userAPI } from '@/app/lib/api';

export default function UsersSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userAPI.getAll();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      setUpdatingUserId(userId);
      await userAPI.updateRole(userId, newRole);
      await loadUsers(); // Reload users
      alert('User role updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (user) => (
        <span className="font-medium text-gray-800 dark:text-white">{user.name}</span>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (user) => (
        <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (user) => (
        <span className={`inline-block px-2 py-1 text-xs rounded-full capitalize ${
          user.role === 'admin'
            ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
            : user.role === 'moderator'
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
        }`}>
          {user.role || 'user'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'is_verified',
      render: (user) => (
        user.is_verified ? (
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
        )
      ),
    },
    {
      header: 'Last Login',
      accessor: 'last_login',
      render: (user) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {user.last_login
            ? new Date(user.last_login).toLocaleString()
            : 'Never'}
        </span>
      ),
    },
  ];

  const actions = (user) => (
    <div className="flex gap-2">
      <select
        value={user.role || 'user'}
        onChange={(e) => handleRoleChange(user.id, e.target.value)}
        disabled={updatingUserId === user.id}
        className="text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <option value="user">User</option>
        <option value="moderator">Moderator</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Users & Roles</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage user roles and permissions
          </p>
        </div>
        <button
          onClick={loadUsers}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="No users found"
        actions={actions}
      />
    </div>
  );
}

