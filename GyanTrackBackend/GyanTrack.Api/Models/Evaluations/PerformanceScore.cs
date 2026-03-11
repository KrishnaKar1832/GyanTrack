using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GyanTrack.Api.Models.Common;

namespace GyanTrack.Api.Models.Evaluations
{
    /// <summary>
    /// Performance Scores - stores Technical, Communication, and Attendance marks for interns
    /// </summary>
    public class PerformanceScore : BaseEntity
    {
        [Required]
        public int InternID { get; set; }

        [Required]
        public int TemplateID { get; set; }

        public decimal TechnicalScore { get; set; }

        public decimal CommunicationScore { get; set; }

        public decimal AttendanceScore { get; set; }

        public int EvaluatorID { get; set; }

        // Navigation Properties
        [ForeignKey("InternID")]
        public virtual Users.Intern? Intern { get; set; }

        [ForeignKey("TemplateID")]
        public virtual AssignmentTemplate? Template { get; set; }

        [ForeignKey("EvaluatorID")]
        public virtual Users.Evaluator? Evaluator { get; set; }
    }
}
