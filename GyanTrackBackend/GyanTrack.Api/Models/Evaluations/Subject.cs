using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GyanTrack.Api.Models.Common;

namespace GyanTrack.Api.Models.Evaluations
{
    /// <summary>
    /// Subject entity - stores available subjects (Java, Python, DBMS, Cloud, AI, etc.)
    /// </summary>
    public class Subject : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string SubjectName { get; set; } = string.Empty;

        // Navigation Properties
        public virtual ICollection<AssignmentTemplate>? AssignmentTemplates { get; set; }
    }
}
