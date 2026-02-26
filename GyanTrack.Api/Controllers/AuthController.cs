using Microsoft.AspNetCore.Mvc;
using GyanTrack.Api.DTOs.Users;
using GyanTrack.Api.Services.Users;
using GyanTrack.Api.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace GyanTrack.Api.Controllers
{
    /// <summary>
    /// Authentication Controller - Handles login for all users (Admin, Evaluator, Intern)
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// POST: api/auth/login
        /// Authenticate user with email and password, returns JWT token
        /// Common login endpoint for all roles (Admin, Evaluator, Intern)
        /// </summary>
        /// <param name="loginRequest">Login credentials (Email and Password)</param>
        /// <returns>JWT token with user information</returns>
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDTO>> Login([FromBody] LoginRequestDTO loginRequest)
        {
            try
            {
                var result = await _authService.LoginAsync(loginRequest.Email, loginRequest.Password);
                
                if (result == null)
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// POST: api/auth/register
        /// Register a new user (Admin, Evaluator, or Intern)
        /// </summary>
        /// <param name="registerRequest">Registration details</param>
        /// <returns>Created user information</returns>
        [HttpPost("register")]
        public async Task<ActionResult<LoginResponseDTO>> Register([FromBody] RegisterRequestDTO registerRequest)
        {
            try
            {
                var result = await _authService.RegisterAsync(
                    registerRequest.Email, 
                    registerRequest.Password, 
                    registerRequest.Role,
                    registerRequest.FullName,
                    registerRequest.Department,
                    registerRequest.Batch
                );

                if (result == null)
                {
                    return BadRequest(new { message = "Registration failed. Email may already exist." });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/auth/profile
        /// Get current user profile
        /// </summary>
        /// <returns>User profile information</returns>
        [HttpGet("profile")]
        [Authorize] // Requires JWT authentication
        public async Task<ActionResult<UserProfileDTO>> GetProfile()
        {
            try
            {
                var userId = User.GetUserId();
                var profile = await _authService.GetProfileAsync(userId);
                
                if (profile == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
