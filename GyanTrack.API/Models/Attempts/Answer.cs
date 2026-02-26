using SmartInternSystem.Models.Tests;

namespace SmartInternSystem.Models.Attempts
{
    public class Answer
    {
        public int AnswerID { get; set; }

        public int AttemptID { get; set; }

        public int QuestionID { get; set; }

        public int SelectedOptionID { get; set; }

        public bool IsCorrect { get; set; }

        public decimal MarksAwarded { get; set; }

        public TestAttempt TestAttempt { get; set; }

        public Question Question { get; set; }

        public Option Option { get; set; }
    }
}