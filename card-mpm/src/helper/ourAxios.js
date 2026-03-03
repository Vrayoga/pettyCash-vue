import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_BASE_URL_API;
const apiSessionUrl = import.meta.env.VITE_BASE_URL_SESSION;
const apiCbgMSOUrl = import.meta.env.VITE_BASE_URL_API_MSO_CABANG;
const apiSelfUrl = import.meta.env.VITE_BASE_URL_SESSION_API;

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
  timeout: 100000,
});

const apiSession = axios.create({
  baseURL: apiSessionUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 100000,
});
const apiCbgMSO = axios.create({
  baseURL: apiCbgMSOUrl,
  headers: {
    "Content-Type": "application/json",
    // 'Authorization': `Bearer ${token}`, // Kalau pakai token
  },
  timeout: 100000,
  //withCredentials: true,
});
const apiSelf = axios.create({
  baseURL: apiSelfUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export { apiClient, apiSession, apiCbgMSO, apiSelf };



// Basic safety: warn if base URL missing
if (!apiBaseUrl) {
  // eslint-disable-next-line no-console
  console.warn('VITE_BASE_URL_API is not set — API requests will likely fail.');
}


