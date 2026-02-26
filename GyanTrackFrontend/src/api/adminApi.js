import api from './axios';

export const adminApi = {
  // Subject Management
  getSubjects: async () => {
    const response = await api.get('/api/admin/subjects');
    return response.data;
  },

  createSubject: async (subjectData) => {
    const response = await api.post('/api/admin/subjects', subjectData);
    return response.data;
  },

  deleteSubject: async (id) => {
    const response = await api.delete(`/api/admin/subjects/${id}`);
    return response.data;
  },

  // Template Management
  getTemplates: async () => {
    const response = await api.get('/api/admin/templates');
    return response.data;
  },

  createTemplate: async (templateData) => {
    const response = await api.post('/api/admin/templates', templateData);
    return response.data;
  },

  updateTemplate: async (templateData) => {
    const response = await api.put('/api/admin/templates', templateData);
    return response.data;
  },

  deleteTemplate: async (id) => {
    const response = await api.delete(`/api/admin/templates/${id}`);
    return response.data;
  },

  // Evaluator-Intern Mapping
  getMappings: async () => {
    const response = await api.get('/api/admin/mappings');
    return response.data;
  },

  createMapping: async (mappingData) => {
    const response = await api.post('/api/admin/mappings', mappingData);
    return response.data;
  },

  deleteMapping: async (id) => {
    const response = await api.delete(`/api/admin/mappings/${id}`);
    return response.data;
  },

  // Performance Scores
  getScores: async () => {
    const response = await api.get('/api/admin/scores');
    return response.data;
  },

  createScore: async (scoreData) => {
    const response = await api.post('/api/admin/scores', scoreData);
    return response.data;
  },

  updateScore: async (scoreData) => {
    const response = await api.put('/api/admin/scores', scoreData);
    return response.data;
  },

  // Performance Analytics
  getDepartmentPerformance: async (department, subjectId) => {
    const params = {};
    if (department) params.department = department;
    if (subjectId) params.subjectId = subjectId;
    const response = await api.get('/api/admin/performance/department', { params });
    return response.data;
  },

  getInternPerformance: async (internId) => {
    const response = await api.get(`/api/admin/performance/intern/${internId}`);
    return response.data;
  },

  // Evaluators
  getEvaluators: async () => {
    const response = await api.get('/api/admin/evaluators');
    return response.data;
  },

  // Interns
  getInterns: async () => {
    const response = await api.get('/api/admin/interns');
    return response.data;
  },
};
