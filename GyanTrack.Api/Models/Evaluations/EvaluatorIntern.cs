using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GyanTrack.Api.Models.Common;

namespace GyanTrack.Api.Models.Evaluations
{
    /// <summary>
    /// Evaluator-Intern Mapping - connects evaluators to their assigned interns
    /// </summary>
    public class EvaluatorIntern : BaseEntity
    {
        [Required]
        public int EvaluatorID { get; set; }

        [Required]
        public int InternID { get; set; }

        // Navigation Properties
        [ForeignKey("EvaluatorID")]
        public virtual Users.Evaluator? Evaluator { get; set; }

        [ForeignKey("InternID")]
        public virtual Users.Intern? Intern { get; set; }
    }
}
