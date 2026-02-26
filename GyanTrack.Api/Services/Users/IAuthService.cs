using GyanTrack.Api.DTOs.Users;

namespace GyanTrack.Api.Services.Users
{
    public interface IAuthService
    {
        /// <summary>
        /// Authenticate user with email and password
        /// </summary>
        /// <param name="email">User's email</param>
        /// <param name="password">User's password</param>
        /// <returns>Login response with JWT token or null if invalid</returns>
        Task<LoginResponseDTO?> LoginAsync(string email, string password);

        /// <summary>
        /// Register a new user
        /// </summary>
        /// <param name="email">User's email</param>
        /// <param name="password">User's password</param>
        /// <param name="role">User role (Admin, Evaluator, Intern)</param>
        /// <param name="fullName">Full name of the user</param>
        /// <param name="department">Department (for Evaluator/Intern)</param>
        /// <param name="batch">Batch (for Intern)</param>
        /// <returns>Login response with JWT token or null if failed</returns>
        Task<LoginResponseDTO?> RegisterAsync(string email, string password, string role, string fullName, string department, string batch);

        /// <summary>
        /// Get user profile by user ID
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>User profile or null if not found</returns>
        Task<UserProfileDTO?> GetProfileAsync(int userId);
    }
}
