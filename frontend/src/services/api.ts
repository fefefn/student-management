import axios from "axios";
import { TOKEN_KEY } from "../utils/constants";

export const AUTH_LOGOUT_EVENT = "auth:logout";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  timeout: 15000,
});

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If a stored token is rejected (expired/invalid), clear it and tell the app to log out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
    }
    return Promise.reject(error);
  }
);
