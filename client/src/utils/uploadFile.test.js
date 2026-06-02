import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  MAX_UPLOAD_BYTES,
  formatBytes,
  prepareUploadFile,
} from './uploadFile.js';

function createFile({ name = 'large.jpg', type = 'image/jpeg', size }) {
  return { name, type, size };
}

test('formatBytes renders readable megabyte values', () => {
  assert.equal(formatBytes(2 * 1024 * 1024), '2 MB');
  assert.equal(formatBytes(2.5 * 1024 * 1024), '2.5 MB');
});

test('prepareUploadFile compresses oversized images before upload', async () => {
  const source = createFile({ size: 4 * 1024 * 1024 });
  const compressed = createFile({ name: 'large-optimized.jpg', size: 900 * 1024 });
  const calls = [];

  const prepared = await prepareUploadFile(source, {
    compressImage: async (file) => {
      calls.push(file);
      return compressed;
    },
  });

  assert.equal(prepared, compressed);
  assert.deepEqual(calls, [source]);
});

test('prepareUploadFile rejects files that are still too large after compression', async () => {
  const source = createFile({ size: 8 * 1024 * 1024 });

  await assert.rejects(
    prepareUploadFile(source, {
      maxBytes: 2 * 1024 * 1024,
      compressImage: async () => createFile({ name: 'still-large.jpg', size: 3 * 1024 * 1024 }),
    }),
    /File still-large\.jpg is 3 MB\. Please use a file under 2 MB\./,
  );
});

test('prepareUploadFile rejects oversized non-image files without compression', async () => {
  const source = createFile({ name: 'deck.pdf', type: 'application/pdf', size: MAX_UPLOAD_BYTES + 1 });

  await assert.rejects(
    prepareUploadFile(source),
    /File deck\.pdf is 3 MB\. Please use a file under 3 MB\./,
  );
});
