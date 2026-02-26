using SmartInternSystem.Models.Base;
using SmartInternSystem.Models.Users;
using SmartInternSystem.Models.Templates;

namespace SmartInternSystem.Models.Evaluation
{
    public class PerformanceScore : BaseEntity
    {
        public int ScoreID { get; set; }

        public int InternID { get; set; }

        public int TemplateID { get; set; }

        public decimal TechnicalScore { get; set; }

        public decimal CommunicationScore { get; set; }

        public decimal AttendanceScore { get; set; }

        public int EvaluatorID { get; set; }

        public Intern Intern { get; set; }

        public AssignmentTemplate Template { get; set; }

        public Evaluator Evaluator { get; set; }
    }
}