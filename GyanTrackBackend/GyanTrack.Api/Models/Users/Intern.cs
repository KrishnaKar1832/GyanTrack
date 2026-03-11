using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GyanTrack.Api.Models.Users
{
    /// <summary>
    /// Intern entity - extends User with Intern-specific fields
    /// </summary>
    public class Intern
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int InternID { get; set; }

        [Required]
        [MaxLength(150)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Department { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Batch { get; set; } = string.Empty;

        // Navigation Property
        [ForeignKey("InternID")]
        public virtual User? User { get; set; }

        // Navigation Properties
        public virtual ICollection<Evaluations.EvaluatorIntern>? AssignedEvaluators { get; set; }
        public virtual ICollection<Assessments.TestAttempt>? TestAttempts { get; set; }
        public virtual ICollection<Evaluations.PerformanceScore>? PerformanceScores { get; set; }
    }
}
