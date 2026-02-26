using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GyanTrack.Api.Models.Common;

namespace GyanTrack.Api.Models.Evaluations
{
    /// <summary>
    /// Evaluator Remarks - evaluator writes remarks for intern performance
    /// </summary>
    public class EvaluatorRemark : BaseEntity
    {
        [Required]
        public int AttemptID { get; set; }

        [Required]
        public int EvaluatorID { get; set; }

        public string Remarks { get; set; } = string.Empty;

        // Navigation Properties
        [ForeignKey("AttemptID")]
        public virtual Assessments.TestAttempt? TestAttempt { get; set; }

        [ForeignKey("EvaluatorID")]
        public virtual Users.Evaluator? Evaluator { get; set; }
    }
}
