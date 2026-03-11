using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GyanTrack.Api.Models.Common;

namespace GyanTrack.Api.Models.Assessments
{
    /// <summary>
    /// Answer - Intern's answers to questions (used for auto-evaluation)
    /// </summary>
    public class Answer : BaseEntity
    {
        [Required]
        public int AttemptID { get; set; }

        [Required]
        public int QuestionID { get; set; }

        public int SelectedOptionID { get; set; }

        public bool IsCorrect { get; set; }

        public decimal MarksAwarded { get; set; }

        // Navigation Properties
        [ForeignKey("AttemptID")]
        public virtual TestAttempt? TestAttempt { get; set; }

        [ForeignKey("QuestionID")]
        public virtual Question? Question { get; set; }

        [ForeignKey("SelectedOptionID")]
        public virtual Option? SelectedOption { get; set; }
    }
}
