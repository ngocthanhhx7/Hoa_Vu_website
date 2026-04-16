const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogCategory', required: true },
  thumbnail: { type: String, default: '' },
  excerpt: { type: String, default: '' },
  htmlContent: { type: String, default: '' },
  author: {
    name: { type: String, default: 'Hoa Vu Team' },
    avatar: { type: String, default: '' },
  },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  seo: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: [{ type: String }],
  },
  viewCount: { type: Number, default: 0 },
  readTime: { type: Number, default: 5 },
}, { timestamps: true });

blogPostSchema.index({ category: 1, createdAt: -1 });
blogPostSchema.index({ isFeatured: 1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);

