import api from "./api";

// Matches EvaluatorController.cs
export const evaluatorService = {
    // Templates
    getAssignedTemplates: () => api.get("/evaluator/templates"),

    // Tests
    getCreatedTests: () => api.get("/evaluator/tests"),
    getTestById: (id) => api.get(`/evaluator/tests/${id}`),
    createTest: (data) => api.post("/evaluator/tests", data),
    updateTest: (data) => api.put("/evaluator/tests", data),
    deleteTest: (id) => api.delete(`/evaluator/tests/${id}`),

    // Questions
    getTestQuestions: (testId) => api.get(`/evaluator/tests/${testId}/questions`),
    getQuestionById: (id) => api.get(`/evaluator/questions/${id}`),
    createQuestion: (data) => api.post("/evaluator/questions", data),
    updateQuestion: (data) => api.put("/evaluator/questions", data),
    deleteQuestion: (id) => api.delete(`/evaluator/questions/${id}`),

    // Attempts
    getTestAttempts: (testId) => api.get(`/evaluator/tests/${testId}/attempts`),
    getAttemptDetails: (attemptId) => api.get(`/evaluator/attempts/${attemptId}`),
    getDetailedAttempt: (attemptId) => api.get(`/evaluator/attempts/${attemptId}/detailed`),

    // Performance
    getInternPerformance: (internId) => api.get(`/evaluator/performance/intern/${internId}`),
    getDepartmentPerformance: () => api.get("/evaluator/performance/department")
};