const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Không có quyền truy cập' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = await User.findById(decoded.id);

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ success: false, message: 'Tài khoản không hợp lệ' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Yêu cầu quyền Admin' });
  }
};

module.exports = { protect, adminOnly };
