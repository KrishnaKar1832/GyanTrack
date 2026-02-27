import api from "./api";

// Matches InternController.cs
export const internService = {
    // Tests
    getAllTests: () => api.get("/intern/tests"),
    getLiveTests: () => api.get("/intern/tests/live"),
    getUpcomingTests: () => api.get("/intern/tests/upcoming"),
    getPreviousTests: () => api.get("/intern/tests/previous"),
    getTestById: (testId) => api.get(`/intern/tests/${testId}`),
    getTestQuestions: (testId) => api.get(`/intern/tests/${testId}/questions`),

    startTest: (testId) => api.post(`/intern/tests/${testId}/start`),
    submitTest: (testId, data) => api.post(`/intern/tests/${testId}/submit`, data),

    // Results & Evaluations
    getMyResults: () => api.get("/intern/results"),
    getTestResult: (attemptId) => api.get(`/intern/results/${attemptId}`),
    getTestResultByTestId: (testId) => api.get(`/intern/tests/${testId}/result`),

    getMyEvaluations: () => api.get("/intern/evaluations"),
    getMyEvaluationByTemplate: (templateId) => api.get(`/intern/evaluations/${templateId}`),

    // Profile
    getMyProfile: () => api.get("/intern/profile")
};