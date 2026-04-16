const Project = require('../models/Project');

// @desc   Get projects (paginated, filterable)
// @route  GET /api/projects?category=&page=&limit=
exports.getProjects = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 15 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('category', 'name slug')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) { next(err); }
};

// @desc   Get featured projects
// @route  GET /api/projects/featured
exports.getFeaturedProjects = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 16;
    const projects = await Project.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .sort('order')
      .limit(limit)
      .lean();
    res.json({ success: true, data: projects });
  } catch (err) { next(err); }
};

// @desc   Get project by slug
// @route  GET /api/projects/:slug
exports.getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug')
      .lean();
    if (!project) return res.status(404).json({ success: false, message: 'Không tìm thấy dự án' });

    // Increment view count
    await Project.findByIdAndUpdate(project._id, { $inc: { viewCount: 1 } });

    res.json({ success: true, data: project });
  } catch (err) { next(err); }
};

// ---- ADMIN ----
exports.adminGetProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await Project.countDocuments();
    const projects = await Project.find()
      .populate('category', 'name slug')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();
    res.json({ success: true, data: projects, pagination: { page: parseInt(page), total, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
};

exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) { next(err); }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: 'Không tìm thấy dự án' });
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa dự án' });
  } catch (err) { next(err); }
};
