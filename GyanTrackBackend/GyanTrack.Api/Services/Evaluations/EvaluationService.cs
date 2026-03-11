using GyanTrack.Api.DTOs.Evaluations;
using GyanTrack.Api.Models.Evaluations;
using GyanTrack.Api.Repositories.Evaluations;
using GyanTrack.Api.Repositories.Users;
using GyanTrack.Api.Services.Assessments;

namespace GyanTrack.Api.Services.Evaluations
{
    public class EvaluationService : IEvaluationService
    {
        private readonly ISubjectRepository _subjectRepository;
        private readonly IAssignmentTemplateRepository _templateRepository;
        private readonly IEvaluatorInternRepository _mappingRepository;
        private readonly IPerformanceScoreRepository _scoreRepository;
        private readonly IAdminRepository _adminRepository;
        private readonly IEvaluatorRepository _evaluatorRepository;
        private readonly IInternRepository _internRepository;
        private readonly IEvaluatorRemarkRepository _remarkRepository;
        private readonly IAssessmentService _assessmentService;

        public EvaluationService(
            ISubjectRepository subjectRepository,
            IAssignmentTemplateRepository templateRepository,
            IEvaluatorInternRepository mappingRepository,
            IPerformanceScoreRepository scoreRepository,
            IAdminRepository adminRepository,
            IEvaluatorRepository evaluatorRepository,
            IInternRepository internRepository,
            IEvaluatorRemarkRepository remarkRepository,
            IAssessmentService assessmentService)
        {
            _subjectRepository = subjectRepository;
            _templateRepository = templateRepository;
            _mappingRepository = mappingRepository;
            _scoreRepository = scoreRepository;
            _adminRepository = adminRepository;
            _evaluatorRepository = evaluatorRepository;
            _internRepository = internRepository;
            _remarkRepository = remarkRepository;
            _assessmentService = assessmentService;
        }

        #region Subject

        public async Task<IEnumerable<SubjectDTO>> GetAllSubjectsAsync()
        {
            var subjects = await _subjectRepository.GetAllAsync();
            return subjects.Select(MapToSubjectDTO);
        }

        public async Task<SubjectDTO?> GetSubjectByIdAsync(int id)
        {
            var subject = await _subjectRepository.GetByIdAsync(id);
            return subject == null ? null : MapToSubjectDTO(subject);
        }

        public async Task<SubjectDTO> CreateSubjectAsync(CreateSubjectDTO createDto)
        {
            var subject = new Subject
            {
                SubjectName = createDto.SubjectName
            };
            var created = await _subjectRepository.CreateAsync(subject);
            return MapToSubjectDTO(created);
        }

        public async Task<bool> DeleteSubjectAsync(int id)
        {
            return await _subjectRepository.DeleteAsync(id);
        }

        #endregion

        #region Assignment Template

        public async Task<IEnumerable<AssignmentTemplateDTO>> GetAllTemplatesAsync()
        {
            var templates = await _templateRepository.GetAllAsync();
            return templates.Select(MapToTemplateDTO);
        }

        public async Task<AssignmentTemplateDTO?> GetTemplateByIdAsync(int id)
        {
            var template = await _templateRepository.GetByIdAsync(id);
            return template == null ? null : MapToTemplateDTO(template);
        }

        public async Task<IEnumerable<AssignmentTemplateDTO>> GetTemplatesByEvaluatorAsync(int evaluatorId)
        {
            var templates = await _templateRepository.GetByEvaluatorIdAsync(evaluatorId);
            return templates.Select(MapToTemplateDTO);
        }

        public async Task<AssignmentTemplateDTO> CreateTemplateAsync(CreateAssignmentTemplateDTO createDto, int createdBy)
        {
            var template = new AssignmentTemplate
            {
                SubjectID = createDto.SubjectId,
                EvaluatorID = createDto.EvaluatorId,
                TechnicalWeight = createDto.TechnicalWeight,
                CommunicationWeight = createDto.CommunicationWeight,
                AttendanceWeight = createDto.AttendanceWeight,
                CreatedBy = createdBy
            };
            var created = await _templateRepository.CreateAsync(template);
            return MapToTemplateDTO(created);
        }

