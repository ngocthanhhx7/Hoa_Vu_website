const BlogCategory = require('../models/BlogCategory');
const BlogPost = require('../models/BlogPost');
const Page = require('../models/Page');
const Project = require('../models/Project');
const Service = require('../models/Service');
const ServiceCategory = require('../models/ServiceCategory');
const config = require('../config/config');

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${config.siteUrl}${normalizedPath}`;
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function buildUrlEntry({ path, lastmod, changefreq = 'weekly', priority = '0.7' }) {
  return [
    '  <url>',
    `    <loc>${escapeXml(buildUrl(path))}</loc>`,
    `    <lastmod>${formatDate(lastmod)}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

exports.getRobots = (req, res) => {
  res.type('text/plain').send([
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /api/',
    '',
    `Sitemap: ${buildUrl('/sitemap.xml')}`,
  ].join('\n'));
};

exports.getSitemap = async (req, res, next) => {
  try {
    const [
      services,
      serviceCategories,
      projects,
      blogCategories,
      posts,
      pages,
    ] = await Promise.all([
      Service.find({ isActive: true }).select('slug updatedAt').lean(),
      ServiceCategory.find({ isActive: true }).select('slug updatedAt').lean(),
      Project.find({ isActive: true }).select('slug category updatedAt').populate('category', 'slug').lean(),
      BlogCategory.find({ isActive: true }).select('slug updatedAt').lean(),
      BlogPost.find({ isActive: true }).select('slug category updatedAt').populate('category', 'slug').lean(),
      Page.find({ isActive: true }).select('slug updatedAt').lean(),
    ]);

    const staticUrls = [
      { path: '/', changefreq: 'weekly', priority: '1.0' },
      { path: '/gioi-thieu', changefreq: 'monthly', priority: '0.8' },
      { path: '/dich-vu', changefreq: 'weekly', priority: '0.9' },
      { path: '/du-an', changefreq: 'weekly', priority: '0.9' },
      { path: '/blog', changefreq: 'weekly', priority: '0.8' },
      { path: '/lien-he', changefreq: 'monthly', priority: '0.8' },
    ];

    const dynamicUrls = [
      ...services.map((service) => ({
        path: `/dich-vu/${service.slug}`,
        lastmod: service.updatedAt,
        changefreq: 'monthly',
        priority: '0.8',
      })),
      ...serviceCategories.map((category) => ({
        path: `/du-an/${category.slug}`,
        lastmod: category.updatedAt,
        changefreq: 'weekly',
        priority: '0.7',
      })),
      ...projects
        .filter((project) => project.category?.slug)
        .map((project) => ({
          path: `/du-an/${project.category.slug}/${project.slug}`,
          lastmod: project.updatedAt,
          changefreq: 'monthly',
          priority: '0.7',
        })),
      ...blogCategories.map((category) => ({
        path: `/blog/${category.slug}`,
        lastmod: category.updatedAt,
        changefreq: 'weekly',
        priority: '0.6',
      })),
      ...posts
        .filter((post) => post.category?.slug)
        .map((post) => ({
          path: `/blog/${post.category.slug}/${post.slug}`,
          lastmod: post.updatedAt,
          changefreq: 'monthly',
          priority: '0.7',
        })),
      ...pages.map((page) => ({
        path: `/chinh-sach/${page.slug}`,
        lastmod: page.updatedAt,
        changefreq: 'yearly',
        priority: '0.4',
      })),
    ];

    const entries = [...staticUrls, ...dynamicUrls].map(buildUrlEntry).join('\n');

    res.type('application/xml').send([
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      entries,
      '</urlset>',
    ].join('\n'));
  } catch (err) {
    next(err);
  }
};
