namespace GyanTrack.Api.DTOs.Users
{
    /// <summary>
    /// Login request DTO - contains email and password for authentication
    /// </summary>
    public class LoginRequestDTO
    {
        /// <summary>
        /// User's email address (required for login)
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// User's password (required for login)
        /// </summary>
        public string Password { get; set; } = string.Empty;
    }

    /// <summary>
    /// Login response DTO - contains JWT token and user information
    /// </summary>
    public class LoginResponseDTO
    {
        /// <summary>
        /// JWT authentication token
        /// </summary>
        public string Token { get; set; } = string.Empty;

        /// <summary>
        /// User ID
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// User's email
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// User's role (Admin, Evaluator, Intern)
        /// </summary>
        public string Role { get; set; } = string.Empty;

        /// <summary>
        /// Full name of the user
        /// </summary>
        public string FullName { get; set; } = string.Empty;
    }
}
