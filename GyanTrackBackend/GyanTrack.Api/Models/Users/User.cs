using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GyanTrack.Api.Models.Common;

namespace GyanTrack.Api.Models.Users
{
    /// <summary>
    /// User roles in the system
    /// </summary>
    public enum UserRole
    {
        Admin,
        Evaluator,
        Intern
    }

    /// <summary>
    /// Login table - used for JWT Authentication
    /// </summary>
    public class User : BaseEntity
    {
        [Required]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public UserRole Role { get; set; }

        // Navigation Properties
        public virtual Admin? Admin { get; set; }
        public virtual Evaluator? Evaluator { get; set; }
        public virtual Intern? Intern { get; set; }
    }
}
