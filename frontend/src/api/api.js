
import axios from "axios";

const configuredBaseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: configuredBaseURL
    ? `${configuredBaseURL.replace(/\/+$/, "")}/`
    : "/api/",
  timeout: 300000,
});

api.interceptors.request.use(
  (config) => {
    const url = (config.url || "")
      .replace(/^\/+/, "")
      .split("?")[0]
      .replace(/^api\//, "");

    // Do not attach JWT tokens to public authentication endpoints
    const isPublicAuthEndpoint =
      /^accounts\/(register|login)\/?$/.test(url);

    if (!isPublicAuthEndpoint) {
      const token = localStorage.getItem("access");

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
