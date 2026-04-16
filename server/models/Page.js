const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  htmlContent: { type: String, default: '' },
  seo: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: [{ type: String }],
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });


module.exports = mongoose.model('Page', pageSchema);

