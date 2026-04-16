const Service = require('../models/Service');
const ServiceCategory = require('../models/ServiceCategory');

// @desc   Get all active services
// @route  GET /api/services
exports.getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate('category', 'name slug')
      .sort('order')
      .lean();
    res.json({ success: true, data: services });
  } catch (err) { next(err); }
};

// @desc   Get service by slug
// @route  GET /api/services/:slug
exports.getServiceBySlug = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug')
      .lean();
    if (!service) return res.status(404).json({ success: false, message: 'Không tìm thấy dịch vụ' });
    res.json({ success: true, data: service });
  } catch (err) { next(err); }
};

// @desc   Get all service categories
// @route  GET /api/service-categories
exports.getServiceCategories = async (req, res, next) => {
  try {
    const categories = await ServiceCategory.find({ isActive: true }).sort('order').lean();
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
};

// ---- ADMIN ----

// @desc   List all services (admin)
exports.adminGetServices = async (req, res, next) => {
  try {
    const services = await Service.find().populate('category', 'name slug').sort('-createdAt').lean();
    res.json({ success: true, data: services });
  } catch (err) { next(err); }
};

// @desc   Create service
exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (err) { next(err); }
};

// @desc   Update service
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, message: 'Không tìm thấy dịch vụ' });
    res.json({ success: true, data: service });
  } catch (err) { next(err); }
};

// @desc   Delete service
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Không tìm thấy dịch vụ' });
    res.json({ success: true, message: 'Đã xóa dịch vụ' });
  } catch (err) { next(err); }
};

// Service Categories CRUD
exports.createCategory = async (req, res, next) => {
  try {
    const cat = await ServiceCategory.create(req.body);
    res.status(201).json({ success: true, data: cat });
  } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const cat = await ServiceCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    res.json({ success: true, data: cat });
  } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await ServiceCategory.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa danh mục' });
  } catch (err) { next(err); }
};
