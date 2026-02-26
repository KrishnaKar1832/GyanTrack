using SmartInternSystem.Models.Base;

namespace SmartInternSystem.Models.Users
{
    public class User : BaseEntity
    {
        public int UserID { get; set; }

        public string Email { get; set; }

        public string PasswordHash { get; set; }

        public string Role { get; set; }
    }
}