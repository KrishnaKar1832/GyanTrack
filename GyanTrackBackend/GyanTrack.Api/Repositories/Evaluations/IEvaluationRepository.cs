using GyanTrack.Api.Models.Evaluations;

namespace GyanTrack.Api.Repositories.Evaluations
{
    public interface ISubjectRepository
    {
        Task<Subject?> GetByIdAsync(int id);
        Task<Subject?> GetByNameAsync(string name);
        Task<IEnumerable<Subject>> GetAllAsync();
        Task<Subject> CreateAsync(Subject subject);
        Task<Subject> UpdateAsync(Subject subject);
        Task<bool> DeleteAsync(int id);
    }

    public interface IAssignmentTemplateRepository
    {
        Task<AssignmentTemplate?> GetByIdAsync(int id);
        Task<IEnumerable<AssignmentTemplate>> GetAllAsync();
        Task<IEnumerable<AssignmentTemplate>> GetByEvaluatorIdAsync(int evaluatorId);
        Task<IEnumerable<AssignmentTemplate>> GetBySubjectIdAsync(int subjectId);
        Task<AssignmentTemplate> CreateAsync(AssignmentTemplate template);
        Task<AssignmentTemplate> UpdateAsync(AssignmentTemplate template);
        Task<bool> DeleteAsync(int id);
    }

    public interface IEvaluatorInternRepository
    {
        Task<EvaluatorIntern?> GetByIdAsync(int id);
        Task<IEnumerable<EvaluatorIntern>> GetAllAsync();
        Task<IEnumerable<EvaluatorIntern>> GetByEvaluatorIdAsync(int evaluatorId);
        Task<IEnumerable<EvaluatorIntern>> GetByInternIdAsync(int internId);
        Task<bool> ExistsAsync(int evaluatorId, int internId);
        Task<EvaluatorIntern> CreateAsync(EvaluatorIntern mapping);
        Task<bool> DeleteAsync(int id);
    }

    public interface IPerformanceScoreRepository
    {
        Task<PerformanceScore?> GetByIdAsync(int id);
        Task<IEnumerable<PerformanceScore>> GetAllAsync();
        Task<IEnumerable<PerformanceScore>> GetByInternIdAsync(int internId);
        Task<IEnumerable<PerformanceScore>> GetByTemplateIdAsync(int templateId);
        Task<IEnumerable<PerformanceScore>> GetByEvaluatorIdAsync(int evaluatorId);
        Task<PerformanceScore> CreateAsync(PerformanceScore score);
        Task<PerformanceScore> UpdateAsync(PerformanceScore score);
        Task<bool> DeleteAsync(int id);
    }

    public interface IEvaluatorRemarkRepository
    {
        Task<EvaluatorRemark?> GetByIdAsync(int id);
        Task<IEnumerable<EvaluatorRemark>> GetAllAsync();
        Task<IEnumerable<EvaluatorRemark>> GetByAttemptIdAsync(int attemptId);
        Task<IEnumerable<EvaluatorRemark>> GetByEvaluatorIdAsync(int evaluatorId);
        Task<EvaluatorRemark> CreateAsync(EvaluatorRemark remark);
        Task<EvaluatorRemark> UpdateAsync(EvaluatorRemark remark);
        Task<bool> DeleteAsync(int id);
    }
}
