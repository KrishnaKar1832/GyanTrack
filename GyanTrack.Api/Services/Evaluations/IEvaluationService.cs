using GyanTrack.Api.DTOs.Evaluations;

namespace GyanTrack.Api.Services.Evaluations
{
    public interface IEvaluationService
    {
        #region Subject
        Task<IEnumerable<SubjectDTO>> GetAllSubjectsAsync();
        Task<SubjectDTO?> GetSubjectByIdAsync(int id);
        Task<SubjectDTO> CreateSubjectAsync(CreateSubjectDTO createDto);
        Task<bool> DeleteSubjectAsync(int id);
        #endregion

        #region Assignment Template
        Task<IEnumerable<AssignmentTemplateDTO>> GetAllTemplatesAsync();
        Task<AssignmentTemplateDTO?> GetTemplateByIdAsync(int id);
        Task<IEnumerable<AssignmentTemplateDTO>> GetTemplatesByEvaluatorAsync(int evaluatorId);
        Task<AssignmentTemplateDTO> CreateTemplateAsync(CreateAssignmentTemplateDTO createDto, int createdBy);
        Task<AssignmentTemplateDTO> UpdateTemplateAsync(UpdateAssignmentTemplateDTO updateDto);
        Task<bool> DeleteTemplateAsync(int id);
        #endregion

        #region Evaluator-Intern Mapping
        Task<IEnumerable<EvaluatorInternDTO>> GetAllMappingsAsync();
        Task<IEnumerable<EvaluatorInternDTO>> GetMappingsByEvaluatorAsync(int evaluatorId);
        Task<IEnumerable<EvaluatorInternDTO>> GetMappingsByInternAsync(int internId);
        Task<EvaluatorInternDTO> CreateMappingAsync(CreateEvaluatorInternDTO createDto);
        Task<bool> DeleteMappingAsync(int id);
        #endregion

        #region Performance Score
        Task<IEnumerable<PerformanceScoreDTO>> GetAllScoresAsync();
        Task<IEnumerable<PerformanceScoreDTO>> GetScoresByInternAsync(int internId);
        Task<IEnumerable<PerformanceScoreDTO>> GetScoresByTemplateAsync(int templateId);
        Task<PerformanceScoreDTO> CreateScoreAsync(CreatePerformanceScoreDTO createDto);
        Task<PerformanceScoreDTO> UpdateScoreAsync(UpdatePerformanceScoreDTO updateDto);
        #endregion

        #region Intern Evaluation
        Task<IEnumerable<PerformanceScoreDTO>> GetEvaluationsByInternAsync(int internId);
        Task<PerformanceScoreDTO?> GetEvaluationByInternAndTemplateAsync(int internId, int templateId);
        Task<InternProfileDTO?> GetInternProfileAsync(int internId);
        #endregion

        #region Performance Metrics
        Task<IEnumerable<DepartmentPerformanceDTO>> GetDepartmentPerformanceAsync(string? department = null, int? subjectId = null);
        Task<InternPerformanceDTO?> GetInternPerformanceAsync(int internId);
        #endregion
    }
}
