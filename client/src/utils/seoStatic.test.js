import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import test from 'node:test';

const ROOTS = [
  'src/pages/public',
  'src/components/common',
  'src/components/layout',
];

function listJsxFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listJsxFiles(fullPath);
    }
    return fullPath.endsWith('.jsx') ? [fullPath] : [];
  });
}

function publicUiFiles() {
  return ROOTS.flatMap((root) => listJsxFiles(path.resolve(root)));
}

test('public UI images include alt text and icon-only buttons are labelled', () => {
  const failures = [];

  for (const file of publicUiFiles()) {
    const source = fs.readFileSync(file, 'utf8');
    const imagesWithoutAlt = [...source.matchAll(/<img\b[\s\S]*?>/g)]
      .filter((match) => !/\balt=/.test(match[0]));
    const iconButtonsWithoutLabel = [...source.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)]
      .filter((match) => !/\baria-label=/.test(match[1]) && !match[2].replace(/<[^>]*>/g, '').trim());

    if (imagesWithoutAlt.length || iconButtonsWithoutLabel.length) {
      failures.push(`${path.relative(process.cwd(), file)} img:${imagesWithoutAlt.length} iconButton:${iconButtonsWithoutLabel.length}`);
    }
  }

  assert.deepEqual(failures, []);
});

test('public UI source has no common Vietnamese mojibake markers', () => {
  const failures = publicUiFiles().filter((file) => /Ã|Ä|á»|Æ/.test(fs.readFileSync(file, 'utf8')));
  assert.deepEqual(failures.map((file) => path.relative(process.cwd(), file)), []);
});
