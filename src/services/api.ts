const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper to get auth token
const getToken = () => localStorage.getItem('admin_token');

// Helper for API requests
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = getToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (response.status === 401) {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin';
    return null;
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API Error');
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    fetchApi('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// Content API
export const contentApi = {
  getAll: () => fetchApi('/content'),
  getByKey: (key: string) => fetchApi(`/content/${key}`),
  update: (key: string, data: { title?: string; subtitle?: string; content?: string }) =>
    fetchApi(`/content/${key}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Gallery API
export const galleryApi = {
  getAll: () => fetchApi('/gallery'),
  upload: (formData: FormData) =>
    fetch(`${API_URL}/gallery`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    }).then(r => r.json()),
  delete: (id: number) =>
    fetchApi(`/gallery/${id}`, { method: 'DELETE' }),
};

// Instagram API
export const instagramApi = {
  getAll: () => fetchApi('/instagram'),
  upload: (formData: FormData) =>
    fetch(`${API_URL}/instagram`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    }).then(r => r.json()),
  delete: (id: number) =>
    fetchApi(`/instagram/${id}`, { method: 'DELETE' }),
};

// Settings API
export const settingsApi = {
  getAll: () => fetchApi('/settings'),
  update: (key: string, value: string) =>
    fetchApi(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    }),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => fetchApi('/admin/stats'),
};
