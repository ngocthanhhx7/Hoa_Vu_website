const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadSeoControllerInternals() {
  const sourcePath = path.join(__dirname, 'seoController.js');
  const source = fs.readFileSync(sourcePath, 'utf8');
  const sandbox = {
    module: { exports: {} },
    exports: {},
    require(request) {
      if (request === '../config/config') {
        return { siteUrl: 'https://hoavu.com.vn' };
      }
      return {};
    },
  };

  vm.runInNewContext(`${source}\nmodule.exports.__test = { buildUrlEntry, escapeXml };`, sandbox, { filename: sourcePath });
  return sandbox.module.exports.__test;
}

test('buildUrlEntry includes escaped image sitemap metadata', () => {
  const { buildUrlEntry } = loadSeoControllerInternals();

  const entry = buildUrlEntry({
    path: '/du-an/logo-am-may',
    lastmod: '2026-01-02T00:00:00.000Z',
    images: [{
      loc: 'https://hoavu.com.vn/uploads/projects/am-may.jpg',
      title: 'Logo Am Mây & nhận diện',
      caption: 'Dự án thiết kế logo Am Mây <F&B>',
    }],
  });

  assert.match(entry, /<image:image>/);
  assert.match(entry, /<image:loc>https:\/\/hoavu.com.vn\/uploads\/projects\/am-may.jpg<\/image:loc>/);
  assert.match(entry, /Logo Am Mây &amp; nhận diện/);
  assert.match(entry, /Dự án thiết kế logo Am Mây &lt;F&amp;B&gt;/);
});
