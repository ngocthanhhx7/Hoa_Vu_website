import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildBlogPostingSchema,
  buildFaqSchema,
  buildImageObject,
  buildOrganizationSchema,
  pruneSchema,
} from './schema.js';

test('pruneSchema removes empty values deeply', () => {
  assert.deepEqual(pruneSchema({
    name: 'HOAVU',
    empty: '',
    nested: { keep: 'yes', drop: undefined },
    list: ['logo', '', null],
  }), {
    name: 'HOAVU',
    nested: { keep: 'yes' },
    list: ['logo'],
  });
});

test('buildFaqSchema returns null when FAQs are not visible or complete', () => {
  assert.equal(buildFaqSchema([], { visible: true }), null);
  assert.equal(buildFaqSchema([{ question: 'Q', answer: 'A' }], { visible: false }), null);
  assert.deepEqual(buildFaqSchema([{ question: 'Q', answer: 'A' }], { visible: true }), {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [{
      '@type': 'Question',
      name: 'Q',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A',
      },
    }],
  });
});

test('schema builders create complete organization and article image data', () => {
  const organization = buildOrganizationSchema({
    siteUrl: 'https://hoavu.com.vn',
    name: 'HOAVU BRANDING',
    logoUrl: 'https://hoavu.com.vn/logo.png',
  });
  assert.equal(organization.logo.url, 'https://hoavu.com.vn/logo.png');
  assert.equal(organization['@id'], 'https://hoavu.com.vn/#organization');

  const article = buildBlogPostingSchema({
    siteUrl: 'https://hoavu.com.vn',
    path: '/blog/tin-tuc/logo',
    title: 'Bài viết logo',
    description: 'Mô tả bài viết logo',
    image: 'https://hoavu.com.vn/logo.jpg',
    imageAlt: 'Ảnh minh họa bài viết logo',
    authorName: 'Hoa Vu Team',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  });
  assert.equal(article.image.caption, 'Ảnh minh họa bài viết logo');
  assert.equal(article.mainEntityOfPage['@id'], 'https://hoavu.com.vn/blog/tin-tuc/logo');

  assert.deepEqual(buildImageObject('https://hoavu.com.vn/a.jpg', 'Ảnh A'), {
    '@type': 'ImageObject',
    url: 'https://hoavu.com.vn/a.jpg',
    caption: 'Ảnh A',
  });
});
