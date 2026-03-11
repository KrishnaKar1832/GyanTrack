using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GyanTrack.Api.Models.Users
{
    /// <summary>
    /// Evaluator entity - extends User with Evaluator-specific fields
    /// </summary>
    public class Evaluator
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EvaluatorID { get; set; }

        [Required]
        [MaxLength(150)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Department { get; set; } = string.Empty;

        // Navigation Property
        [ForeignKey("EvaluatorID")]
        public virtual User? User { get; set; }

        // Navigation Properties
        public virtual ICollection<Evaluations.AssignmentTemplate>? AssignedTemplates { get; set; }
        public virtual ICollection<Evaluations.EvaluatorIntern>? AssignedInterns { get; set; }
        public virtual ICollection<Assessments.Test>? CreatedTests { get; set; }
        public virtual ICollection<Evaluations.EvaluatorRemark>? GivenRemarks { get; set; }
        public virtual ICollection<Evaluations.PerformanceScore>? PerformanceScores { get; set; }
    }
}
