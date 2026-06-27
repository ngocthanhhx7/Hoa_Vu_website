import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import {
  GA_MEASUREMENT_ID,
  initGoogleAnalytics,
  trackPageView,
} from './analytics.js';

function createDocumentStub() {
  const scripts = [];

  return {
    title: 'Hoa Vu Test Page',
    head: {
      appendChild(element) {
        scripts.push(element);
      },
    },
    createElement(tagName) {
      return { tagName, dataset: {} };
    },
    querySelector(selector) {
      if (selector === `script[data-ga-measurement-id="${GA_MEASUREMENT_ID}"]`) {
        return scripts.find((script) => script.dataset?.gaMeasurementId === GA_MEASUREMENT_ID) || null;
      }
      return null;
    },
    scripts,
  };
}

beforeEach(() => {
  globalThis.window = {
    dataLayer: [],
    location: {
      origin: 'https://hoavu.com.vn',
    },
  };
  globalThis.document = createDocumentStub();
});

afterEach(() => {
  delete globalThis.window;
  delete globalThis.document;
});

test('initGoogleAnalytics injects the gtag script once and disables automatic page views', () => {
  initGoogleAnalytics();
  initGoogleAnalytics();

  assert.equal(document.scripts.length, 1);
  assert.equal(document.scripts[0].async, true);
  assert.equal(document.scripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
  assert.deepEqual(window.dataLayer[1], [
    'config',
    GA_MEASUREMENT_ID,
    { send_page_view: false },
  ]);
});

test('trackPageView sends a page_view event for public routes', () => {
  initGoogleAnalytics();

  trackPageView('/lien-he?source=nav');

  assert.deepEqual(window.dataLayer.at(-1), [
    'event',
    'page_view',
    {
      page_path: '/lien-he?source=nav',
      page_location: 'https://hoavu.com.vn/lien-he?source=nav',
      page_title: 'Hoa Vu Test Page',
    },
  ]);
});

test('trackPageView skips admin routes', () => {
  initGoogleAnalytics();
  const beforeCount = window.dataLayer.length;

  trackPageView('/admin/dashboard');

  assert.equal(window.dataLayer.length, beforeCount);
});
