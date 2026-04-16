export function normalizePhoneNumber(phone) {
  return phone?.replace(/\s+/g, '') || '';
}

export function formatPhoneDisplay(phone) {
  if (!phone) {
    return '';
  }

  const digits = phone.replace(/\D/g, '');

  if (digits.length === 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }

  return phone;
}

export function formatDate(dateString) {
  if (!dateString) {
    return '';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function stripHtml(html = '') {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function clampText(text = '', maxLength = 180) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
}
