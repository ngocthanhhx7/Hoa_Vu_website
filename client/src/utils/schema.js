import { BRAND } from '../config/brand.js';

export function pruneSchema(value) {
  if (Array.isArray(value)) {
    const next = value.map(pruneSchema).filter((item) => {
      if (item === undefined || item === null || item === '') return false;
      if (Array.isArray(item) && item.length === 0) return false;
      if (typeof item === 'object' && Object.keys(item).length === 0) return false;
      return true;
    });
    return next.length ? next : undefined;
  }

  if (value && typeof value === 'object') {
    const next = Object.entries(value).reduce((result, [key, item]) => {
      const clean = pruneSchema(item);
      if (clean !== undefined && clean !== null && clean !== '') {
        result[key] = clean;
      }
      return result;
    }, {});
    return Object.keys(next).length ? next : undefined;
  }

  return value;
}

export function buildImageObject(url, caption) {
  return pruneSchema({
    '@type': 'ImageObject',
    url,
    caption,
  });
}

function absoluteSchemaUrl(siteUrl, value) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `${String(siteUrl || '').replace(/\/+$/, '')}${String(value).startsWith('/') ? value : `/${value}`}`;
}

export function buildOrganizationSchema({
  siteUrl,
  name = BRAND.name,
  logoUrl,
  description = BRAND.seoDescription,
  sameAs = [BRAND.contact.facebook],
} = {}) {
  return pruneSchema({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name,
    alternateName: BRAND.shortName,
    url: siteUrl,
    logo: buildImageObject(absoluteSchemaUrl(siteUrl, logoUrl), `${name} logo`),
    image: absoluteSchemaUrl(siteUrl, logoUrl),
    description,
    sameAs,
    knowsAbout: [
      'Thiết kế logo',
      'Nhận diện thương hiệu',
      'Visual truyền thông',
      'Brand identity design',
      'Branding',
    ],
  });
}

export function buildWebsiteSchema({ siteUrl, name = BRAND.name, description = BRAND.seoDescription } = {}) {
  return pruneSchema({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name,
    alternateName: BRAND.shortName,
    url: siteUrl,
    inLanguage: 'vi-VN',
    description,
    publisher: { '@id': `${siteUrl}/#organization` },
  });
}

export function buildProfessionalServiceSchema({
  siteUrl,
  name = BRAND.name,
  description = BRAND.seoDescription,
  image,
  logo,
  offers = [],
} = {}) {
  return pruneSchema({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}/#localbusiness`,
    name,
    url: siteUrl,
    image: absoluteSchemaUrl(siteUrl, image),
    logo: absoluteSchemaUrl(siteUrl, logo),
    description,
    areaServed: { '@type': 'Country', name: 'Vietnam' },
    priceRange: '$$',
    knowsAbout: ['Thiết kế logo', 'Nhận diện thương hiệu', 'Thiết kế thương hiệu'],
    hasOfferCatalog: offers.length ? {
      '@type': 'OfferCatalog',
      name: 'Dịch vụ thiết kế thương hiệu',
      itemListElement: offers.map((offer, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'Service',
          name: offer.name,
          description: offer.description,
          url: offer.url,
        },
      })),
    } : undefined,
  });
}

export function buildCollectionPageSchema({ siteUrl, path, name, description, items = [] } = {}) {
  return pruneSchema({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteUrl}${path}#collectionpage`,
    name,
    description,
    url: `${siteUrl}${path}`,
    isPartOf: { '@id': `${siteUrl}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: item.url,
        name: item.name,
        description: item.description,
      })),
    },
  });
}

export function buildServiceSchema({
  siteUrl,
  path,
  name,
  description,
  image,
  features = [],
} = {}) {
  return pruneSchema({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl}${path}#service`,
    name,
    description,
    url: `${siteUrl}${path}`,
    image: absoluteSchemaUrl(siteUrl, image),
    provider: { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: BRAND.name },
    areaServed: { '@type': 'Country', name: 'Vietnam' },
    serviceType: name,
    hasOfferCatalog: features.length ? {
      '@type': 'OfferCatalog',
      name: `Hạng mục ${name}`,
      itemListElement: features.map((feature, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: { '@type': 'Service', name: feature },
      })),
    } : undefined,
  });
}

export function buildCreativeWorkSchema({
  siteUrl,
  path,
  name,
  title,
  description,
  images = [],
  dateCreated,
  dateModified,
  category,
  keywords,
  clientName,
} = {}) {
  return pruneSchema({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${siteUrl}${path}#creativework`,
    name: name || title,
    description,
    url: `${siteUrl}${path}`,
    image: images.map((item) => absoluteSchemaUrl(siteUrl, item)).filter(Boolean),
    dateCreated,
    dateModified,
    inLanguage: 'vi-VN',
    creator: { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: BRAND.name },
    genre: category,
    keywords,
    mentions: clientName ? { '@type': 'Organization', name: clientName } : undefined,
  });
}

export function buildBlogPostingSchema({
  siteUrl,
  path,
  title,
  description,
  image,
  imageAlt,
  authorName,
  createdAt,
  datePublished,
  updatedAt,
  dateModified,
  section,
  articleSection,
  keywords,
} = {}) {
  const publishedAt = createdAt || datePublished;
  const modifiedAt = updatedAt || dateModified || publishedAt;

  return pruneSchema({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${siteUrl}${path}#blogposting`,
    headline: title,
    description,
    url: `${siteUrl}${path}`,
    image: image ? buildImageObject(absoluteSchemaUrl(siteUrl, image), imageAlt) : undefined,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    inLanguage: 'vi-VN',
    author: { '@type': 'Person', name: authorName || 'Hoa Vu Team' },
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: BRAND.name,
      logo: buildImageObject(`${siteUrl}/favicon-512x512.png`, `${BRAND.name} logo`),
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}${path}` },
    articleSection: section || articleSection,
    keywords,
  });
}

export function buildFaqSchema(faqs = [], { visible = false } = {}) {
  const items = (Array.isArray(faqs) ? faqs : [])
    .map((item) => ({
      question: String(item?.question || '').trim(),
      answer: String(item?.answer || '').trim(),
    }))
    .filter((item) => item.question && item.answer);

  if (!visible || items.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
