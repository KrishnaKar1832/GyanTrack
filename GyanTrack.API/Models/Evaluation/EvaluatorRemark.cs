using SmartInternSystem.Models.Base;
using SmartInternSystem.Models.Users;
using SmartInternSystem.Models.Attempts;

namespace SmartInternSystem.Models.Evaluation
{
    public class EvaluatorRemark : BaseEntity
    {
        public int RemarkID { get; set; }

        public int AttemptID { get; set; }

        public int EvaluatorID { get; set; }

        public string Remarks { get; set; }

        public TestAttempt TestAttempt { get; set; }

        public Evaluator Evaluator { get; set; }
    }
}