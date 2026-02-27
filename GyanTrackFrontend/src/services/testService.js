import api from "./api";

export const submitTest = (data) => api.post("/test/submit", data);