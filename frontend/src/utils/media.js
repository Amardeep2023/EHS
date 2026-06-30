export const resolveMediaUrl = (value) => {
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value;
  }

  if (value.startsWith('/uploads')) {
    const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
    return apiBase.startsWith('http') ? `${apiBase}${value}` : `${window.location.origin}${value}`;
  }

  return value;
};
