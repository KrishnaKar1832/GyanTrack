import api from "./api";

// Matches InternController.cs routes
export const internService = {
    // Live tests available to this intern
    getLiveTests: () => api.get("/intern/tests/live"),

    // All tests (live, upcoming, completed)
    getAllTests: () => api.get("/intern/tests"),

    // Get a specific test with questions (for taking the test)
    getTestWithQuestions: (testId) => api.get(`/intern/tests/${testId}/questions`),

    // Start a test attempt: { testId, internId }
    startAttempt: (data) => api.post("/intern/attempts/start", data),

    // Submit a completed attempt: { attemptId, answers: [{questionId, selectedOptionId}] }
    submitAttempt: (data) => api.post("/intern/attempts/submit", data),

    // Get result for an attempt
    getAttemptResult: (attemptId) => api.get(`/intern/attempts/${attemptId}/result`),

    // Get all attempts for this intern
    getMyAttempts: () => api.get("/intern/attempts"),

    // Get this intern's profile (assigned evaluators, dept, batch)
    getProfile: () => api.get("/intern/profile"),

    // Get this intern's performance
    getPerformance: () => api.get("/intern/performance"),
};