const Page = require('../models/Page');
const SiteSettings = require('../models/SiteSettings');
const Media = require('../models/Media');
const { deleteFile, sanitizeFolder, uploadFile } = require('../services/storageService');

function sanitizeBannerImages(bannerImages = []) {
  return bannerImages
    .filter((banner) => banner && String(banner.url || '').trim())
    .map((banner, index) => ({
      url: String(banner.url).trim(),
      order: Number.isFinite(Number(banner.order)) ? Number(banner.order) : index,
      isActive: banner.isActive !== false,
    }))
    .sort((a, b) => a.order - b.order)
    .map((banner, index) => ({
      ...banner,
      order: index,
    }));
}

// ---- Pages ----
exports.getPageBySlug = async (req, res, next) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!page) return res.status(404).json({ success: false, message: 'Khong tim thay trang' });
    res.json({ success: true, data: page });
  } catch (err) { next(err); }
};

exports.adminGetPages = async (req, res, next) => {
  try {
    const pages = await Page.find().sort('-createdAt').lean();
    res.json({ success: true, data: pages });
  } catch (err) { next(err); }
};

exports.createPage = async (req, res, next) => {
  try {
    const page = await Page.create(req.body);
    res.status(201).json({ success: true, data: page });
  } catch (err) { next(err); }
};

exports.updatePage = async (req, res, next) => {
  try {
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!page) return res.status(404).json({ success: false, message: 'Khong tim thay' });
    res.json({ success: true, data: page });
  } catch (err) { next(err); }
};

exports.deletePage = async (req, res, next) => {
  try {
    await Page.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Da xoa' });
  } catch (err) { next(err); }
};

// ---- Settings ----
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (err) { next(err); }
};

exports.getBanners = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    const banners = sanitizeBannerImages(settings.bannerImages || [])
      .filter((banner) => banner.isActive)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    res.json({ success: true, data: banners });
  } catch (err) { next(err); }
};

exports.adminGetBanners = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    res.json({
      success: true,
      data: sanitizeBannerImages(settings.bannerImages || []),
    });
  } catch (err) { next(err); }
};

exports.updateBanners = async (req, res, next) => {
  try {
    const bannerImages = sanitizeBannerImages(req.body.bannerImages || []);

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ bannerImages });
    } else {
      settings.bannerImages = bannerImages;
      await settings.save();
    }

    res.json({ success: true, data: bannerImages });
  } catch (err) { next(err); }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (Array.isArray(payload.bannerImages)) {
      payload.bannerImages = sanitizeBannerImages(payload.bannerImages);
    }

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(payload);
    } else {
      Object.assign(settings, payload);
      await settings.save();
    }

    res.json({ success: true, data: settings });
  } catch (err) { next(err); }
};

// ---- Media ----
exports.getMedia = async (req, res, next) => {
  try {
    const { folder, page = 1, limit = 30 } = req.query;
    const query = {};
    if (folder) query.folder = sanitizeFolder(folder);

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 30;
    const total = await Media.countDocuments(query);
    const media = await Media.find(query)
      .sort('-createdAt')
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .lean();

    res.json({
      success: true,
      data: media,
      pagination: {
        page: parsedPage,
        total,
        pages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (err) { next(err); }
};

exports.uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Khong co file' });
    }

    const folder = sanitizeFolder(req.query.folder || 'general');
    const uploaded = await uploadFile(req.file, folder);

    const media = await Media.create({
      filename: uploaded.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: uploaded.url,
      folder,
      storageProvider: uploaded.provider,
      storageKey: uploaded.key,
      bucket: uploaded.bucket || '',
      uploadedBy: req.user._id,
      alt: req.body.alt || '',
    });

    res.status(201).json({ success: true, data: media });
  } catch (err) { next(err); }
};

exports.deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: 'Khong tim thay' });

    await deleteFile(media);
    await Media.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Da xoa' });
  } catch (err) { next(err); }
};
