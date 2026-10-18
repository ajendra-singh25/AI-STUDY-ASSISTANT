
import axios from "axios";

const configuredBaseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: configuredBaseURL
    ? `${configuredBaseURL.replace(/\/+$/, "")}/`
    : "/api/",
  timeout: 120000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
