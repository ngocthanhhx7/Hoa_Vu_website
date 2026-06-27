export const GA_MEASUREMENT_ID = 'G-7VEYCLPTEP';

const GTAG_SCRIPT_SELECTOR = `script[data-ga-measurement-id="${GA_MEASUREMENT_ID}"]`;

function hasBrowserGlobals() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function ensureDataLayer() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args) {
    window.dataLayer.push(args);
  };
}

function appendGtagScript() {
  if (document.querySelector(GTAG_SCRIPT_SELECTOR)) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.dataset.gaMeasurementId = GA_MEASUREMENT_ID;
  document.head.appendChild(script);
}

export function isTrackablePath(path = '') {
  return !String(path || '').startsWith('/admin');
}

export function initGoogleAnalytics() {
  if (!hasBrowserGlobals()) {
    return;
  }

  ensureDataLayer();
  appendGtagScript();

  if (window.__hoavuGaInitialized) {
    return;
  }

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
  window.__hoavuGaInitialized = true;
}

export function trackPageView(path = '/') {
  if (!hasBrowserGlobals() || !isTrackablePath(path)) {
    return;
  }

  ensureDataLayer();
  const normalizedPath = path || '/';
  window.gtag('event', 'page_view', {
    page_path: normalizedPath,
    page_location: `${window.location.origin}${normalizedPath}`,
    page_title: document.title,
  });
}
