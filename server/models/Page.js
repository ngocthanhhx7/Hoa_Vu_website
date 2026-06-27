const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  htmlContent: { type: String, default: '' },
  seo: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: [{ type: String }],
    canonicalPath: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    imageAlt: { type: String, default: '' },
    noindex: { type: Boolean, default: false },
    aiSummary: { type: String, default: '' },
    primaryKeyword: { type: String, default: '' },
    secondaryKeywords: [{ type: String }],
    faqs: [{
      question: { type: String, default: '' },
      answer: { type: String, default: '' },
    }],
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });


module.exports = mongoose.model('Page', pageSchema);

