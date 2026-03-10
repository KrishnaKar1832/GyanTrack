namespace GyanTrack.Api.DTOs.Users
{
    /// <summary>
    /// Register request DTO - used for registering new users
    /// </summary>
    public class RegisterRequestDTO
    {
        /// <summary>
        /// User's email address (required, must be unique)
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// User's password (required)
        /// </summary>
        public string Password { get; set; } = string.Empty;

        /// <summary>
        /// User role: Admin, Evaluator, or Intern
        /// </summary>
        public string Role { get; set; } = string.Empty;

        /// <summary>
        /// Full name of the user
        /// </summary>
        public string FullName { get; set; } = string.Empty;

        /// <summary>
        /// Department (required for Evaluator and Intern)
        /// </summary>
        public string Department { get; set; } = string.Empty;

        /// <summary>
        /// Batch (required for Intern)
        /// </summary>
        public string Batch { get; set; } = string.Empty;
    }

    /// <summary>
    /// User profile DTO - contains detailed user information
    /// </summary>
    public class UserProfileDTO
    {
        /// <summary>
        /// User ID
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// User's email
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// User's role
        /// </summary>
        public string Role { get; set; } = string.Empty;

        /// <summary>
        /// Full name
        /// </summary>
        public string FullName { get; set; } = string.Empty;

        /// <summary>
        /// Department
        /// </summary>
        public string Department { get; set; } = string.Empty;

        /// <summary>
        /// Batch (for Interns)
        /// </summary>
        public string Batch { get; set; } = string.Empty;

        /// <summary>
        /// User ID in role-specific table (AdminID, EvaluatorID, or InternID)
        /// </summary>
        public int RoleId { get; set; }
    }
}
