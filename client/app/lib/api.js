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
 * Make authenticated API request (JSON)
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

    if (!response.ok) {
      let errorMessage = 'API request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || `HTTP ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'Network error: Unable to connect to server. Please check if the backend is running.'
      );
    }
    throw error;
  }
}

/**
 * Make authenticated API request with FormData (file uploads)
 */
async function formDataRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    ...options.headers,
  };

  // DO NOT set Content-Type for FormData
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = 'API request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || `HTTP ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'Network error: Unable to connect to server. Please check if the backend is running.'
      );
    }
    throw error;
  }
}

/* ===================== APIs ===================== */

// Users
export const userAPI = {
  getAll: () => apiRequest('/api/users'),
  updateRole: (userId, role) =>
    apiRequest(`/api/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
};

// Bookings
export const bookingAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(`/api/bookings${params ? `?${params}` : ''}`);
  },
  updateStatus: (bookingId, status) =>
    apiRequest(`/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// Content
export const contentAPI = {
  getAll: (key = null) =>
    apiRequest(`/api/content${key ? `?key=${key}` : ''}`),
  create: (data) =>
    apiRequest('/api/content', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/api/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Dashboard
export const dashboardAPI = {
  getSummary: () => apiRequest('/api/dashboard/summary'),
  getCharts: (range = '7d') =>
    apiRequest(`/api/dashboard/charts?range=${range}`),
};

// Cars (FormData)
export const carAPI = {
  getAll: (activeOnly = true) =>
    apiRequest(`/api/cars${activeOnly ? '?active=true' : ''}`),

  create: (formData) =>
    formDataRequest('/api/cars', {
      method: 'POST',
      body: formData,
    }),

  update: (carId, formData) =>
    formDataRequest(`/api/cars/${carId}`, {
      method: 'PUT',
      body: formData,
    }),

  delete: (carId) =>
    apiRequest(`/api/cars/${carId}`, {
      method: 'DELETE',
    }),
};

// Booking creation
export const bookingCreateAPI = {
  create: (data) =>
    apiRequest('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
