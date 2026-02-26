using SmartInternSystem.Models.Base;
using SmartInternSystem.Models.Users;
using SmartInternSystem.Models.Templates;

namespace SmartInternSystem.Models.Tests
{
    public class Test : BaseEntity
    {
        public int TestID { get; set; }

        public int TemplateID { get; set; }

        public string Title { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public int DurationMinutes { get; set; }

        public int CreatedBy { get; set; }

        public AssignmentTemplate Template { get; set; }

        public Evaluator Evaluator { get; set; }
    }
}