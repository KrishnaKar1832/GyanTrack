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
    /// Intern Controller - Handles all intern-related operations
    /// Requires JWT authentication
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Intern")]
    public class InternController : ControllerBase
    {
        private readonly IAssessmentService _assessmentService;
        private readonly IEvaluationService _evaluationService;

        public InternController(
            IAssessmentService assessmentService,
            IEvaluationService evaluationService)
        {
            _assessmentService = assessmentService;
            _evaluationService = evaluationService;
        }

        #region Tests

        /// <summary>
        /// GET: api/intern/tests
        /// Get all available tests for the intern (live, upcoming, and previous)
        /// </summary>
        /// <returns>List of all tests with their status</returns>
        [HttpGet("tests")]
        public async Task<ActionResult<IEnumerable<InternTestDTO>>> GetAllTests()
        {
            try
            {
                var userId = User.GetUserId();
                var tests = await _assessmentService.GetInternTestsAsync(userId);
                return Ok(tests);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/intern/tests/live
        /// Get currently live tests that the intern can attempt
        /// </summary>
        /// <returns>List of live tests</returns>
        [HttpGet("tests/live")]
        public async Task<ActionResult<IEnumerable<InternTestDTO>>> GetLiveTests()
        {
            try
            {
                var userId = User.GetUserId();
                var allTests = await _assessmentService.GetInternTestsAsync(userId);
                var liveTests = allTests.Where(t => t.IsLive && !t.HasAttempted);
                return Ok(liveTests);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/intern/tests/upcoming
        /// Get upcoming tests that are scheduled but not yet started
        /// </summary>
        /// <returns>List of upcoming tests</returns>
        [HttpGet("tests/upcoming")]
        public async Task<ActionResult<IEnumerable<InternTestDTO>>> GetUpcomingTests()
        {
            try
            {
                var userId = User.GetUserId();
                var allTests = await _assessmentService.GetInternTestsAsync(userId);
                var upcomingTests = allTests.Where(t => !t.IsLive && !t.HasAttempted && t.StartTime > DateTime.UtcNow);
                return Ok(upcomingTests);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/intern/tests/previous
        /// Get previously attempted tests with scores
        /// </summary>
        /// <returns>List of previous test attempts</returns>
        [HttpGet("tests/previous")]
        public async Task<ActionResult<IEnumerable<InternTestDTO>>> GetPreviousTests()
        {
            try
            {
                var userId = User.GetUserId();
                var allTests = await _assessmentService.GetInternTestsAsync(userId);
                var previousTests = allTests.Where(t => t.HasAttempted);
                return Ok(previousTests);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/intern/tests/{testId}
        /// Get details of a specific test
        /// </summary>
        /// <param name="testId">Test ID</param>
        /// <returns>Test details</returns>
        [HttpGet("tests/{testId}")]
        public async Task<ActionResult<InternTestDTO>> GetTestById(int testId)
        {
            try
            {
                var userId = User.GetUserId();
                var allTests = await _assessmentService.GetInternTestsAsync(userId);
                var test = allTests.FirstOrDefault(t => t.TestId == testId);
                
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
        /// GET: api/intern/tests/{testId}/questions
        /// Get questions for a specific test (for taking the test)
        /// </summary>
        /// <param name="testId">Test ID</param>
        /// <returns>List of questions with options</returns>
        [HttpGet("tests/{testId}/questions")]
        public async Task<ActionResult<IEnumerable<QuestionDTO>>> GetTestQuestions(int testId)
        {
            try
            {
                var userId = User.GetUserId();
                var allTests = await _assessmentService.GetInternTestsAsync(userId);
                var test = allTests.FirstOrDefault(t => t.TestId == testId);
                
                if (test == null)
                    return NotFound(new { message = "Test not found" });

                // Only allow viewing questions for live tests that haven't been attempted
                if (!test.IsLive || test.HasAttempted)
                    return BadRequest(new { message = "Test is not available for viewing questions" });

                var questions = await _assessmentService.GetQuestionsByTestAsync(testId);
                
                // Hide correct answers from intern
                var questionsWithoutCorrectAnswers = questions.Select(q => new QuestionDTO
                {
                    Id = q.Id,
                    TestId = q.TestId,
                    QuestionText = q.QuestionText,
                    Marks = q.Marks,
                    CreatedAt = q.CreatedAt,
                    IsDeleted = q.IsDeleted,
                    Options = q.Options?.Select(o => new OptionDTO
                    {
                        Id = o.Id,
                        QuestionId = o.QuestionId,
                        OptionText = o.OptionText,
                        IsCorrect = false // Hide correct answers
                    }).ToList() ?? new List<OptionDTO>()
                });

                return Ok(questionsWithoutCorrectAnswers);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// POST: api/intern/tests/{testId}/start
        /// Start a test attempt
        /// </summary>
        /// <param name="testId">Test ID</param>
        /// <returns>Test attempt details</returns>
        [HttpPost("tests/{testId}/start")]
        public async Task<ActionResult<TestAttemptDTO>> StartTest(int testId)
        {
            try
            {
                var userId = User.GetUserId();
                
                var startDto = new StartTestAttemptDTO
                {
                    TestId = testId,
                    InternId = userId
                };

                var attempt = await _assessmentService.StartTestAsync(startDto);
                return Ok(attempt);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// POST: api/intern/tests/{testId}/submit
        /// Submit a test attempt
        /// </summary>
        /// <param name="testId">Test ID</param>
        /// <param name="submitDto">Answers to submit</param>
        /// <returns>Test result</returns>
        [HttpPost("tests/{testId}/submit")]
        public async Task<ActionResult<TestAttemptDTO>> SubmitTest(int testId, [FromBody] SubmitTestAttemptDTO submitDto)
        {
            try
            {
                var userId = User.GetUserId();
                
                // Ensure the attempt belongs to this intern
                submitDto.AttemptId = submitDto.AttemptId;
                
                var result = await _assessmentService.SubmitTestAsync(submitDto);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Results

        /// <summary>
        /// GET: api/intern/results
        /// Get all test results for the current intern
        /// </summary>
        /// <returns>List of all test attempts with scores</returns>
        [HttpGet("results")]
        public async Task<ActionResult<IEnumerable<TestAttemptDTO>>> GetMyResults()
        {
            try
            {
                var userId = User.GetUserId();
                var attempts = await _assessmentService.GetAttemptsByInternAsync(userId);
                return Ok(attempts);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/intern/results/{attemptId}
        /// Get detailed result of a specific test attempt
        /// </summary>
        /// <param name="attemptId">Attempt ID</param>
        /// <returns>Detailed test result with answers</returns>
        [HttpGet("results/{attemptId}")]
        public async Task<ActionResult<TestResultDTO>> GetTestResult(int attemptId)
        {
            try
            {
                var userId = User.GetUserId();
                
                var result = await _assessmentService.GetTestResultAsync(attemptId);
                
                if (result == null)
                    return NotFound(new { message = "Result not found" });

                // Only allow intern to view their own results
                var attempts = await _assessmentService.GetAttemptsByInternAsync(userId);
                var ownAttempt = attempts.FirstOrDefault(a => a.Id == attemptId);
                
                if (ownAttempt == null)
                    return Forbid();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/intern/tests/{testId}/result
        /// Get result for a specific test (if attempted)
        /// </summary>
        /// <param name="testId">Test ID</param>
        /// <returns>Test result if attempted</returns>
        [HttpGet("tests/{testId}/result")]
        public async Task<ActionResult<TestResultDTO>> GetTestResultByTestId(int testId)
        {
            try
            {
                var userId = User.GetUserId();
                
                var attempts = await _assessmentService.GetAttemptsByInternAsync(userId);
                var attempt = attempts.FirstOrDefault(a => a.TestId == testId && a.IsSubmitted);
                
                if (attempt == null)
                    return NotFound(new { message = "No submitted attempt found for this test" });

                var result = await _assessmentService.GetTestResultAsync(attempt.Id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Evaluations

        /// <summary>
        /// GET: api/intern/evaluations
        /// Get performance evaluations for the current intern
        /// </summary>
        /// <returns>List of performance scores</returns>
        [HttpGet("evaluations")]
        public async Task<ActionResult<IEnumerable<PerformanceScoreDTO>>> GetMyEvaluations()
        {
            try
            {
                var userId = User.GetUserId();
                var evaluations = await _evaluationService.GetEvaluationsByInternAsync(userId);
                return Ok(evaluations);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: api/intern/evaluations/{templateId}
        /// Get evaluation for a specific template
        /// </summary>
        /// <param name="templateId">Template ID</param>
        /// <returns>Performance score for the template</returns>
        [HttpGet("evaluations/{templateId}")]
        public async Task<ActionResult<PerformanceScoreDTO>> GetMyEvaluationByTemplate(int templateId)
        {
            try
            {
                var userId = User.GetUserId();
                var evaluation = await _evaluationService.GetEvaluationByInternAndTemplateAsync(userId, templateId);
                
                if (evaluation == null)
                    return NotFound(new { message = "Evaluation not found" });
                
                return Ok(evaluation);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Profile

        /// <summary>
        /// GET: api/intern/profile
        /// Get current intern's profile
        /// </summary>
        /// <returns>Intern profile details</returns>
        [HttpGet("profile")]
        public async Task<ActionResult> GetMyProfile()
        {
            try
            {
                var userId = User.GetUserId();
                var profile = await _evaluationService.GetInternProfileAsync(userId);
                
                if (profile == null)
                    return NotFound(new { message = "Profile not found" });
                
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion
    }
}
