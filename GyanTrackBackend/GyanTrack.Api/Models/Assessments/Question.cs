using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GyanTrack.Api.Models.Common;

namespace GyanTrack.Api.Models.Assessments
{
    /// <summary>
    /// Question - Evaluator creates questions for tests with marks
    /// </summary>
    public class Question : BaseEntity
    {
        [Required]
        public int TestID { get; set; }

        [Required]
        public string QuestionText { get; set; } = string.Empty;

        [Required]
        public int Marks { get; set; }

        // Navigation Properties
        [ForeignKey("TestID")]
        public virtual Test? Test { get; set; }

        // Navigation Properties
        public virtual ICollection<Option>? Options { get; set; }
        public virtual ICollection<Answer>? Answers { get; set; }
    }
}
