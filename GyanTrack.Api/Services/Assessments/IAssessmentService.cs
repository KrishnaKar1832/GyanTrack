using GyanTrack.Api.DTOs.Assessments;

namespace GyanTrack.Api.Services.Assessments
{
    public interface IAssessmentService
    {
        #region Test
        Task<IEnumerable<TestDTO>> GetAllTestsAsync();
        Task<TestDTO?> GetTestByIdAsync(int id);
        Task<IEnumerable<TestDTO>> GetTestsByTemplateAsync(int templateId);
        Task<IEnumerable<TestDTO>> GetTestsByEvaluatorAsync(int evaluatorId);
        Task<TestDTO> CreateTestAsync(CreateTestDTO createDto, int createdBy);
        Task<TestDTO> UpdateTestAsync(UpdateTestDTO updateDto);
        Task<bool> DeleteTestAsync(int id);
        #endregion

        #region Question
        Task<IEnumerable<QuestionDTO>> GetQuestionsByTestAsync(int testId);
        Task<QuestionDTO?> GetQuestionByIdAsync(int id);
        Task<QuestionDTO> CreateQuestionAsync(CreateQuestionDTO createDto);
        Task<QuestionDTO> UpdateQuestionAsync(UpdateQuestionDTO updateDto);
        Task<bool> DeleteQuestionAsync(int id);
        #endregion

        #region Test Attempt
        Task<TestAttemptDTO?> GetAttemptByIdAsync(int id);
        Task<IEnumerable<TestAttemptDTO>> GetAttemptsByTestAsync(int testId);
        Task<IEnumerable<TestAttemptDTO>> GetAttemptsByInternAsync(int internId);
        Task<TestAttemptDTO> StartTestAsync(StartTestAttemptDTO startDto);
        Task<TestAttemptDTO> SubmitTestAsync(SubmitTestAttemptDTO submitDto);
        #endregion

        #region Test Results
        Task<TestResultDTO?> GetTestResultAsync(int attemptId);
        Task<IEnumerable<InternTestDTO>> GetInternTestsAsync(int internId);
        #endregion
    }
}
