using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GyanTrack.Api.Models.Assessments
{
    /// <summary>
    /// Option - MCQ options for questions (used for auto-evaluation)
    /// </summary>
    public class Option
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OptionID { get; set; }

        [Required]
        public int QuestionID { get; set; }

        [Required]
        public string OptionText { get; set; } = string.Empty;

        public bool IsCorrect { get; set; }

        // Navigation Properties
        [ForeignKey("QuestionID")]
        public virtual Question? Question { get; set; }

        // Navigation Properties
        public virtual ICollection<Answer>? Answers { get; set; }
    }
}
