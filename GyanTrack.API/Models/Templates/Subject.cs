using SmartInternSystem.Models.Base;

namespace SmartInternSystem.Models.Templates
{
    public class Subject : BaseEntity
    {
        public int SubjectID { get; set; }

        public string SubjectName { get; set; }
    }
}