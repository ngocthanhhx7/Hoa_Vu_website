const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  bannerImages: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    link: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  }],
  companyName: { type: String, default: 'C\u00d4NG TY TNHH HOA VU VIET NAM' },
  tagline: { type: String, default: 'N\u00e2ng t\u1ea7m th\u01b0\u01a1ng hi\u1ec7u' },
  logo: { type: String, default: '' },
  favicon: { type: String, default: '' },
  address: { type: String, default: '248 Ho\u00e0ng Hoa Th\u00e1m, Ph\u01b0\u1eddng 5, Qu\u1eadn B\u00ecnh Th\u1ea1nh, TP. H\u1ed3 Ch\u00ed Minh' },
  email: { type: String, default: 'info@hoavu.vn' },
  phones: [{
    label: { type: String },
    number: { type: String },
  }],
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    zalo: { type: String, default: '' },
    tiktok: { type: String, default: '' },
  },
  stats: {
    clients: { type: String, default: '20000' },
    countries: { type: String, default: '30+' },
    staff: { type: String, default: '50+' },
    support: { type: String, default: '24/7' },
  },
  theme: {
    primaryColor: { type: String, default: '#D2232A' },
    secondaryColor: { type: String, default: '#FFFFFF' },
    accentColor: { type: String, default: '#FF6B35' },
    fontFamily: { type: String, default: 'Montserrat, sans-serif' },
  },
  footerText: { type: String, default: '' },
  copyright: { type: String, default: '\u00a9 2024 HOA VU. All rights reserved.' },
  chatbotConfig: {
    greeting: { type: String, default: 'Xin ch\u00e0o! T\u00f4i l\u00e0 tr\u1ee3 l\u00fd \u1ea3o c\u1ee7a Hoa Vu. T\u00f4i c\u00f3 th\u1ec3 gi\u00fap b\u1ea1n t\u00ecm hi\u1ec3u v\u1ec1 d\u1ecbch v\u1ee5, b\u00e1o gi\u00e1, ho\u1eb7c \u0111\u1eb7t l\u1ecbch t\u01b0 v\u1ea5n.' },
    quickReplies: [{ type: String }],
    enabled: { type: Boolean, default: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
