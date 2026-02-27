import api from "./api";

export const authService = {
    login: (data) => api.post("/auth/login", data),
    register: (data) => api.post("/auth/register", data),
    getProfile: () => api.get("/auth/profile")
};

// Also export individual functions if existing code uses them
export const loginUser = (data) => api.post("/auth/login", data);