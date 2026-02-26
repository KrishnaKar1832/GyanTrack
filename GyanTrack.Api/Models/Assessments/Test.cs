using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GyanTrack.Api.Models.Common;

namespace GyanTrack.Api.Models.Assessments
{
    /// <summary>
    /// Test - Evaluator creates test from template (MCQ-based, timer-based)
    /// </summary>
    public class Test : BaseEntity
    {
        [Required]
        public int TemplateID { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public int DurationMinutes { get; set; }

        public int CreatedBy { get; set; }

        // Navigation Properties
        [ForeignKey("TemplateID")]
        public virtual Evaluations.AssignmentTemplate? Template { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual Users.Evaluator? CreatedByEvaluator { get; set; }

        // Navigation Properties
        public virtual ICollection<Question>? Questions { get; set; }
        public virtual ICollection<TestAttempt>? TestAttempts { get; set; }
    }
}
