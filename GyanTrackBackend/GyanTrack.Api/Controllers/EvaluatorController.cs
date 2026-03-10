using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GyanTrack.Api.DTOs.Assessments;
using GyanTrack.Api.DTOs.Evaluations;
using GyanTrack.Api.Services.Assessments;
using GyanTrack.Api.Services.Evaluations;
using GyanTrack.Api.Extensions;

namespace GyanTrack.Api.Controllers
{
    /// <summary>
    /// Evaluator Controller - Handles all evaluator-related operations
    /// Requires JWT authentication with Evaluator role
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Evaluator")]
    public class EvaluatorController : ControllerBase
    {
        private readonly IAssessmentService _assessmentService;
        private readonly IEvaluationService _evaluationService;

        public EvaluatorController(
            IAssessmentService assessmentService,
            IEvaluationService evaluationService)
        {
            _assessmentService = assessmentService;
            _evaluationService = evaluationService;
        }

        #region Template Management (Assigned by Admin)

        /// <summary>
        /// GET: api/evaluator/templates
        /// Get all assignment templates assigned to this evaluator by Admin
        /// </summary>
        /// <returns>List of assigned templates</returns>
        [HttpGet("templates")]
        public async Task<ActionResult<IEnumerable<AssignmentTemplateDTO>>> GetAssignedTemplates()
        {
            try
            {
                var userId = User.GetUserId();
                var templates = await _evaluationService.GetTemplatesByEvaluatorAsync(userId);
                return Ok(templates);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Test Management

        /// <summary>
        /// GET: api/evaluator/tests
        /// Get all tests created by this evaluator
        /// </summary>
        /// <returns>List of created tests</returns>
        [HttpGet("tests")]
        public async Task<ActionResult<IEnumerable<TestDTO>>> GetCreatedTests()
        {
            try
            {
                var userId = User.GetUserId();
                var tests = await _assessmentService.GetTestsByEvaluatorAsync(userId);
                return Ok(tests);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/evaluator/tests/{id}
        /// Get test details by ID
        /// </summary>
        /// <param name="id">Test ID</param>
        /// <returns>Test details</returns>
        [HttpGet("tests/{id}")]
        public async Task<ActionResult<TestDTO>> GetTestById(int id)
        {
            try
            {
                var test = await _assessmentService.GetTestByIdAsync(id);
                if (test == null)
                    return NotFound(new { message = "Test not found" });
                return Ok(test);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// POST: api/evaluator/tests
        /// Create a new test using an assigned template
        /// Evaluator receives template from Admin and creates test
        /// </summary>
        /// <param name="createDto">Test creation details</param>
        /// <returns>Created test</returns>
        [HttpPost("tests")]
        public async Task<ActionResult<TestDTO>> CreateTest([FromBody] CreateTestDTO createDto)
        {
            try
            {
                var userId = User.GetUserId();
                var test = await _assessmentService.CreateTestAsync(createDto, userId);
                return Ok(test);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// PUT: api/evaluator/tests
        /// Update an existing test
        /// </summary>
        /// <param name="updateDto">Test update details</param>
        /// <returns>Updated test</returns>
        [HttpPut("tests")]
        public async Task<ActionResult<TestDTO>> UpdateTest([FromBody] UpdateTestDTO updateDto)
        {
            try
            {
                var test = await _assessmentService.UpdateTestAsync(updateDto);
                return Ok(test);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// DELETE: api/evaluator/tests/{id}
        /// Delete a test by ID
        /// </summary>
        /// <param name="id">Test ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("tests/{id}")]
        public async Task<ActionResult> DeleteTest(int id)
        {
            try
            {
                var result = await _assessmentService.DeleteTestAsync(id);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Question Management

        /// <summary>
        /// GET: api/evaluator/tests/{testId}/questions
        /// Get all questions for a specific test
        /// </summary>
        /// <param name="testId">Test ID</param>
        /// <returns>List of questions</returns>
        [HttpGet("tests/{testId}/questions")]
        public async Task<ActionResult<IEnumerable<QuestionDTO>>> GetTestQuestions(int testId)
        {
            try
            {
                var questions = await _assessmentService.GetQuestionsByTestAsync(testId);
                return Ok(questions);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/evaluator/questions/{id}
        /// Get question details by ID
        /// </summary>
        /// <param name="id">Question ID</param>
        /// <returns>Question details with options</returns>
        [HttpGet("questions/{id}")]
        public async Task<ActionResult<QuestionDTO>> GetQuestionById(int id)
        {
            try
            {
                var question = await _assessmentService.GetQuestionByIdAsync(id);
                if (question == null)
                    return NotFound(new { message = "Question not found" });
                return Ok(question);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// POST: api/evaluator/questions
        /// Create a new question with MCQ or MSQ options
        /// Evaluator inserts questions and correct answers
        /// </summary>
        /// <param name="createDto">Question creation details</param>
        /// <returns>Created question with options</returns>
        [HttpPost("questions")]
        public async Task<ActionResult<QuestionDTO>> CreateQuestion([FromBody] CreateQuestionDTO createDto)
        {
            try
            {
                var question = await _assessmentService.CreateQuestionAsync(createDto);
                return Ok(question);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// PUT: api/evaluator/questions
        /// Update an existing question
        /// </summary>
        /// <param name="updateDto">Question update details</param>
        /// <returns>Updated question</returns>
        [HttpPut("questions")]
        public async Task<ActionResult<QuestionDTO>> UpdateQuestion([FromBody] UpdateQuestionDTO updateDto)
        {
            try
            {
                var question = await _assessmentService.UpdateQuestionAsync(updateDto);
                return Ok(question);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// DELETE: api/evaluator/questions/{id}
        /// Delete a question by ID
        /// </summary>
        /// <param name="id">Question ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("questions/{id}")]
        public async Task<ActionResult> DeleteQuestion(int id)
        {
            try
            {
                var result = await _assessmentService.DeleteQuestionAsync(id);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Test Attempts & Submissions

        /// <summary>
        /// GET: api/evaluator/tests/{testId}/attempts
        /// Get all submitted attempts for a test
        /// View submitted score cards by each student
        /// </summary>
        /// <param name="testId">Test ID</param>
        /// <returns>List of submitted attempts</returns>
        [HttpGet("tests/{testId}/attempts")]
        public async Task<ActionResult<IEnumerable<TestAttemptDTO>>> GetTestAttempts(int testId)
        {
            try
            {
                var attempts = await _assessmentService.GetAttemptsByTestAsync(testId);
                return Ok(attempts);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/evaluator/attempts/{attemptId}
        /// Get detailed attempt information including questions and answers
        /// See student's questions, their submitted answers, and test activity
        /// </summary>
        /// <param name="attemptId">Attempt ID</param>
        /// <returns>Detailed attempt with all answers</returns>
        [HttpGet("attempts/{attemptId}")]
        public async Task<ActionResult<TestResultDTO>> GetAttemptDetails(int attemptId)
        {
            try
            {
                var result = await _assessmentService.GetTestResultAsync(attemptId);
                if (result == null)
                    return NotFound(new { message = "Attempt not found" });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/evaluator/attempts/{attemptId}/detailed
        /// Get detailed test attempt with proctoring information
        /// See activity while giving test (tab switches, copy paste, full screen exits)
        /// </summary>
        /// <param name="attemptId">Attempt ID</param>
        /// <returns>Detailed attempt with proctoring data</returns>
        [HttpGet("attempts/{attemptId}/detailed")]
        public async Task<ActionResult<TestResultDTO>> GetDetailedAttempt(int attemptId)
        {
            try
            {
                var result = await _assessmentService.GetTestResultAsync(attemptId);
                if (result == null)
                    return NotFound(new { message = "Attempt not found" });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Evaluation & Remarks

        /// <summary>
        /// GET: api/evaluator/attempts/pending
        /// Get all submitted attempts waiting for evaluator verification
        /// </summary>
        /// <returns>List of pending test attempts</returns>
        [HttpGet("attempts/pending")]
        public async Task<ActionResult<IEnumerable<TestAttemptDTO>>> GetPendingSubmissions()
        {
            try
            {
                var userId = User.GetUserId();
                var attempts = await _assessmentService.GetPendingSubmissionsByEvaluatorAsync(userId);
                return Ok(attempts);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// PUT: api/evaluator/attempts/{attemptId}/verify
        /// Verify an attempt and add remarks
        /// </summary>
        /// <param name="attemptId">Attempt ID</param>
        /// <param name="verifyDto">Remarks for the verification</param>
        /// <returns>Created EvaluatorRemark</returns>
        [HttpPut("attempts/{attemptId}/verify")]
        public async Task<ActionResult<EvaluatorRemarkDTO>> VerifyAttempt(int attemptId, [FromBody] VerifyAttemptDTO verifyDto)
        {
            try
            {
                var evaluatorId = User.GetUserId();
                var remark = await _evaluationService.VerifyInternEvaluationAsync(attemptId, evaluatorId, verifyDto);
                return Ok(remark);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Performance & Analytics

        /// <summary>
        /// GET: api/evaluator/performance/intern/{internId}
        /// Get performance matrix for a specific intern in evaluator's department
        /// </summary>
        /// <param name="internId">Intern ID</param>
        /// <returns>Intern's performance data</returns>
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

        /// <summary>
        /// GET: api/evaluator/performance/department
        /// Get performance matrix for evaluator's department
        /// </summary>
        /// <returns>Department performance metrics</returns>
        [HttpGet("performance/department")]
        public async Task<ActionResult<IEnumerable<DepartmentPerformanceDTO>>> GetDepartmentPerformance()
        {
            try
            {
                var userId = User.GetUserId();
                var performance = await _evaluationService.GetDepartmentPerformanceAsync(null, null);
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
