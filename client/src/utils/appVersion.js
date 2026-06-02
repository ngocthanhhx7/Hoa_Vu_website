const VERSION_URL = '/version.json';
const RELOAD_STORAGE_KEY = 'hoavu:last-reload-version';

function getCurrentAppVersion() {
  return import.meta.env?.VITE_HOAVU_BUILD_ID || 'dev';
}

export const CURRENT_APP_VERSION = getCurrentAppVersion();

export async function getRemoteAppVersion({ fetcher = globalThis.fetch, url = VERSION_URL } = {}) {
  if (typeof fetcher !== 'function') {
    return null;
  }

  const response = await fetcher(url, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });

  if (!response?.ok) {
    return null;
  }

  const payload = await response.json();
  return typeof payload?.version === 'string' && payload.version.trim() ? payload.version : null;
}

export async function checkForAppUpdate({
  currentVersion = CURRENT_APP_VERSION,
  fetcher = globalThis.fetch,
  url = VERSION_URL,
} = {}) {
  try {
    const remoteVersion = await getRemoteAppVersion({ fetcher, url });

    return {
      currentVersion,
      remoteVersion,
      hasUpdate: Boolean(remoteVersion && currentVersion && remoteVersion !== currentVersion),
    };
  } catch {
    return {
      currentVersion,
      remoteVersion: null,
      hasUpdate: false,
    };
  }
}

export async function reloadWhenAppVersionChanges({
  currentVersion = CURRENT_APP_VERSION,
  fetcher = globalThis.fetch,
  location = globalThis.location,
  sessionStorage = globalThis.sessionStorage,
  url = VERSION_URL,
  reloadStorageKey = RELOAD_STORAGE_KEY,
} = {}) {
  const status = await checkForAppUpdate({ currentVersion, fetcher, url });

  if (!status.hasUpdate || !location || typeof location.reload !== 'function') {
    return { ...status, reloadTriggered: false };
  }

  const lastReloadedVersion = sessionStorage?.getItem?.(reloadStorageKey);
  if (lastReloadedVersion === status.remoteVersion) {
    return { ...status, reloadTriggered: false };
  }

  sessionStorage?.setItem?.(reloadStorageKey, status.remoteVersion);
  location.reload();
  return { ...status, reloadTriggered: true };
}

export function startAppVersionPolling({
  intervalMs = 60_000,
  initialDelayMs = 5_000,
  ...options
} = {}) {
  if (typeof globalThis.window === 'undefined') {
    return () => {};
  }

  const runCheck = () => {
    reloadWhenAppVersionChanges(options);
  };
  const initialTimer = globalThis.setTimeout(runCheck, initialDelayMs);
  const intervalTimer = globalThis.setInterval(runCheck, intervalMs);

  return () => {
    globalThis.clearTimeout(initialTimer);
    globalThis.clearInterval(intervalTimer);
  };
}
