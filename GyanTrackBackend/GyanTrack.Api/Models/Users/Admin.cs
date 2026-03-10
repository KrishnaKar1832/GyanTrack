using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GyanTrack.Api.Models.Users
{
    /// <summary>
    /// Admin entity - extends User with Admin-specific fields
    /// </summary>
    public class Admin
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AdminID { get; set; }

        [Required]
        [MaxLength(150)]
        public string FullName { get; set; } = string.Empty;

        // Navigation Property
        [ForeignKey("AdminID")]
        public virtual User? User { get; set; }

        // Navigation Properties - Admin can create multiple assignment templates
        public virtual ICollection<Evaluations.AssignmentTemplate>? CreatedTemplates { get; set; }
    }
}
