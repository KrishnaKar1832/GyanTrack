namespace SmartInternSystem.Models.Users
{
    public class Admin
    {
        public int AdminID { get; set; }

        public string FullName { get; set; }

        public User User { get; set; }
    }
}