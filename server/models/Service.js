const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
  icon: { type: String, default: '' },
  heroImage: { type: String, default: '' },
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  htmlContent: { type: String, default: '' },
  features: [{ type: String }],
  subServices: [{
    name: { type: String, required: true },
    slug: { type: String },
    description: { type: String, default: '' },
  }],
  seo: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: [{ type: String }],
  },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

serviceSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Service', serviceSchema);

