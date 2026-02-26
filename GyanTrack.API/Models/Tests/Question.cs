using SmartInternSystem.Models.Base;

namespace SmartInternSystem.Models.Tests
{
    public class Question : BaseEntity
    {
        public int QuestionID { get; set; }

        public int TestID { get; set; }

        public string QuestionText { get; set; }

        public int Marks { get; set; }

        public Test Test { get; set; }
    }
}