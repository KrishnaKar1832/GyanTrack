import api from './axios';

export const internApi = {
  // Get all available tests for intern
  getTests: async () => {
    const response = await api.get('/api/intern/tests');
    return response.data;
  },

  // Get live tests
  getLiveTests: async () => {
    const response = await api.get('/api/intern/tests/live');
    return response.data;
  },

  // Get upcoming tests
  getUpcomingTests: async () => {
    const response = await api.get('/api/intern/tests/upcoming');
    return response.data;
  },

  // Get completed tests
  getCompletedTests: async () => {
    const response = await api.get('/api/intern/tests/completed');
    return response.data;
  },

  // Get test details with questions
  getTestDetails: async (testId) => {
    const response = await api.get(`/api/intern/tests/${testId}`);
    return response.data;
  },

  // Start test attempt
  startTest: async (testId) => {
    const response = await api.post('/api/intern/attempt/start', { testId });
    return response.data;
  },

  // Submit test
  submitTest: async (attemptId, answers) => {
    const response = await api.post('/api/intern/attempt/submit', {
      attemptId,
      answers,
    });
    return response.data;
  },

  // Get test result
  getTestResult: async (attemptId) => {
    const response = await api.get(`/api/intern/result/${attemptId}`);
    return response.data;
  },

  // Get intern's evaluations
  getEvaluations: async () => {
    const response = await api.get('/api/intern/evaluations');
    return response.data;
  },

  // Get evaluation by template
  getEvaluationByTemplate: async (templateId) => {
    const response = await api.get(`/api/intern/evaluations/${templateId}`);
    return response.data;
  },

  // Get intern profile
  getProfile: async () => {
    const response = await api.get('/api/intern/profile');
    return response.data;
  },
};
