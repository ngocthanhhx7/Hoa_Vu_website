import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildCanonicalPath,
  buildLogoAlt,
  buildProjectImageAlt,
  normalizeFaqs,
  summarizeForAi,
} from './seoContent.js';

test('buildCanonicalPath keeps only indexable pagination queries', () => {
  assert.equal(buildCanonicalPath('/du-an?page=2&utm_source=ad'), '/du-an?page=2');
  assert.equal(buildCanonicalPath('/lien-he?utm_source=ad'), '/lien-he');
  assert.equal(buildCanonicalPath('/blog?preview=true&page=1'), '/blog');
});

test('image alt helpers produce specific Vietnamese descriptions', () => {
  assert.equal(
    buildLogoAlt('HOAVU BRANDING'),
    'Logo HOAVU BRANDING - dịch vụ thiết kế logo và nhận diện thương hiệu',
  );
  assert.equal(
    buildProjectImageAlt({
      title: 'Thiết kế logo Am Mây',
      categoryName: 'Thiết kế logo',
      clientName: 'Am Mây',
      index: 2,
    }),
    'Thiết kế logo Am Mây - ảnh 2 dự án Thiết kế logo cho Am Mây bởi HOAVU BRANDING',
  );
});

test('normalizeFaqs keeps only complete visible FAQ items', () => {
  assert.deepEqual(normalizeFaqs([
    { question: 'Có tư vấn trước khi thiết kế không?', answer: 'Có, HOAVU tư vấn trước khi bắt đầu.' },
    { question: 'Thiếu câu trả lời?', answer: '' },
    null,
  ]), [
    { question: 'Có tư vấn trước khi thiết kế không?', answer: 'Có, HOAVU tư vấn trước khi bắt đầu.' },
  ]);
});

test('summarizeForAi returns short useful bullets without html', () => {
  assert.deepEqual(
    summarizeForAi('<p>Thiết kế logo giúp thương hiệu dễ nhận diện.</p><p>Quy trình gồm tư vấn, concept và bàn giao.</p>'),
    [
      'Thiết kế logo giúp thương hiệu dễ nhận diện.',
      'Quy trình gồm tư vấn, concept và bàn giao.',
    ],
  );
});