        public async Task<AssignmentTemplateDTO> UpdateTemplateAsync(UpdateAssignmentTemplateDTO updateDto)
        {
            var template = await _templateRepository.GetByIdAsync(updateDto.Id);
            if (template == null)
                throw new InvalidOperationException("Template not found");

            template.SubjectID = updateDto.SubjectId;
            template.EvaluatorID = updateDto.EvaluatorId;
            template.TechnicalWeight = updateDto.TechnicalWeight;
            template.CommunicationWeight = updateDto.CommunicationWeight;
            template.AttendanceWeight = updateDto.AttendanceWeight;

            var updated = await _templateRepository.UpdateAsync(template);
            return MapToTemplateDTO(updated);
        }

        public async Task<bool> DeleteTemplateAsync(int id)
        {
            return await _templateRepository.DeleteAsync(id);
        }

        #endregion

        #region Evaluator-Intern Mapping

        public async Task<IEnumerable<EvaluatorInternDTO>> GetAllMappingsAsync()
        {
            var mappings = await _mappingRepository.GetAllAsync();
            return mappings.Select(MapToMappingDTO);
        }

        public async Task<IEnumerable<EvaluatorInternDTO>> GetMappingsByEvaluatorAsync(int evaluatorId)
        {
            var mappings = await _mappingRepository.GetByEvaluatorIdAsync(evaluatorId);
            return mappings.Select(MapToMappingDTO);
        }

        public async Task<IEnumerable<EvaluatorInternDTO>> GetMappingsByInternAsync(int internId)
        {
            var mappings = await _mappingRepository.GetByInternIdAsync(internId);
            return mappings.Select(MapToMappingDTO);
        }

        public async Task<EvaluatorInternDTO> CreateMappingAsync(CreateEvaluatorInternDTO createDto)
        {
            if (await _mappingRepository.ExistsAsync(createDto.EvaluatorId, createDto.InternId))
                throw new InvalidOperationException("Mapping already exists");

            var mapping = new EvaluatorIntern
            {
                EvaluatorID = createDto.EvaluatorId,
                InternID = createDto.InternId
            };
            var created = await _mappingRepository.CreateAsync(mapping);
            return MapToMappingDTO(created);
        }

        public async Task<bool> DeleteMappingAsync(int id)
        {
            return await _mappingRepository.DeleteAsync(id);
        }

        #endregion

        #region Performance Score

        public async Task<IEnumerable<PerformanceScoreDTO>> GetAllScoresAsync()
        {
            var scores = await _scoreRepository.GetAllAsync();
            return scores.Select(MapToScoreDTO);
        }

        public async Task<IEnumerable<PerformanceScoreDTO>> GetScoresByInternAsync(int internId)
        {
            var scores = await _scoreRepository.GetByInternIdAsync(internId);
            return scores.Select(MapToScoreDTO);
        }

        public async Task<IEnumerable<PerformanceScoreDTO>> GetScoresByTemplateAsync(int templateId)
        {
            var scores = await _scoreRepository.GetByTemplateIdAsync(templateId);
            return scores.Select(MapToScoreDTO);
        }

        public async Task<PerformanceScoreDTO> CreateScoreAsync(CreatePerformanceScoreDTO createDto)
        {
            var score = new PerformanceScore
            {
                InternID = createDto.InternId,
                TemplateID = createDto.TemplateId,
                TechnicalScore = createDto.TechnicalScore,
                CommunicationScore = createDto.CommunicationScore,
                AttendanceScore = createDto.AttendanceScore,
                EvaluatorID = createDto.EvaluatorId
            };
            var created = await _scoreRepository.CreateAsync(score);
            return MapToScoreDTO(created);
        }

        public async Task<PerformanceScoreDTO> UpdateScoreAsync(UpdatePerformanceScoreDTO updateDto)
        {
            var scores = await _scoreRepository.GetAllAsync();
            var score = scores.FirstOrDefault(s => s.Id == updateDto.Id);
            if (score == null)
                throw new InvalidOperationException("Score not found");

            score.TechnicalScore = updateDto.TechnicalScore;
            score.CommunicationScore = updateDto.CommunicationScore;
            score.AttendanceScore = updateDto.AttendanceScore;

            var updated = await _scoreRepository.UpdateAsync(score);
            return MapToScoreDTO(updated);
        }

        #endregion

        #region Intern Evaluation

