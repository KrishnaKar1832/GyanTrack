using SmartInternSystem.Models.Base;
using SmartInternSystem.Models.Users;
using SmartInternSystem.Models.Tests;

namespace SmartInternSystem.Models.Attempts
{
    public class TestAttempt : BaseEntity
    {
        public int AttemptID { get; set; }

        public int TestID { get; set; }

        public int InternID { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public decimal Score { get; set; }

        public bool IsSubmitted { get; set; }

        public Test Test { get; set; }

        public Intern Intern { get; set; }
    }
}