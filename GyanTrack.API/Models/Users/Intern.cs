namespace SmartInternSystem.Models.Users
{
    public class Intern
    {
        public int InternID { get; set; }

        public string FullName { get; set; }

        public string Department { get; set; }

        public string Batch { get; set; }

        public User User { get; set; }
    }
}