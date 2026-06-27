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

function buildMediaUrl(value = '') {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  return buildUrl(raw.startsWith('/') ? raw : `/uploads/${raw}`);
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function buildImageEntry(image = {}) {
  const loc = buildMediaUrl(image.loc || image.url);
  if (!loc) return '';

  return [
    '    <image:image>',
    `      <image:loc>${escapeXml(loc)}</image:loc>`,
    image.title ? `      <image:title>${escapeXml(image.title)}</image:title>` : '',
    image.caption ? `      <image:caption>${escapeXml(image.caption)}</image:caption>` : '',
    '    </image:image>',
  ].filter(Boolean).join('\n');
}

function buildUrlEntry({ path, lastmod, changefreq = 'weekly', priority = '0.7', images = [] }) {
  const imageEntries = images.map(buildImageEntry).filter(Boolean);
  return [
    '  <url>',
    `    <loc>${escapeXml(buildUrl(path))}</loc>`,
    `    <lastmod>${formatDate(lastmod)}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    ...imageEntries,
    '  </url>',
  ].join('\n');
}

function normalizeImageList(...groups) {
  return groups
    .flatMap((group) => Array.isArray(group) ? group : [group])
    .map((item) => {
      if (!item) return '';
      if (typeof item === 'string') return item;
      return item.url || item.loc || '';
    })
    .filter(Boolean)
    .filter((item, index, collection) => collection.indexOf(item) === index);
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
      Service.find({ isActive: true }).select('slug title heroImage heroImageAlt updatedAt').lean(),
      ServiceCategory.find({ isActive: true }).select('slug updatedAt').lean(),
      Project.find({ isActive: true }).select('slug title category thumbnail thumbnailAlt images updatedAt').populate('category', 'slug name').lean(),
      BlogCategory.find({ isActive: true }).select('slug updatedAt').lean(),
      BlogPost.find({ isActive: true }).select('slug title category thumbnail thumbnailAlt updatedAt').populate('category', 'slug').lean(),
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
        images: normalizeImageList(service.heroImage).map((url) => ({
          url,
          title: service.heroImageAlt || service.title,
          caption: `Dịch vụ ${service.title} của HOAVU BRANDING`,
        })),
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
          images: normalizeImageList(project.thumbnail, project.images).map((url, index) => ({
            url,
            title: index === 0 ? (project.thumbnailAlt || project.title) : `${project.title} - ảnh ${index + 1}`,
            caption: `Dự án ${project.title}${project.category?.name ? ` thuộc ${project.category.name}` : ''}`,
          })),
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
          images: normalizeImageList(post.thumbnail).map((url) => ({
            url,
            title: post.thumbnailAlt || post.title,
            caption: `Ảnh minh họa bài viết ${post.title}`,
          })),
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
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
      entries,
      '</urlset>',
    ].join('\n'));
  } catch (err) {
    next(err);
  }
};
