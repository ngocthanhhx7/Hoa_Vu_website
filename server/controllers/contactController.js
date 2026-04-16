const Contact = require('../models/Contact');

// @desc   Submit contact form (public)
exports.submitContact = async (req, res, next) => {
  try {
    const { name, phone, email, company, service, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên và số điện thoại' });
    }
    const contact = await Contact.create({ name, phone, email, company, service, message });
    res.status(201).json({ success: true, message: 'Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất.', data: { id: contact._id } });
  } catch (err) { next(err); }
};

// ---- ADMIN ----
exports.adminGetContacts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, data: contacts, pagination: { page: parseInt(page), total, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
};

exports.updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    res.json({ success: true, data: contact });
  } catch (err) { next(err); }
};

exports.deleteContact = async (req, res, next) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa' });
  } catch (err) { next(err); }
};

exports.getContactStats = async (req, res, next) => {
  try {
    const total = await Contact.countDocuments();
    const newCount = await Contact.countDocuments({ status: 'new' });
    const contacted = await Contact.countDocuments({ status: 'contacted' });
    const closed = await Contact.countDocuments({ status: 'closed' });
    res.json({ success: true, data: { total, new: newCount, contacted, closed } });
  } catch (err) { next(err); }
};
