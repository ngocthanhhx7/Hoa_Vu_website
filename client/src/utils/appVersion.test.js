import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  checkForAppUpdate,
  getRemoteAppVersion,
  reloadWhenAppVersionChanges,
} from './appVersion.js';

function createResponse(body, ok = true) {
  return {
    ok,
    async json() {
      return body;
    },
  };
}

test('getRemoteAppVersion fetches version.json without browser cache', async () => {
  const calls = [];
  const fetcher = async (...args) => {
    calls.push(args);
    return createResponse({ version: 'build-2' });
  };

  const version = await getRemoteAppVersion({ fetcher });

  assert.equal(version, 'build-2');
  assert.equal(calls[0][0], '/version.json');
  assert.equal(calls[0][1].cache, 'no-store');
  assert.equal(calls[0][1].headers['Cache-Control'], 'no-cache');
});

test('checkForAppUpdate reports update only when remote version differs', async () => {
  const same = await checkForAppUpdate({
    currentVersion: 'build-1',
    fetcher: async () => createResponse({ version: 'build-1' }),
  });
  const changed = await checkForAppUpdate({
    currentVersion: 'build-1',
    fetcher: async () => createResponse({ version: 'build-2' }),
  });

  assert.equal(same.hasUpdate, false);
  assert.equal(changed.hasUpdate, true);
  assert.equal(changed.remoteVersion, 'build-2');
});

test('reloadWhenAppVersionChanges reloads once per remote version', async () => {
  const storage = new Map();
  const location = { reloadCount: 0, reload() { this.reloadCount += 1; } };
  const sessionStorage = {
    getItem(key) {
      return storage.get(key) || null;
    },
    setItem(key, value) {
      storage.set(key, value);
    },
  };
  const fetcher = async () => createResponse({ version: 'build-2' });

  const first = await reloadWhenAppVersionChanges({
    currentVersion: 'build-1',
    fetcher,
    location,
    sessionStorage,
  });
  const second = await reloadWhenAppVersionChanges({
    currentVersion: 'build-1',
    fetcher,
    location,
    sessionStorage,
  });

  assert.equal(first.reloadTriggered, true);
  assert.equal(second.reloadTriggered, false);
  assert.equal(location.reloadCount, 1);
});
