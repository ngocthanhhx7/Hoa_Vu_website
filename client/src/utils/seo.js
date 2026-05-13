import { BRAND, buildTitle } from '../config/brand';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || import.meta.env.VITE_PUBLIC_SITE_URL || BRAND.url || 'https://hoavu.com.vn').replace(/\/+$/, '');

export function buildCanonicalUrl(path = '/') {
  const cleanPath = path || '/';
  if (/^https?:\/\//i.test(cleanPath)) {
    return cleanPath;
  }

  return `${SITE_URL}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
}

export function absoluteUrl(url = '') {
  if (!url) return buildCanonicalUrl(BRAND.defaultImage);
  if (/^https?:\/\//i.test(url)) return url;
  return buildCanonicalUrl(url);
}

export function stripToText(value = '') {
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeSeoTitle(title) {
  if (!title) return BRAND.titleSuffix;
  return /HOA\s?VU|HOAVU/i.test(title) ? title : buildTitle(title);
}

export function normalizeSeoDescription(description) {
  const clean = stripToText(description || BRAND.seoDescription || BRAND.description);
  return clean.length > 170 ? `${clean.slice(0, 167).trim()}...` : clean;
}

export function normalizeSeoKeywords(keywords = []) {
  if (Array.isArray(keywords)) {
    return keywords.filter(Boolean).join(', ');
  }

  return String(keywords || '');
}

export function normalizeJsonLd(jsonLd) {
  if (!jsonLd) return [];
  return Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : [jsonLd];
}
