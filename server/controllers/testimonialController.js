const Testimonial = require('../models/Testimonial');

exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort('order').lean();
    res.json({ success: true, data: testimonials });
  } catch (err) { next(err); }
};

// ---- ADMIN ----
exports.adminGetTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort('-createdAt').lean();
    res.json({ success: true, data: testimonials });
  } catch (err) { next(err); }
};

exports.createTestimonial = async (req, res, next) => {
  try {
    const t = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: t });
  } catch (err) { next(err); }
};

exports.updateTestimonial = async (req, res, next) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    res.json({ success: true, data: t });
  } catch (err) { next(err); }
};

exports.deleteTestimonial = async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa' });
  } catch (err) { next(err); }
};