        public async Task<IEnumerable<PerformanceScoreDTO>> GetEvaluationsByInternAsync(int internId)
        {
            var scores = await _scoreRepository.GetByInternIdAsync(internId);
            return scores.Select(MapToScoreDTO);
        }

        public async Task<PerformanceScoreDTO?> GetEvaluationByInternAndTemplateAsync(int internId, int templateId)
        {
            var scores = await _scoreRepository.GetByInternIdAsync(internId);
            var score = scores.FirstOrDefault(s => s.TemplateID == templateId);
            return score == null ? null : MapToScoreDTO(score);
        }

        public async Task<InternProfileDTO?> GetInternProfileAsync(int internId)
        {
            var intern = await _internRepository.GetByInternWithUserAsync(internId);
            if (intern == null)
                return null;

            var mappings = await _mappingRepository.GetByInternIdAsync(internId);

            var assignedEvaluators = new List<EvaluatorInfoDTO>();
            foreach (var m in mappings)
            {
                assignedEvaluators.Add(new EvaluatorInfoDTO
                {
                    EvaluatorId = m.EvaluatorID,
                    EvaluatorName = m.Evaluator != null ? m.Evaluator.FullName : "",
                    Department = m.Evaluator != null ? m.Evaluator.Department : ""
                });
            }

            var profile = new InternProfileDTO
            {
                InternId = intern.InternID,
                FullName = intern.FullName,
                Email = intern.User != null ? intern.User.Email : "",
                Department = intern.Department,
                Batch = intern.Batch,
                AssignedEvaluators = assignedEvaluators
            };

            return profile;
        }

        public async Task<EvaluatorRemarkDTO> VerifyInternEvaluationAsync(int attemptId, int evaluatorId, VerifyAttemptDTO verifyDto)
        {
            var remark = new EvaluatorRemark
            {
                AttemptID = attemptId,
                EvaluatorID = evaluatorId,
                Remarks = verifyDto.Remarks
            };

            var createdRemark = await _remarkRepository.CreateAsync(remark);

            // Mark the attempt as verified using assessment service
            await _assessmentService.MarkAttemptVerifiedAsync(attemptId);

            return new EvaluatorRemarkDTO
            {
                Id = createdRemark.Id,
                AttemptId = createdRemark.AttemptID,
                EvaluatorId = createdRemark.EvaluatorID,
                Remarks = createdRemark.Remarks,
                CreatedAt = createdRemark.CreatedAt
            };
        }

        #endregion

        #region Performance Metrics

        public async Task<IEnumerable<DepartmentPerformanceDTO>> GetDepartmentPerformanceAsync(string? department = null, int? subjectId = null)
        {
            var scores = await _scoreRepository.GetAllAsync();
            var query = scores.AsQueryable();

            if (!string.IsNullOrEmpty(department))
                query = query.Where(s => s.Intern != null && s.Intern.Department == department);

            if (subjectId.HasValue)
                query = query.Where(s => s.Template != null && s.Template.SubjectID == subjectId.Value);

            var result = query
                .GroupBy(s => new { s.Intern.Department, s.Template.Subject.SubjectName })
                .Select(g => new DepartmentPerformanceDTO
                {
                    Department = g.Key.Department ?? "",
                    SubjectName = g.Key.SubjectName ?? "",
                    AverageTechnicalScore = g.Average(s => s.TechnicalScore),
                    AverageCommunicationScore = g.Average(s => s.CommunicationScore),
                    AverageAttendanceScore = g.Average(s => s.AttendanceScore),
                    OverallAverage = g.Average(s => s.TechnicalScore + s.CommunicationScore + s.AttendanceScore),
                    TotalInterns = g.Count()
                });

            return await Task.FromResult(result);
        }

