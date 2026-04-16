export function getServerOrigin() {
  const apiBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:9999/api';
  return apiBase.replace(/\/api\/?$/, '');
}

export function resolveMediaUrl(rawUrl) {
  if (!rawUrl) return '';

  const value = String(rawUrl).trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  const serverOrigin = getServerOrigin();

  if (value.startsWith('/uploads/')) return `${serverOrigin}${value}`;
  if (value.startsWith('uploads/')) return `${serverOrigin}/${value}`;
  if (value.startsWith('/')) return value;

  return `${serverOrigin}/uploads/${value}`;
}

export function normalizeMediaList(...groups) {
  return groups
    .flatMap((group) => {
      if (Array.isArray(group)) return group;
      return String(group || '').split(/\n|,/);
    })
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .filter((item, index, collection) => collection.indexOf(item) === index);
}

