namespace GyanTrack.Api.DTOs.Assessments
{
    #region Test DTOs

    public class TestDTO
    {
        public int Id { get; set; }
        public int TemplateId { get; set; }
        public string TemplateName { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int DurationMinutes { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedByName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsLive { get; set; }
        public int TotalQuestions { get; set; }
    }

    public class CreateTestDTO
    {
        public int TemplateId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int DurationMinutes { get; set; }
    }

    public class UpdateTestDTO
    {
        public int Id { get; set; }
        public int TemplateId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int DurationMinutes { get; set; }
    }

    #endregion

    #region Question DTOs

    public class QuestionDTO
    {
        public int Id { get; set; }
        public int TestId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public int Marks { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsDeleted { get; set; }
        public List<OptionDTO> Options { get; set; } = new();
    }

    public class CreateQuestionDTO
    {
        public int TestId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public int Marks { get; set; }
        public List<CreateOptionDTO> Options { get; set; } = new();
    }

    public class UpdateQuestionDTO
    {
        public int Id { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public int Marks { get; set; }
    }

    #endregion

    #region Option DTOs

    public class OptionDTO
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public string OptionText { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }

    public class CreateOptionDTO
    {
        public string OptionText { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }

    public class UpdateOptionDTO
    {
        public int Id { get; set; }
        public string OptionText { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }

    #endregion

    #region Test Attempt DTOs

    public class TestAttemptDTO
    {
        public int Id { get; set; }
        public int TestId { get; set; }
        public string TestTitle { get; set; } = string.Empty;
        public int InternId { get; set; }
        public string InternName { get; set; } = string.Empty;
        public int TemplateId { get; set; }
        public int EvaluatorId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public decimal Score { get; set; }
        public decimal SystemScore { get; set; }
        public int TabSwitchCount { get; set; }
        public int WindowFocusLossCount { get; set; }
        public int CopyPasteCount { get; set; }
        public bool IsSubmitted { get; set; }
        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class StartTestAttemptDTO
    {
        public int TestId { get; set; }
        public int InternId { get; set; }
    }

    public class SubmitTestAttemptDTO
    {
        public int AttemptId { get; set; }
        public int TabSwitchCount { get; set; } = 0;
        public int WindowFocusLossCount { get; set; } = 0;
        public int CopyPasteCount { get; set; } = 0;
        public List<SubmitAnswerDTO> Answers { get; set; } = new();
    }

    #endregion

    #region Answer DTOs

    public class AnswerDTO
    {
        public int Id { get; set; }
        public int AttemptId { get; set; }
        public int QuestionId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public int SelectedOptionId { get; set; }
        public string SelectedOptionText { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        public decimal MarksAwarded { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class SubmitAnswerDTO
    {
        public int QuestionId { get; set; }
        public int SelectedOptionId { get; set; }
    }

    #endregion

    #region Test Results DTOs

    public class TestResultDTO
    {
        public int AttemptId { get; set; }
        public int TestId { get; set; }
        public string TestTitle { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public decimal TotalScore { get; set; }
        public decimal ObtainedScore { get; set; }
        public decimal Percentage { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public int WrongAnswers { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public List<AnswerDTO> Answers { get; set; } = new();
    }

    #endregion

    #region Intern Test View DTOs

    public class InternTestDTO
    {
        public int TestId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int DurationMinutes { get; set; }
        public bool IsLive { get; set; }
        public bool HasAttempted { get; set; }
        public decimal? ObtainedScore { get; set; }
        public decimal? TotalScore { get; set; }
    }

    #endregion
}
