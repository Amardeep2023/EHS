import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Attach token on every request
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('ehs_user');
  if (user) {
    try {
      const { token } = JSON.parse(user);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {}
  }
  return config;
});

// ── Auth ───────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ── Courses ────────────────────────────────────────────────────
export const courseAPI = {
  getAll: () => api.get('/courses'),
  getOne: (slug) => api.get(`/courses/${slug}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

// ── Products ───────────────────────────────────────────────────
export const productAPI = {
  getAll: () => api.get('/products'),
  getOne: (slug) => api.get(`/products/${slug}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// ── Resources ──────────────────────────────────────────────────
export const resourceAPI = {
  getAll: (category) => api.get('/resources', { params: { category } }),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`),
};

// ── Stories ────────────────────────────────────────────────────
export const storyAPI = {
  getAll: () => api.get('/stories'),
  create: (data) => api.post('/stories', data),
  update: (id, data) => api.put(`/stories/${id}`, data),
  delete: (id) => api.delete(`/stories/${id}`),
};

// ── Consultations ──────────────────────────────────────────────
export const consultationAPI = {
  book: (data) => api.post('/consultations', data),
  getMy: () => api.get('/consultations/my'),
  getAll: () => api.get('/consultations'),
  update: (id, data) => api.put(`/consultations/${id}`, data),
};

// ── Admin ──────────────────────────────────────────────────────
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
};

export default api;
