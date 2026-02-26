using SmartInternSystem.Models.Base;
using SmartInternSystem.Models.Users;

namespace SmartInternSystem.Models.Mapping
{
    public class EvaluatorIntern : BaseEntity
    {
        public int ID { get; set; }

        public int EvaluatorID { get; set; }

        public int InternID { get; set; }

        public Evaluator Evaluator { get; set; }

        public Intern Intern { get; set; }
    }
}