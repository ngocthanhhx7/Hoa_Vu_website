const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
  thumbnail: { type: String, default: '' },
  images: [{ type: String }],
  description: { type: String, default: '' },
  htmlContent: { type: String, default: '' },
  client: {
    name: { type: String, default: '' },
    industry: { type: String, default: '' },
  },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  seo: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: [{ type: String }],
  },
  order: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
}, { timestamps: true });

projectSchema.index({ category: 1, createdAt: -1 });
projectSchema.index({ isFeatured: 1, order: 1 });

module.exports = mongoose.model('Project', projectSchema);

