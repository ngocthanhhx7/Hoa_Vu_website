const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadPageControllerInternals() {
  const sourcePath = path.join(__dirname, 'pageController.js');
  const source = fs.readFileSync(sourcePath, 'utf8');
  const sandbox = {
    module: { exports: {} },
    exports: {},
    require(request) {
      if (request === '../config/config') {
        return { aws: { isConfigured: false } };
      }
      return {};
    },
  };

  vm.runInNewContext(`${source}\nmodule.exports.__test = { sanitizeBannerImages };`, sandbox, { filename: sourcePath });
  return sandbox.module.exports.__test;
}

test('sanitizeBannerImages keeps banner metadata while normalizing order', () => {
  const { sanitizeBannerImages } = loadPageControllerInternals();

  const result = sanitizeBannerImages([
    { url: '/uploads/banner-b.jpg', alt: 'Banner B', link: '/b', order: 10, isActive: false },
    { url: '/uploads/banner-a.jpg', alt: 'Banner A', link: '/a', order: 2 },
  ]);

  assert.deepEqual(JSON.parse(JSON.stringify(result)), [
    { url: '/uploads/banner-a.jpg', alt: 'Banner A', link: '/a', order: 0, isActive: true },
    { url: '/uploads/banner-b.jpg', alt: 'Banner B', link: '/b', order: 1, isActive: false },
  ]);
});
