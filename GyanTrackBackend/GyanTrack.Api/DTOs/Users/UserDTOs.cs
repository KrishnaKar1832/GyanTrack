using GyanTrack.Api.Models.Users;

namespace GyanTrack.Api.DTOs.Users
{
    #region User DTOs

    public class UserDTO
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateUserDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public UserRole Role { get; set; }
    }

    public class LoginDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    #endregion

    #region Admin DTOs

    public class AdminDTO
    {
        public int AdminID { get; set; }
        public string FullName { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
    }

    public class CreateAdminDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
    }

    #endregion

    #region Evaluator DTOs

    public class EvaluatorDTO
    {
        public int EvaluatorID { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
    }

    public class CreateEvaluatorDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
    }

    #endregion

    #region Intern DTOs

    public class InternDTO
    {
        public int InternID { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Batch { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
    }

    public class CreateInternDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Batch { get; set; } = string.Empty;
    }

    #endregion
}
