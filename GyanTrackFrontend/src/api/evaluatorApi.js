import api from './axios';

export const evaluatorApi = {
  // Templates assigned to evaluator
  getAssignedTemplates: async () => {
    const response = await api.get('/api/evaluator/templates');
    return response.data;
  },

  // Tests created by evaluator
  getCreatedTests: async () => {
    const response = await api.get('/api/evaluator/tests');
    return response.data;
  },

  // Create Test
  createTest: async (testData) => {
    const response = await api.post('/api/evaluator/tests', testData);
    return response.data;
  },

  // Update Test
  updateTest: async (testData) => {
    const response = await api.put('/api/evaluator/tests', testData);
    return response.data;
  },

  // Delete Test
  deleteTest: async (id) => {
    const response = await api.delete(`/api/evaluator/tests/${id}`);
    return response.data;
  },

  // Get Test Details with Questions
  getTestDetails: async (testId) => {
    const response = await api.get(`/api/evaluator/tests/${testId}`);
    return response.data;
  },

  // Create Question
  createQuestion: async (questionData) => {
    const response = await api.post('/api/evaluator/questions', questionData);
    return response.data;
  },

  // Update Question
  updateQuestion: async (questionData) => {
    const response = await api.put('/api/evaluator/questions', questionData);
    return response.data;
  },

  // Delete Question
  deleteQuestion: async (id) => {
    const response = await api.delete(`/api/evaluator/questions/${id}`);
    return response.data;
  },

  // Get All Test Attempts for evaluator's tests
  getTestAttempts: async () => {
    const response = await api.get('/api/evaluator/attempts');
    return response.data;
  },

  // Get Detailed Test Result
  getTestResult: async (attemptId) => {
    const response = await api.get(`/api/evaluator/attempts/${attemptId}/detailed`);
    return response.data;
  },

  // Submit Evaluator Remark
  submitRemark: async (remarkData) => {
    const response = await api.post('/api/evaluator/remarks', remarkData);
    return response.data;
  },

  // Update Evaluator Remark
  updateRemark: async (remarkData) => {
    const response = await api.put('/api/evaluator/remarks', remarkData);
    return response.data;
  },

  // Get Intern Performance
  getInternPerformance: async (internId) => {
    const response = await api.get(`/api/evaluator/performance/intern/${internId}`);
    return response.data;
  },

  // Get Department Performance
  getDepartmentPerformance: async () => {
    const response = await api.get('/api/evaluator/performance/department');
    return response.data;
  },
};
