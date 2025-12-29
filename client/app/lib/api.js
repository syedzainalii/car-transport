const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Get authentication token from localStorage
 */
function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      // Try to parse error message from JSON response
      let errorMessage = 'API request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || `HTTP ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle network errors or other fetch errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
    }
    // Re-throw other errors (including our custom Error from above)
    throw error;
  }
}

// User endpoints
export const userAPI = {
  getAll: () => apiRequest('/api/users'),
  updateRole: (userId, role) => 
    apiRequest(`/api/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
};

// Booking endpoints
export const bookingAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    const query = params.toString();
    return apiRequest(`/api/bookings${query ? `?${query}` : ''}`);
  },
  updateStatus: (bookingId, status) =>
    apiRequest(`/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// Content endpoints
export const contentAPI = {
  getAll: (key = null) => {
    const query = key ? `?key=${key}` : '';
    return apiRequest(`/api/content${query}`);
  },
  create: (data) =>
    apiRequest('/api/content', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (blockId, data) =>
    apiRequest(`/api/content/${blockId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Dashboard endpoints
export const dashboardAPI = {
  getSummary: () => apiRequest('/api/dashboard/summary'),
  getCharts: (range = '7d') => apiRequest(`/api/dashboard/charts?range=${range}`),
};

// Car endpoints
export const carAPI = {
  getAll: (activeOnly = true) => {
    const query = activeOnly ? '?active=true' : '';
    return apiRequest(`/api/cars${query}`);
  },
  create: (data) =>
    apiRequest('/api/cars', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (carId, data) =>
    apiRequest(`/api/cars/${carId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (carId) =>
    apiRequest(`/api/cars/${carId}`, {
      method: 'DELETE',
    }),
};

// Booking creation endpoint
export const bookingCreateAPI = {
  create: (data) =>
    apiRequest('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

