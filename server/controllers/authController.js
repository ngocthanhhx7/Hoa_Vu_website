const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpire });
};

// @desc   Admin login
// @route  POST /api/admin/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      },
    });
  } catch (err) { next(err); }
};

// @desc   Get current user
// @route  GET /api/admin/me
exports.getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
    });
  } catch (err) { next(err); }
};

// @desc   Get dashboard stats
// @route  GET /api/admin/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const Project = require('../models/Project');
    const BlogPost = require('../models/BlogPost');
    const Contact = require('../models/Contact');
    const Testimonial = require('../models/Testimonial');

    const [projects, blogs, contacts, testimonials, newLeads] = await Promise.all([
      Project.countDocuments(),
      BlogPost.countDocuments(),
      Contact.countDocuments(),
      Testimonial.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
    ]);

    const recentContacts = await Contact.find().sort('-createdAt').limit(5).lean();

    res.json({
      success: true,
      data: {
        counts: { projects, blogs, contacts, testimonials, newLeads },
        recentContacts,
      },
    });
  } catch (err) { next(err); }
};
