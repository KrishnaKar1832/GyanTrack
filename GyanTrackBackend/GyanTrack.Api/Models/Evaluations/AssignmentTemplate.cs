using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GyanTrack.Api.Models.Common;

namespace GyanTrack.Api.Models.Evaluations
{
    /// <summary>
    /// Assignment Template - Admin creates evaluation template with subject, evaluator, and weightage
    /// </summary>
    public class AssignmentTemplate : BaseEntity
    {
        [Required]
        public int SubjectID { get; set; }

        [Required]
        public int EvaluatorID { get; set; }

        [Required]
        public int TechnicalWeight { get; set; }

        [Required]
        public int CommunicationWeight { get; set; }

        [Required]
        public int AttendanceWeight { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } = "Pending Creation";

        public int CreatedBy { get; set; }

        // Navigation Properties
        [ForeignKey("SubjectID")]
        public virtual Subject? Subject { get; set; }

        [ForeignKey("EvaluatorID")]
        public virtual Users.Evaluator? Evaluator { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual Users.Admin? CreatedByAdmin { get; set; }

        // Navigation Properties
        public virtual ICollection<Assessments.Test>? Tests { get; set; }
        public virtual ICollection<PerformanceScore>? PerformanceScores { get; set; }
    }
}
