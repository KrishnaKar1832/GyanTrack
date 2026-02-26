using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GyanTrack.Api.Models.Common;

namespace GyanTrack.Api.Models.Assessments
{
    /// <summary>
    /// Test Attempt - Intern takes exam (one-time, time window based)
    /// </summary>
    public class TestAttempt : BaseEntity
    {
        [Required]
        public int TestID { get; set; }

        [Required]
        public int InternID { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public decimal Score { get; set; }

        public bool IsSubmitted { get; set; } = false;

        // Navigation Properties
        [ForeignKey("TestID")]
        public virtual Test? Test { get; set; }

        [ForeignKey("InternID")]
        public virtual Users.Intern? Intern { get; set; }

        // Navigation Properties
        public virtual ICollection<Answer>? Answers { get; set; }
        public virtual ICollection<Evaluations.EvaluatorRemark>? EvaluatorRemarks { get; set; }
    }
}
