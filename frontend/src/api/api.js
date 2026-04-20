export const getApiUrl = (endpoint) => {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const cleanBase = base.replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return `${cleanBase}${cleanEndpoint}`;
};