        public async Task<InternPerformanceDTO?> GetInternPerformanceAsync(int internId)
        {
            var intern = await _internRepository.GetByIdAsync(internId);
            if (intern == null)
                return null;

            var scores = await _scoreRepository.GetByInternIdAsync(internId);

            var subjectPerformances = new List<SubjectPerformanceDTO>();
            foreach (var s in scores)
            {
                var subjectName = "";
                if (s.Template != null && s.Template.Subject != null)
                {
                    subjectName = s.Template.Subject.SubjectName;
                }
                subjectPerformances.Add(new SubjectPerformanceDTO
                {
                    SubjectName = subjectName,
                    TechnicalScore = s.TechnicalScore,
                    CommunicationScore = s.CommunicationScore,
                    AttendanceScore = s.AttendanceScore,
                    TotalScore = s.TechnicalScore + s.CommunicationScore + s.AttendanceScore
                });
            }

            var performance = new InternPerformanceDTO
            {
                InternId = intern.InternID,
                InternName = intern.FullName,
                Department = intern.Department,
                Batch = intern.Batch,
                SubjectPerformances = subjectPerformances,
                OverallTechnicalScore = scores.Any() ? scores.Average(s => s.TechnicalScore) : 0,
                OverallCommunicationScore = scores.Any() ? scores.Average(s => s.CommunicationScore) : 0,
                OverallAttendanceScore = scores.Any() ? scores.Average(s => s.AttendanceScore) : 0,
                OverallScore = scores.Any() ? scores.Average(s => s.TechnicalScore + s.CommunicationScore + s.AttendanceScore) : 0
            };

            return performance;
        }

        #endregion

        #region Private Mappers

        private SubjectDTO MapToSubjectDTO(Subject subject)
        {
            return new SubjectDTO
            {
                Id = subject.Id,
                SubjectName = subject.SubjectName,
                CreatedAt = subject.CreatedAt
            };
        }

        private AssignmentTemplateDTO MapToTemplateDTO(AssignmentTemplate template)
        {
            var evaluatorName = "";
            var evaluatorDept = "";
            if (template.Evaluator != null)
            {
                evaluatorName = template.Evaluator.FullName;
                evaluatorDept = template.Evaluator.Department;
            }

            var subjectName = "";
            if (template.Subject != null)
            {
                subjectName = template.Subject.SubjectName;
            }

            var createdByName = "";
            if (template.CreatedByAdmin != null)
            {
                createdByName = template.CreatedByAdmin.FullName;
            }

            return new AssignmentTemplateDTO
            {
                Id = template.Id,
                SubjectId = template.SubjectID,
                SubjectName = subjectName,
                EvaluatorId = template.EvaluatorID,
                EvaluatorName = evaluatorName,
                Department = evaluatorDept,
                TechnicalWeight = template.TechnicalWeight,
                CommunicationWeight = template.CommunicationWeight,
                AttendanceWeight = template.AttendanceWeight,
                CreatedBy = template.CreatedBy,
                CreatedByName = createdByName,
                CreatedAt = template.CreatedAt,
                IsDeleted = template.IsDeleted
            };
        }

        private EvaluatorInternDTO MapToMappingDTO(EvaluatorIntern mapping)
        {
            var evaluatorName = "";
            if (mapping.Evaluator != null)
            {
                evaluatorName = mapping.Evaluator.FullName;
            }

            var internName = "";
            if (mapping.Intern != null)
            {
                internName = mapping.Intern.FullName;
            }

            return new EvaluatorInternDTO
            {
                Id = mapping.Id,
                EvaluatorId = mapping.EvaluatorID,
                EvaluatorName = evaluatorName,
                InternId = mapping.InternID,
                InternName = internName,
                CreatedAt = mapping.CreatedAt
            };
        }

        private PerformanceScoreDTO MapToScoreDTO(PerformanceScore score)
        {
            var internName = "";
            var internDept = "";
            var internBatch = "";
            if (score.Intern != null)
            {
                internName = score.Intern.FullName;
                internDept = score.Intern.Department;
                internBatch = score.Intern.Batch;
            }

            var subjectName = "";
            if (score.Template != null && score.Template.Subject != null)
            {
                subjectName = score.Template.Subject.SubjectName;
            }

            var evaluatorName = "";
            if (score.Evaluator != null)
            {
                evaluatorName = score.Evaluator.FullName;
            }

            return new PerformanceScoreDTO
            {
                Id = score.Id,
                InternId = score.InternID,
                InternName = internName,
                Department = internDept,
                Batch = internBatch,
                TemplateId = score.TemplateID,
                SubjectName = subjectName,
                TechnicalScore = score.TechnicalScore,
                CommunicationScore = score.CommunicationScore,
                AttendanceScore = score.AttendanceScore,
                EvaluatorId = score.EvaluatorID,
                EvaluatorName = evaluatorName,
                CreatedAt = score.CreatedAt
            };
        }

        #endregion
    }
}
