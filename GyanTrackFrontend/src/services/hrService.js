import api from "./api";

// Matches AdminController.cs
export const hrService = {
    // Subjects
    getAllSubjects: () => api.get("/admin/subjects"),
    createSubject: (data) => api.post("/admin/subjects", data),
    deleteSubject: (id) => api.delete(`/admin/subjects/${id}`),

    // Templates
    getAllTemplates: () => api.get("/admin/templates"),
    getTemplateById: (id) => api.get(`/admin/templates/${id}`),
    createTemplate: (data) => api.post("/admin/templates", data),
    updateTemplate: (data) => api.put("/admin/templates", data),
    deleteTemplate: (id) => api.delete(`/admin/templates/${id}`),

    // Mappings
    getAllMappings: () => api.get("/admin/mappings"),
    createMapping: (data) => api.post("/admin/mappings", data),
    deleteMapping: (id) => api.delete(`/admin/mappings/${id}`),

    // Scores
    getAllScores: () => api.get("/admin/scores"),
    getInternScores: (internId) => api.get(`/admin/scores/intern/${internId}`),
    createScore: (data) => api.post("/admin/scores", data),
    updateScore: (data) => api.put("/admin/scores", data),

    // Analytics
    getDepartmentPerformance: (dept, subjectId) =>
        api.get("/admin/performance/department", { params: { department: dept, subjectId } }),
    getInternPerformance: (internId) => api.get(`/admin/performance/intern/${internId}`),

    // Dashboard mock - replacing previous single endpoint
    getHRDashboardStats: () => api.get("/admin/performance/department")
};