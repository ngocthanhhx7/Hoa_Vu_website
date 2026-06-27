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
import { buildCanonicalPath } from '../../utils/seoContent';
import {
  buildOrganizationSchema,
  buildWebsiteSchema,
  pruneSchema,
} from '../../utils/schema';

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
  prevPath,
  nextPath,
  datePublished,
  dateModified,
}) {
  const location = useLocation();
  const canonicalPath = buildCanonicalPath(path || `${location.pathname}${location.search}`);
  const canonicalUrl = buildCanonicalUrl(canonicalPath);
  const pageTitle = normalizeSeoTitle(title);
  const pageDescription = normalizeSeoDescription(description);
  const pageImage = absoluteUrl(image || BRAND.defaultImage);
  const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';
  const keywordContent = normalizeSeoKeywords(keywords);

  const schemas = [
    buildOrganizationSchema({
      siteUrl: SITE_URL,
      name: BRAND.name,
      logoUrl: absoluteUrl(BRAND.logoFull),
      description: BRAND.seoDescription,
    }),
    buildWebsiteSchema({
      siteUrl: SITE_URL,
      name: BRAND.name,
      description: BRAND.seoDescription,
    }),
    pruneSchema({
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
      datePublished,
      dateModified: dateModified || datePublished || new Date().toISOString().split('T')[0],
    }),
    ...normalizeJsonLd(jsonLd),
  ].filter(Boolean);

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
      {prevPath ? <link rel="prev" href={buildCanonicalUrl(prevPath)} /> : null}
      {nextPath ? <link rel="next" href={buildCanonicalUrl(nextPath)} /> : null}

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

      {datePublished ? <meta property="article:published_time" content={datePublished} /> : null}
      {dateModified ? <meta property="article:modified_time" content={dateModified} /> : null}

      {schemas.map((schema, index) => (
        <script key={`seo-schema-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export default SEO;
