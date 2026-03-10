using GyanTrack.Api.Models.Assessments;

namespace GyanTrack.Api.Repositories.Assessments
{
    public interface ITestRepository
    {
        Task<Test?> GetByIdAsync(int id);
        Task<IEnumerable<Test>> GetAllAsync();
        Task<IEnumerable<Test>> GetByTemplateIdAsync(int templateId);
        Task<IEnumerable<Test>> GetByEvaluatorIdAsync(int evaluatorId);
        Task<Test> CreateAsync(Test test);
        Task<Test> UpdateAsync(Test test);
        Task<bool> DeleteAsync(int id);
    }

    public interface IQuestionRepository
    {
        Task<Question?> GetByIdAsync(int id);
        Task<IEnumerable<Question>> GetAllAsync();
        Task<IEnumerable<Question>> GetByTestIdAsync(int testId);
        Task<Question> CreateAsync(Question question);
        Task<Question> UpdateAsync(Question question);
        Task<bool> DeleteAsync(int id);
    }

    public interface IOptionRepository
    {
        Task<Option?> GetByIdAsync(int id);
        Task<IEnumerable<Option>> GetAllAsync();
        Task<IEnumerable<Option>> GetByQuestionIdAsync(int questionId);
        Task<Option> CreateAsync(Option option);
        Task<Option> UpdateAsync(Option option);
        Task<bool> DeleteAsync(int id);
    }

    public interface ITestAttemptRepository
    {
        Task<TestAttempt?> GetByIdAsync(int id);
        Task<IEnumerable<TestAttempt>> GetAllAsync();
        Task<IEnumerable<TestAttempt>> GetByTestIdAsync(int testId);
        Task<IEnumerable<TestAttempt>> GetByInternIdAsync(int internId);
        Task<TestAttempt?> GetActiveAttemptAsync(int internId, int testId);
        Task<IEnumerable<TestAttempt>> GetPendingVerificationsByEvaluatorAsync(int evaluatorId);
        Task<IEnumerable<TestAttempt>> GetPendingHRVerificationsAsync();
        Task<TestAttempt> CreateAsync(TestAttempt attempt);
        Task<TestAttempt> UpdateAsync(TestAttempt attempt);
        Task<bool> DeleteAsync(int id);
    }

    public interface IAnswerRepository
    {
        Task<Answer?> GetByIdAsync(int id);
        Task<IEnumerable<Answer>> GetAllAsync();
        Task<IEnumerable<Answer>> GetByAttemptIdAsync(int attemptId);
        Task<IEnumerable<Answer>> GetByQuestionIdAsync(int questionId);
        Task<Answer> CreateAsync(Answer answer);
        Task<Answer> UpdateAsync(Answer answer);
        Task<bool> DeleteAsync(int id);
    }
}
