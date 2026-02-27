using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GyanTrack.Api.DTOs.Evaluations;
using GyanTrack.Api.Services.Evaluations;
using GyanTrack.Api.Extensions;
using GyanTrack.Api.Repositories.Users;

namespace GyanTrack.Api.Controllers
{
    /// <summary>
    /// Admin Controller - Handles all HR/Admin operations
    /// Requires JWT authentication with Admin role
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IEvaluationService _evaluationService;
        private readonly IEvaluatorRepository _evaluatorRepo;
        private readonly IInternRepository _internRepo;

        public AdminController(
            IEvaluationService evaluationService,
            IEvaluatorRepository evaluatorRepo,
            IInternRepository internRepo)
        {
            _evaluationService = evaluationService;
            _evaluatorRepo = evaluatorRepo;
            _internRepo = internRepo;
        }

        #region User Listings

        /// <summary>
        /// GET: api/admin/evaluators
        /// List all evaluators for dropdown population
        /// </summary>
        [HttpGet("evaluators")]
        public async Task<ActionResult> GetAllEvaluators()
        {
            try
            {
                var evaluators = await _evaluatorRepo.GetAllAsync();
                var result = evaluators.Select(e => new { id = e.EvaluatorID, name = e.FullName, department = e.Department });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/admin/interns
        /// List all interns for dropdown population
        /// </summary>
        [HttpGet("interns")]
        public async Task<ActionResult> GetAllInterns()
        {
            try
            {
                var interns = await _internRepo.GetAllAsync();
                var result = interns.Select(i => new { id = i.InternID, name = i.FullName, department = i.Department, batch = i.Batch });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Subject Management

        /// <summary>
        /// GET: api/admin/subjects
        /// Get all subjects in the system
        /// </summary>
        /// <returns>List of all subjects</returns>
        [HttpGet("subjects")]
        public async Task<ActionResult<IEnumerable<SubjectDTO>>> GetAllSubjects()
        {
            try
            {
                var subjects = await _evaluationService.GetAllSubjectsAsync();
                return Ok(subjects);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// POST: api/admin/subjects
        /// Create a new subject
        /// </summary>
        /// <param name="createDto">Subject details</param>
        /// <returns>Created subject</returns>
        [HttpPost("subjects")]
        public async Task<ActionResult<SubjectDTO>> CreateSubject([FromBody] CreateSubjectDTO createDto)
        {
            try
            {
                var subject = await _evaluationService.CreateSubjectAsync(createDto);
                return Ok(subject);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// DELETE: api/admin/subjects/{id}
        /// Delete a subject by ID
        /// </summary>
        /// <param name="id">Subject ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("subjects/{id}")]
        public async Task<ActionResult> DeleteSubject(int id)
        {
            try
            {
                var result = await _evaluationService.DeleteSubjectAsync(id);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Template Management

        /// <summary>
        /// GET: api/admin/templates
        /// Get all assignment templates
        /// </summary>
        /// <returns>List of all templates</returns>
        [HttpGet("templates")]
        public async Task<ActionResult<IEnumerable<AssignmentTemplateDTO>>> GetAllTemplates()
        {
            try
            {
                var templates = await _evaluationService.GetAllTemplatesAsync();
                return Ok(templates);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/admin/templates/{id}
        /// Get template by ID
        /// </summary>
        /// <param name="id">Template ID</param>
        /// <returns>Template details</returns>
        [HttpGet("templates/{id}")]
        public async Task<ActionResult<AssignmentTemplateDTO>> GetTemplateById(int id)
        {
            try
            {
                var template = await _evaluationService.GetTemplateByIdAsync(id);
                if (template == null)
                    return NotFound(new { message = "Template not found" });
                return Ok(template);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// POST: api/admin/templates
        /// Create a new assignment template (Assign Template)
        /// Admin selects subject, assigns evaluator, and sets weightage
        /// </summary>
        /// <param name="createDto">Template details with subject, evaluator, and weightage</param>
        /// <returns>Created template</returns>
        [HttpPost("templates")]
        public async Task<ActionResult<AssignmentTemplateDTO>> CreateTemplate([FromBody] CreateAssignmentTemplateDTO createDto)
        {
            try
            {
                var userId = User.GetUserId();
                var template = await _evaluationService.CreateTemplateAsync(createDto, userId);
                return Ok(template);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// PUT: api/admin/templates
        /// Update an existing template
        /// </summary>
        /// <param name="updateDto">Template update details</param>
        /// <returns>Updated template</returns>
        [HttpPut("templates")]
        public async Task<ActionResult<AssignmentTemplateDTO>> UpdateTemplate([FromBody] UpdateAssignmentTemplateDTO updateDto)
        {
            try
            {
                var template = await _evaluationService.UpdateTemplateAsync(updateDto);
                return Ok(template);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// DELETE: api/admin/templates/{id}
        /// Delete a template by ID
        /// </summary>
        /// <param name="id">Template ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("templates/{id}")]
        public async Task<ActionResult> DeleteTemplate(int id)
        {
            try
            {
                var result = await _evaluationService.DeleteTemplateAsync(id);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Evaluator-Intern Mapping

        /// <summary>
        /// GET: api/admin/mappings
        /// Get all evaluator-intern mappings
        /// </summary>
        /// <returns>List of all mappings</returns>
        [HttpGet("mappings")]
        public async Task<ActionResult<IEnumerable<EvaluatorInternDTO>>> GetAllMappings()
        {
            try
            {
                var mappings = await _evaluationService.GetAllMappingsAsync();
                return Ok(mappings);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// POST: api/admin/mappings
        /// Assign intern to evaluator
        /// </summary>
        /// <param name="createDto">Mapping details</param>
        /// <returns>Created mapping</returns>
        [HttpPost("mappings")]
        public async Task<ActionResult<EvaluatorInternDTO>> CreateMapping([FromBody] CreateEvaluatorInternDTO createDto)
        {
            try
            {
                var mapping = await _evaluationService.CreateMappingAsync(createDto);
                return Ok(mapping);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// DELETE: api/admin/mappings/{id}
        /// Remove evaluator-intern mapping
        /// </summary>
        /// <param name="id">Mapping ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("mappings/{id}")]
        public async Task<ActionResult> DeleteMapping(int id)
        {
            try
            {
                var result = await _evaluationService.DeleteMappingAsync(id);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Performance Scores

        /// <summary>
        /// GET: api/admin/scores
        /// Get all performance scores
        /// </summary>
        /// <returns>List of all performance scores</returns>
        [HttpGet("scores")]
        public async Task<ActionResult<IEnumerable<PerformanceScoreDTO>>> GetAllScores()
        {
            try
            {
                var scores = await _evaluationService.GetAllScoresAsync();
                return Ok(scores);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/admin/scores/intern/{internId}
        /// Get performance scores for a specific intern
        /// </summary>
        /// <param name="internId">Intern ID</param>
        /// <returns>Intern's performance scores</returns>
        [HttpGet("scores/intern/{internId}")]
        public async Task<ActionResult<IEnumerable<PerformanceScoreDTO>>> GetInternScores(int internId)
        {
            try
            {
                var scores = await _evaluationService.GetScoresByInternAsync(internId);
                return Ok(scores);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// POST: api/admin/scores
        /// Create/update final performance score after evaluation
        /// Admin adds technical score from evaluator + communication grade (1-10) + attendance
        /// </summary>
        /// <param name="createDto">Performance score details</param>
        /// <returns>Created/updated score</returns>
        [HttpPost("scores")]
        public async Task<ActionResult<PerformanceScoreDTO>> CreateScore([FromBody] CreatePerformanceScoreDTO createDto)
        {
            try
            {
                var score = await _evaluationService.CreateScoreAsync(createDto);
                return Ok(score);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// PUT: api/admin/scores
        /// Update existing performance score
        /// </summary>
        /// <param name="updateDto">Score update details</param>
        /// <returns>Updated score</returns>
        [HttpPut("scores")]
        public async Task<ActionResult<PerformanceScoreDTO>> UpdateScore([FromBody] UpdatePerformanceScoreDTO updateDto)
        {
            try
            {
                var score = await _evaluationService.UpdateScoreAsync(updateDto);
                return Ok(score);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Performance Analytics

        /// <summary>
        /// GET: api/admin/performance/department
        /// Get performance metrics by department
        /// Optional filters: department name and subject ID
        /// </summary>
        /// <param name="department">Filter by department name</param>
        /// <param name="subjectId">Filter by subject ID</param>
        /// <returns>Department performance metrics</returns>
        [HttpGet("performance/department")]
        public async Task<ActionResult<IEnumerable<DepartmentPerformanceDTO>>> GetDepartmentPerformance(
            [FromQuery] string? department = null, 
            [FromQuery] int? subjectId = null)
        {
            try
            {
                var performance = await _evaluationService.GetDepartmentPerformanceAsync(department, subjectId);
                return Ok(performance);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/admin/performance/intern/{internId}
        /// Get detailed performance for a specific intern
        /// </summary>
        /// <param name="internId">Intern ID</param>
        /// <returns>Intern's complete performance data</returns>
        [HttpGet("performance/intern/{internId}")]
        public async Task<ActionResult<InternPerformanceDTO>> GetInternPerformance(int internId)
        {
            try
            {
                var performance = await _evaluationService.GetInternPerformanceAsync(internId);
                if (performance == null)
                    return NotFound(new { message = "Intern not found" });
                return Ok(performance);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion
    }
}
