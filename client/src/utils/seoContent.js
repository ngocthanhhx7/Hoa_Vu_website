import { BRAND } from '../config/brand.js';

const PAGINATED_PATHS = new Set(['/blog', '/du-an']);

export function stripHtmlContent(value = '') {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildCanonicalPath(rawPath = '/') {
  const value = String(rawPath || '/');
  const [pathname = '/', queryString = ''] = value.split('?');
  const cleanPath = pathname || '/';
  const params = new URLSearchParams(queryString);
  const page = Number(params.get('page') || 1);

  if (PAGINATED_PATHS.has(cleanPath) && page > 1) {
    return `${cleanPath}?page=${page}`;
  }

  return cleanPath;
}

export function buildLogoAlt(companyName = BRAND.name) {
  return `Logo ${companyName || BRAND.name} - dịch vụ thiết kế logo và nhận diện thương hiệu`;
}

export function buildFooterLogoAlt(companyName = BRAND.name) {
  return `Logo ${companyName || BRAND.name} tại chân trang`;
}

export function buildBannerAlt(alt = '') {
  return String(alt || '').trim() || 'Banner dịch vụ thiết kế logo và nhận diện thương hiệu HOAVU';
}

export function buildProjectImageAlt({
  title = 'Dự án thiết kế thương hiệu',
  categoryName = 'thiết kế thương hiệu',
  clientName = '',
  index = 1,
} = {}) {
  const target = clientName ? ` cho ${clientName}` : '';
  return `${title} - ảnh ${index} dự án ${categoryName}${target} bởi HOAVU BRANDING`;
}

export function buildBlogImageAlt(title = '') {
  return `Ảnh minh họa bài viết ${title || 'thiết kế thương hiệu'}`;
}

export function buildServiceCtaLabel(title = '') {
  return `Xem chi tiết dịch vụ ${title || 'thiết kế thương hiệu'}`;
}

export function normalizeFaqs(faqs = []) {
  return (Array.isArray(faqs) ? faqs : [])
    .map((item) => ({
      question: String(item?.question || '').trim(),
      answer: String(item?.answer || '').trim(),
    }))
    .filter((item) => item.question && item.answer);
}

export function summarizeForAi(value = '', limit = 5) {
  return stripHtmlContent(value)
    .split(/(?<=[.!?。])\s+|\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}
