const getApiBase = () => {
  // If running on Vercel and VITE_API_BASE_URL is defined, use it.
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // For Vercel production: 
    if (hostname.includes('vercel.app')) {
       // If no environment variable is set, it assumes the API is at /api
       return `https://${hostname}`; 
    }
    // Local Access (Laptop or Mobile on the same LAN)
    return `http://${hostname}:3001`;
  }
  return 'http://localhost:3001';
};

export const API_BASE = getApiBase();
