const express = require('express');
const router = express.Router();
const serviceCtrl = require('../controllers/serviceController');
const projectCtrl = require('../controllers/projectController');
const blogCtrl = require('../controllers/blogController');
const testimonialCtrl = require('../controllers/testimonialController');
const contactCtrl = require('../controllers/contactController');
const pageCtrl = require('../controllers/pageController');
const chatbotCtrl = require('../controllers/chatbotController');

// Services
router.get('/services', serviceCtrl.getServices);
router.get('/services/:slug', serviceCtrl.getServiceBySlug);
router.get('/service-categories', serviceCtrl.getServiceCategories);

// Projects
router.get('/projects', projectCtrl.getProjects);
router.get('/projects/featured', projectCtrl.getFeaturedProjects);
router.get('/projects/:slug', projectCtrl.getProjectBySlug);

// Blog
router.get('/blog', blogCtrl.getBlogPosts);
router.get('/blog-categories', blogCtrl.getBlogCategories);
router.get('/blog/:slug', blogCtrl.getBlogPostBySlug);

// Testimonials
router.get('/testimonials', testimonialCtrl.getTestimonials);

// Contact
router.post('/contacts', contactCtrl.submitContact);

// Pages
router.get('/pages/:slug', pageCtrl.getPageBySlug);

// Settings
router.get('/settings', pageCtrl.getSettings);

// Chatbot
router.post('/chatbot/message', chatbotCtrl.sendMessage);

// Banners
router.get('/banners', pageCtrl.getBanners);

module.exports = router;
