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
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: BRAND.name,
      url: SITE_URL,
      logo: absoluteUrl(BRAND.favicon),
      sameAs: [BRAND.contact.facebook].filter(Boolean),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: BRAND.name,
      alternateName: BRAND.shortName,
      url: SITE_URL,
      inLanguage: 'vi-VN',
      publisher: {
        '@type': 'Organization',
        name: BRAND.name,
      },
    },
    ...normalizeJsonLd(jsonLd),
  ];

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
