const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const authCtrl = require('../controllers/authController');
const serviceCtrl = require('../controllers/serviceController');
const projectCtrl = require('../controllers/projectController');
const blogCtrl = require('../controllers/blogController');
const testimonialCtrl = require('../controllers/testimonialController');
const contactCtrl = require('../controllers/contactController');
const pageCtrl = require('../controllers/pageController');
const chatbotCtrl = require('../controllers/chatbotController');

// Auth (no middleware)
router.post('/login', authCtrl.login);

// All admin routes require auth
router.use(protect);

// Dashboard
router.get('/me', authCtrl.getMe);
router.get('/dashboard', authCtrl.getDashboard);

// Services
router.get('/services', serviceCtrl.adminGetServices);
router.post('/services', serviceCtrl.createService);
router.put('/services/:id', serviceCtrl.updateService);
router.delete('/services/:id', serviceCtrl.deleteService);

// Service Categories
router.get('/service-categories', serviceCtrl.getServiceCategories);
router.post('/service-categories', serviceCtrl.createCategory);
router.put('/service-categories/:id', serviceCtrl.updateCategory);
router.delete('/service-categories/:id', serviceCtrl.deleteCategory);

// Projects
router.get('/projects', projectCtrl.adminGetProjects);
router.post('/projects', projectCtrl.createProject);
router.put('/projects/:id', projectCtrl.updateProject);
router.delete('/projects/:id', projectCtrl.deleteProject);

// Blog
router.get('/blog', blogCtrl.adminGetBlogPosts);
router.post('/blog', blogCtrl.createBlogPost);
router.put('/blog/:id', blogCtrl.updateBlogPost);
router.delete('/blog/:id', blogCtrl.deleteBlogPost);

// Blog Categories
router.get('/blog-categories', blogCtrl.getBlogCategories);
router.post('/blog-categories', blogCtrl.createBlogCategory);
router.put('/blog-categories/:id', blogCtrl.updateBlogCategory);
router.delete('/blog-categories/:id', blogCtrl.deleteBlogCategory);

// Testimonials
router.get('/testimonials', testimonialCtrl.adminGetTestimonials);
router.post('/testimonials', testimonialCtrl.createTestimonial);
router.put('/testimonials/:id', testimonialCtrl.updateTestimonial);
router.delete('/testimonials/:id', testimonialCtrl.deleteTestimonial);

// Contacts
router.get('/contacts', contactCtrl.adminGetContacts);
router.get('/contacts/stats', contactCtrl.getContactStats);
router.put('/contacts/:id', contactCtrl.updateContact);
router.delete('/contacts/:id', contactCtrl.deleteContact);

// Pages
router.get('/pages', pageCtrl.adminGetPages);
router.post('/pages', pageCtrl.createPage);
router.put('/pages/:id', pageCtrl.updatePage);
router.delete('/pages/:id', pageCtrl.deletePage);

// Settings
router.get('/settings', pageCtrl.getSettings);
router.put('/settings', pageCtrl.updateSettings);
router.get('/banners', pageCtrl.adminGetBanners);
router.put('/banners', pageCtrl.updateBanners);

// Media
router.get('/media', pageCtrl.getMedia);
router.post('/media', upload.single('file'), pageCtrl.uploadMedia);
router.delete('/media/:id', pageCtrl.deleteMedia);

// Chatbot
router.get('/chatbot/history', chatbotCtrl.getChatHistory);

module.exports = router;
