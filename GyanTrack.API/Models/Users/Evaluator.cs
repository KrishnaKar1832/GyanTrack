namespace SmartInternSystem.Models.Users
{
    public class Evaluator
    {
        public int EvaluatorID { get; set; }

        public string FullName { get; set; }

        public string Department { get; set; }

        public User User { get; set; }
    }
}