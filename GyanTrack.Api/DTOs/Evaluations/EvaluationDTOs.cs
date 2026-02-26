namespace GyanTrack.Api.DTOs.Evaluations
{
    #region Subject DTOs

    public class SubjectDTO
    {
        public int Id { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateSubjectDTO
    {
        public string SubjectName { get; set; } = string.Empty;
    }

    #endregion

    #region Assignment Template DTOs

    public class AssignmentTemplateDTO
    {
        public int Id { get; set; }
        public int SubjectId { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public int EvaluatorId { get; set; }
        public string EvaluatorName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public int TechnicalWeight { get; set; }
        public int CommunicationWeight { get; set; }
        public int AttendanceWeight { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedByName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class CreateAssignmentTemplateDTO
    {
        public int SubjectId { get; set; }
        public int EvaluatorId { get; set; }
        public int TechnicalWeight { get; set; }
        public int CommunicationWeight { get; set; }
        public int AttendanceWeight { get; set; }
    }

    public class UpdateAssignmentTemplateDTO
    {
        public int Id { get; set; }
        public int SubjectId { get; set; }
        public int EvaluatorId { get; set; }
        public int TechnicalWeight { get; set; }
        public int CommunicationWeight { get; set; }
        public int AttendanceWeight { get; set; }
    }

    #endregion

    #region Evaluator-Intern Mapping DTOs

    public class EvaluatorInternDTO
    {
        public int Id { get; set; }
        public int EvaluatorId { get; set; }
        public string EvaluatorName { get; set; } = string.Empty;
        public int InternId { get; set; }
        public string InternName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateEvaluatorInternDTO
    {
        public int EvaluatorId { get; set; }
        public int InternId { get; set; }
    }

    #endregion

    #region Performance Score DTOs

    public class PerformanceScoreDTO
    {
        public int Id { get; set; }
        public int InternId { get; set; }
        public string InternName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Batch { get; set; } = string.Empty;
        public int TemplateId { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public decimal TechnicalScore { get; set; }
        public decimal CommunicationScore { get; set; }
        public decimal AttendanceScore { get; set; }
        public int EvaluatorId { get; set; }
        public string EvaluatorName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreatePerformanceScoreDTO
    {
        public int InternId { get; set; }
        public int TemplateId { get; set; }
        public decimal TechnicalScore { get; set; }
        public decimal CommunicationScore { get; set; }
        public decimal AttendanceScore { get; set; }
        public int EvaluatorId { get; set; }
    }

    public class UpdatePerformanceScoreDTO
    {
        public int Id { get; set; }
        public decimal TechnicalScore { get; set; }
        public decimal CommunicationScore { get; set; }
        public decimal AttendanceScore { get; set; }
    }

    #endregion

    #region Evaluator Remark DTOs

    public class EvaluatorRemarkDTO
    {
        public int Id { get; set; }
        public int AttemptId { get; set; }
        public int EvaluatorId { get; set; }
        public string EvaluatorName { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateEvaluatorRemarkDTO
    {
        public int AttemptId { get; set; }
        public int EvaluatorId { get; set; }
        public string Remarks { get; set; } = string.Empty;
    }

    public class UpdateEvaluatorRemarkDTO
    {
        public int Id { get; set; }
        public string Remarks { get; set; } = string.Empty;
    }

    #endregion

    #region Performance Metrics DTOs

    public class DepartmentPerformanceDTO
    {
        public string Department { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public decimal AverageTechnicalScore { get; set; }
        public decimal AverageCommunicationScore { get; set; }
        public decimal AverageAttendanceScore { get; set; }
        public decimal OverallAverage { get; set; }
        public int TotalInterns { get; set; }
    }

    public class InternPerformanceDTO
    {
        public int InternId { get; set; }
        public string InternName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Batch { get; set; } = string.Empty;
        public List<SubjectPerformanceDTO> SubjectPerformances { get; set; } = new();
        public decimal OverallTechnicalScore { get; set; }
        public decimal OverallCommunicationScore { get; set; }
        public decimal OverallAttendanceScore { get; set; }
        public decimal OverallScore { get; set; }
    }

    public class SubjectPerformanceDTO
    {
        public string SubjectName { get; set; } = string.Empty;
        public decimal TechnicalScore { get; set; }
        public decimal CommunicationScore { get; set; }
        public decimal AttendanceScore { get; set; }
        public decimal TotalScore { get; set; }
    }

    #endregion

    #region Intern Profile DTOs

    public class InternProfileDTO
    {
        public int InternId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Batch { get; set; } = string.Empty;
        public List<EvaluatorInfoDTO> AssignedEvaluators { get; set; } = new();
    }

    public class EvaluatorInfoDTO
    {
        public int EvaluatorId { get; set; }
        public string EvaluatorName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
    }

    #endregion
}
