import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { BRAND } from '../../config/brand';
import {
  SITE_URL,
  absoluteUrl,
  buildCanonicalUrl,
  normalizeJsonLd,
  normalizeSeoDescription,
  normalizeSeoKeywords,
  normalizeSeoTitle,
} from '../../utils/seo';

function SEO({
  title,
  description,
  path,
  image,
  imageAlt,
  type = 'website',
  keywords,
  noindex = false,
  jsonLd,
  breadcrumbItems,
}) {
  const location = useLocation();
  const canonicalPath = path || `${location.pathname}${location.search}`;
  const canonicalUrl = buildCanonicalUrl(canonicalPath);
  const pageTitle = normalizeSeoTitle(title);
  const pageDescription = normalizeSeoDescription(description);
  const pageImage = absoluteUrl(image || BRAND.defaultImage);
  const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';
  const keywordContent = normalizeSeoKeywords(keywords);

  const schemas = [
    // ── Organization ──
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: BRAND.name,
      alternateName: BRAND.shortName,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(BRAND.logoFull),
        width: 512,
        height: 512,
      },
      image: absoluteUrl(BRAND.defaultImage),
      description: BRAND.seoDescription,
      foundingDate: '2020',
      areaServed: {
        '@type': 'Country',
        name: 'Vietnam',
      },
      serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 10.7769,
          longitude: 106.7009,
        },
      },
      sameAs: [
        BRAND.contact.facebook,
      ].filter(Boolean),
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        url: BRAND.contact.messenger,
        availableLanguage: ['Vietnamese'],
      },
      knowsAbout: [
        'Thiết kế logo',
        'Nhận diện thương hiệu',
        'Visual truyền thông',
        'Branding',
        'Graphic design',
      ],
    },

    // ── WebSite with SearchAction ──
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: BRAND.name,
      alternateName: BRAND.shortName,
      url: SITE_URL,
      inLanguage: 'vi-VN',
      description: BRAND.seoDescription,
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },

    // ── WebPage for current page ──
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: pageTitle,
      description: pageDescription,
      inLanguage: 'vi-VN',
      isPartOf: {
        '@id': `${SITE_URL}/#website`,
      },
      about: {
        '@id': `${SITE_URL}/#organization`,
      },
      image: pageImage,
      dateModified: new Date().toISOString().split('T')[0],
    },

    // ── Custom schemas from pages ──
    ...normalizeJsonLd(jsonLd),
  ];

  // ── BreadcrumbList schema ──
  if (breadcrumbItems && breadcrumbItems.length > 0) {
    const breadcrumbListItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: SITE_URL,
      },
      ...breadcrumbItems.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: crumb.label,
        ...(crumb.to ? { item: buildCanonicalUrl(crumb.to) } : {}),
      })),
    ];

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbListItems,
    });
  }

  return (
    <Helmet htmlAttributes={{ lang: 'vi' }}>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      {keywordContent ? <meta name="keywords" content={keywordContent} /> : null}
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:locale" content="vi_VN" />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={BRAND.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:alt" content={imageAlt || BRAND.name} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {schemas.map((schema, index) => (
        <script key={`seo-schema-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export default SEO;
