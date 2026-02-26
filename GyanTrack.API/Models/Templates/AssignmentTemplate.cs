using SmartInternSystem.Models.Base;
using SmartInternSystem.Models.Users;

namespace SmartInternSystem.Models.Templates
{
    public class AssignmentTemplate : BaseEntity
    {
        public int TemplateID { get; set; }

        public int SubjectID { get; set; }

        public int EvaluatorID { get; set; }

        public int TechnicalWeight { get; set; }

        public int CommunicationWeight { get; set; }

        public int AttendanceWeight { get; set; }

        public int CreatedBy { get; set; }

        public Subject Subject { get; set; }

        public Evaluator Evaluator { get; set; }

        public Admin Admin { get; set; }
    }
}