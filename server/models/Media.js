const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  thumbnailUrl: { type: String, default: '' },
  alt: { type: String, default: '' },
  folder: { type: String, default: 'general' },
  storageProvider: { type: String, enum: ['local', 's3'], default: 'local' },
  storageKey: { type: String, default: '' },
  bucket: { type: String, default: '' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

mediaSchema.index({ folder: 1, createdAt: -1 });

module.exports = mongoose.model('Media', mediaSchema);
