const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, default: '' },
  phone: { type: String, required: true },
  company: { type: String, default: '' },
  service: { type: String, default: '' },
  message: { type: String, default: '' },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'closed'],
    default: 'new',
  },
  notes: { type: String, default: '' },
  assignedTo: { type: String, default: '' },
}, { timestamps: true });

contactSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);
