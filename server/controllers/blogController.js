const BlogPost = require('../models/BlogPost');
const BlogCategory = require('../models/BlogCategory');

// @desc   Get blog posts (paginated, filterable by category)
// @route  GET /api/blog?category=&page=&limit=
exports.getBlogPosts = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;

    const total = await BlogPost.countDocuments(query);
    const posts = await BlogPost.find(query)
      .populate('category', 'name slug')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: posts,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) { next(err); }
};

// @desc   Get blog post by slug
// @route  GET /api/blog/:slug
exports.getBlogPostBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug')
      .lean();
    if (!post) return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });

    await BlogPost.findByIdAndUpdate(post._id, { $inc: { viewCount: 1 } });

    // Get related posts
    const related = await BlogPost.find({
      category: post.category._id,
      _id: { $ne: post._id },
      isActive: true,
    }).limit(4).sort('-createdAt').lean();

    res.json({ success: true, data: { ...post, relatedPosts: related } });
  } catch (err) { next(err); }
};

// @desc   Get blog categories
// @route  GET /api/blog-categories
exports.getBlogCategories = async (req, res, next) => {
  try {
    const categories = await BlogCategory.find({ isActive: true }).sort('order').lean();
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
};

// ---- ADMIN ----
exports.adminGetBlogPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await BlogPost.countDocuments();
    const posts = await BlogPost.find()
      .populate('category', 'name slug')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();
    res.json({ success: true, data: posts, pagination: { page: parseInt(page), total, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
};

exports.createBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) { next(err); }
};

exports.updateBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
};

exports.deleteBlogPost = async (req, res, next) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa bài viết' });
  } catch (err) { next(err); }
};

// Blog Categories CRUD
exports.createBlogCategory = async (req, res, next) => {
  try {
    const cat = await BlogCategory.create(req.body);
    res.status(201).json({ success: true, data: cat });
  } catch (err) { next(err); }
};

exports.updateBlogCategory = async (req, res, next) => {
  try {
    const cat = await BlogCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    res.json({ success: true, data: cat });
  } catch (err) { next(err); }
};

exports.deleteBlogCategory = async (req, res, next) => {
  try {
    await BlogCategory.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa danh mục' });
  } catch (err) { next(err); }
};
