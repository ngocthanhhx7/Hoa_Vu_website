import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hoavu_admin_token');
  if (token && config.url?.includes('/admin')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('hoavu_admin_token');
      localStorage.removeItem('hoavu_admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  },
);

export const publicAPI = {
  getSettings: () => api.get('/settings'),
  getServices: () => api.get('/services'),
  getServiceBySlug: (slug) => api.get(`/services/${slug}`),
  getServiceCategories: () => api.get('/service-categories'),
  getProjects: (params) => api.get('/projects', { params }),
  getFeaturedProjects: (limit) => api.get('/projects/featured', { params: { limit } }),
  getProjectBySlug: (slug) => api.get(`/projects/${slug}`),
  getBlogPosts: (params) => api.get('/blog', { params }),
  getBlogPostBySlug: (slug) => api.get(`/blog/${slug}`),
  getBlogCategories: () => api.get('/blog-categories'),
  getTestimonials: () => api.get('/testimonials'),
  submitContact: (data) => api.post('/contacts', data),
  getPageBySlug: (slug) => api.get(`/pages/${slug}`),
  sendChatMessage: (data) => api.post('/chatbot/message', data),
  getBanners: () => api.get('/banners'),
};

export const adminAPI = {
  login: (data) => api.post('/admin/login', data),
  getMe: () => api.get('/admin/me'),
  getDashboard: () => api.get('/admin/dashboard'),
  getContactStats: () => api.get('/admin/contacts/stats'),
  getServices: () => api.get('/admin/services'),
  getServiceCategories: () => api.get('/admin/service-categories'),
  createService: (data) => api.post('/admin/services', data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data),
  deleteService: (id) => api.delete(`/admin/services/${id}`),
  getProjects: (params) => api.get('/admin/projects', { params }),
  createProject: (data) => api.post('/admin/projects', data),
  updateProject: (id, data) => api.put(`/admin/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/admin/projects/${id}`),
  getBlogPosts: (params) => api.get('/admin/blog', { params }),
  getBlogCategories: () => api.get('/admin/blog-categories'),
  createBlogPost: (data) => api.post('/admin/blog', data),
  updateBlogPost: (id, data) => api.put(`/admin/blog/${id}`, data),
  deleteBlogPost: (id) => api.delete(`/admin/blog/${id}`),
  getTestimonials: () => api.get('/admin/testimonials'),
  createTestimonial: (data) => api.post('/admin/testimonials', data),
  updateTestimonial: (id, data) => api.put(`/admin/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/admin/testimonials/${id}`),
  getContacts: (params) => api.get('/admin/contacts', { params }),
  updateContact: (id, data) => api.put(`/admin/contacts/${id}`, data),
  deleteContact: (id) => api.delete(`/admin/contacts/${id}`),
  getPages: () => api.get('/admin/pages'),
  createPage: (data) => api.post('/admin/pages', data),
  updatePage: (id, data) => api.put(`/admin/pages/${id}`, data),
  deletePage: (id) => api.delete(`/admin/pages/${id}`),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
  getMedia: (params) => api.get('/admin/media', { params }),
  uploadMedia: (formData, folder) => api.post(`/admin/media?folder=${folder || 'general'}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteMedia: (id) => api.delete(`/admin/media/${id}`),
  // Banners (stored in settings.bannerImages)
  getBanners: () => api.get('/admin/banners'),
  updateBanners: (bannerImages) => api.put('/admin/banners', { bannerImages }),
};

export default api;

