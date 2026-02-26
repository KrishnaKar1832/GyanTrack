using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using GyanTrack.Api.Data;
using GyanTrack.Api.DTOs.Users;
using GyanTrack.Api.Models.Users;

namespace GyanTrack.Api.Services.Users
{
    public class AuthService : IAuthService
    {
        private readonly GyanTrackDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(GyanTrackDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        /// <summary>
        /// Authenticate user with email and password - returns JWT token
        /// </summary>
        public async Task<LoginResponseDTO?> LoginAsync(string email, string password)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted);

            if (user == null)
            {
                return null;
            }

            // Verify password (simple comparison - in production use proper hashing)
            var passwordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes(password));
            if (user.PasswordHash != passwordHash)
            {
                return null;
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);

            // Get full name based on role
            string fullName = "";
            switch (user.Role)
            {
                case UserRole.Admin:
                    var admin = await _context.Admins.FindAsync(user.Id);
                    fullName = admin?.FullName ?? "";
                    break;
                case UserRole.Evaluator:
                    var evaluator = await _context.Evaluators.FindAsync(user.Id);
                    fullName = evaluator?.FullName ?? "";
                    break;
                case UserRole.Intern:
                    var intern = await _context.Interns.FindAsync(user.Id);
                    fullName = intern?.FullName ?? "";
                    break;
            }

            return new LoginResponseDTO
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role.ToString(),
                FullName = fullName
            };
        }

        /// <summary>
        /// Register a new user (Admin, Evaluator, or Intern)
        /// </summary>
        public async Task<LoginResponseDTO?> RegisterAsync(string email, string password, string role, string fullName, string department, string batch)
        {
            // Check if email already exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (existingUser != null)
            {
                return null;
            }

            // Parse role
            if (!Enum.TryParse<UserRole>(role, true, out var userRole))
            {
                throw new Exception("Invalid role. Must be Admin, Evaluator, or Intern");
            }

            // Create user
            var user = new User
            {
                Email = email,
                PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes(password)),
                Role = userRole
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Create role-specific entity
            switch (userRole)
            {
                case UserRole.Admin:
                    var admin = new Admin
                    {
                        AdminID = user.Id,
                        FullName = fullName
                    };
                    _context.Admins.Add(admin);
                    break;

                case UserRole.Evaluator:
                    var evaluator = new Evaluator
                    {
                        EvaluatorID = user.Id,
                        FullName = fullName,
                        Department = department
                    };
                    _context.Evaluators.Add(evaluator);
                    break;

                case UserRole.Intern:
                    var intern = new Intern
                    {
                        InternID = user.Id,
                        FullName = fullName,
                        Department = department,
                        Batch = batch
                    };
                    _context.Interns.Add(intern);
                    break;
            }

            await _context.SaveChangesAsync();

            // Generate token and return
            var token = GenerateJwtToken(user);
            return new LoginResponseDTO
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role.ToString(),
                FullName = fullName
            };
        }

        /// <summary>
        /// Get user profile by user ID
        /// </summary>
        public async Task<UserProfileDTO?> GetProfileAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.IsDeleted)
            {
                return null;
            }

            var profile = new UserProfileDTO
            {
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role.ToString(),
                RoleId = user.Id
            };

            switch (user.Role)
            {
                case UserRole.Admin:
                    var admin = await _context.Admins.FindAsync(userId);
                    if (admin != null)
                    {
                        profile.FullName = admin.FullName;
                    }
                    break;
                case UserRole.Evaluator:
                    var evaluator = await _context.Evaluators.FindAsync(userId);
                    if (evaluator != null)
                    {
                        profile.FullName = evaluator.FullName;
                        profile.Department = evaluator.Department;
                    }
                    break;
                case UserRole.Intern:
                    var intern = await _context.Interns.FindAsync(userId);
                    if (intern != null)
                    {
                        profile.FullName = intern.FullName;
                        profile.Department = intern.Department;
                        profile.Batch = intern.Batch;
                    }
                    break;
            }

            return profile;
        }

        /// <summary>
        /// Generate JWT token for authenticated user
        /// </summary>
        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "YourSecretKeyHere12345678901234567890"));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim("userId", user.Id.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "GyanTrack",
                audience: _configuration["Jwt:Audience"] ?? "GyanTrack",
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
