const RAILWAY_BACKEND_URL = 'https://zomato-production-98af.up.railway.app';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : RAILWAY_BACKEND_URL);

export default API_BASE_URL;
