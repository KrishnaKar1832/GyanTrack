import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5034/api",
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — log all errors visibly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error — backend is probably down
      console.error(
        `🔴 API Network Error: Cannot reach backend at ${error.config?.url}. Is the backend running on port 5034?`,
        error.message
      );
    } else {
      const { status, data } = error.response;
      console.error(
        `🔴 API Error [${status}] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`,
        data?.message || data || error.message
      );
      if (status === 401) {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;