using GyanTrack.Api.DTOs.Assessments;
using GyanTrack.Api.Models.Assessments;
using GyanTrack.Api.Repositories.Assessments;
using GyanTrack.Api.Repositories.Evaluations;

namespace GyanTrack.Api.Services.Assessments
{
    public class AssessmentService : IAssessmentService
    {
        private readonly ITestRepository _testRepository;
        private readonly IQuestionRepository _questionRepository;
        private readonly IOptionRepository _optionRepository;
        private readonly ITestAttemptRepository _attemptRepository;
        private readonly IAnswerRepository _answerRepository;
        private readonly IEvaluatorRemarkRepository _remarkRepository;

        public AssessmentService(
            ITestRepository testRepository,
            IQuestionRepository questionRepository,
            IOptionRepository optionRepository,
            ITestAttemptRepository attemptRepository,
            IAnswerRepository answerRepository,
            IEvaluatorRemarkRepository remarkRepository)
        {
            _testRepository = testRepository;
            _questionRepository = questionRepository;
            _optionRepository = optionRepository;
            _attemptRepository = attemptRepository;
            _answerRepository = answerRepository;
            _remarkRepository = remarkRepository;
        }

        #region Test

        public async Task<IEnumerable<TestDTO>> GetAllTestsAsync()
        {
            var tests = await _testRepository.GetAllAsync();
            return tests.Select(MapToTestDTO);
        }

        public async Task<TestDTO?> GetTestByIdAsync(int id)
        {
            var test = await _testRepository.GetByIdAsync(id);
            return test == null ? null : MapToTestDTO(test);
        }

        public async Task<IEnumerable<TestDTO>> GetTestsByTemplateAsync(int templateId)
        {
            var tests = await _testRepository.GetByTemplateIdAsync(templateId);
            return tests.Select(MapToTestDTO);
        }

        public async Task<IEnumerable<TestDTO>> GetTestsByEvaluatorAsync(int evaluatorId)
        {
            var tests = await _testRepository.GetByEvaluatorIdAsync(evaluatorId);
            return tests.Select(MapToTestDTO);
        }

        public async Task<TestDTO> CreateTestAsync(CreateTestDTO createDto, int createdBy)
        {
            var test = new Test
            {
                TemplateID = createDto.TemplateId,
                Title = createDto.Title,
                StartTime = createDto.StartTime,
                EndTime = createDto.EndTime,
                DurationMinutes = createDto.DurationMinutes,
                CreatedBy = createdBy
            };
            var created = await _testRepository.CreateAsync(test);
            return MapToTestDTO(created);
        }

        public async Task<TestDTO> UpdateTestAsync(UpdateTestDTO updateDto)
        {
            var test = await _testRepository.GetByIdAsync(updateDto.Id);
            if (test == null)
                throw new InvalidOperationException("Test not found");

            test.TemplateID = updateDto.TemplateId;
            test.Title = updateDto.Title;
            test.StartTime = updateDto.StartTime;
            test.EndTime = updateDto.EndTime;
            test.DurationMinutes = updateDto.DurationMinutes;

            var updated = await _testRepository.UpdateAsync(test);
            return MapToTestDTO(updated);
        }

        public async Task<bool> DeleteTestAsync(int id)
        {
            return await _testRepository.DeleteAsync(id);
        }

        #endregion

        #region Question

        public async Task<IEnumerable<QuestionDTO>> GetQuestionsByTestAsync(int testId)
        {
            var questions = await _questionRepository.GetByTestIdAsync(testId);
            return questions.Select(MapToQuestionDTO);
        }

        public async Task<QuestionDTO?> GetQuestionByIdAsync(int id)
        {
            var question = await _questionRepository.GetByIdAsync(id);
            return question == null ? null : MapToQuestionDTO(question);
        }

        public async Task<QuestionDTO> CreateQuestionAsync(CreateQuestionDTO createDto)
        {
            var question = new Question
            {
                TestID = createDto.TestId,
                QuestionText = createDto.QuestionText,
                Marks = createDto.Marks
            };
            var createdQuestion = await _questionRepository.CreateAsync(question);

            // Create options
            foreach (var optionDto in createDto.Options)
            {
                var option = new Option
                {
                    QuestionID = createdQuestion.Id,
                    OptionText = optionDto.OptionText,
                    IsCorrect = optionDto.IsCorrect
                };
                await _optionRepository.CreateAsync(option);
            }

            // Reload with options
            var fullQuestion = await _questionRepository.GetByIdAsync(createdQuestion.Id);
            return MapToQuestionDTO(fullQuestion!);
        }

        public async Task<QuestionDTO> UpdateQuestionAsync(UpdateQuestionDTO updateDto)
        {
            var question = await _questionRepository.GetByIdAsync(updateDto.Id);
            if (question == null)
                throw new InvalidOperationException("Question not found");

            question.QuestionText = updateDto.QuestionText;
            question.Marks = updateDto.Marks;

            var updated = await _questionRepository.UpdateAsync(question);
            return MapToQuestionDTO(updated);
        }

        public async Task<bool> DeleteQuestionAsync(int id)
        {
            return await _questionRepository.DeleteAsync(id);
        }

        #endregion

        #region Test Attempt

        public async Task<TestAttemptDTO?> GetAttemptByIdAsync(int id)
        {
            var attempt = await _attemptRepository.GetByIdAsync(id);
            return attempt == null ? null : MapToAttemptDTO(attempt);
        }

        public async Task<IEnumerable<TestAttemptDTO>> GetAttemptsByTestAsync(int testId)
        {
            var attempts = await _attemptRepository.GetByTestIdAsync(testId);
            return attempts.Select(MapToAttemptDTO);
        }

        public async Task<IEnumerable<TestAttemptDTO>> GetAttemptsByInternAsync(int internId)
        {
            var attempts = await _attemptRepository.GetByInternIdAsync(internId);
            return attempts.Select(MapToAttemptDTO);
        }

        public async Task<TestAttemptDTO> StartTestAsync(StartTestAttemptDTO startDto)
        {
            var test = await _testRepository.GetByIdAsync(startDto.TestId);
            if (test == null)
                throw new InvalidOperationException("Test not found");

            var now = DateTime.UtcNow;
            if (now < test.StartTime || now > test.EndTime)
                throw new InvalidOperationException("Test is not available at this time");

            // Check if already attempted
            var existingAttempt = await _attemptRepository.GetActiveAttemptAsync(startDto.InternId, startDto.TestId);
            if (existingAttempt != null)
                throw new InvalidOperationException("Test already started");

            var attempt = new TestAttempt
            {
                TestID = startDto.TestId,
                InternID = startDto.InternId,
                StartTime = now,
                IsSubmitted = false
            };

            var created = await _attemptRepository.CreateAsync(attempt);
            return MapToAttemptDTO(created);
        }

        public async Task<TestAttemptDTO> SubmitTestAsync(SubmitTestAttemptDTO submitDto)
        {
            var attempt = await _attemptRepository.GetByIdAsync(submitDto.AttemptId);
            if (attempt == null)
                throw new InvalidOperationException("Attempt not found");

            if (attempt.IsSubmitted)
                throw new InvalidOperationException("Test already submitted");

            decimal totalScore = 0;
            decimal totalMarks = 0;

            foreach (var answerDto in submitDto.Answers)
            {
                var question = await _questionRepository.GetByIdAsync(answerDto.QuestionId);
                if (question == null) continue;

                var selectedOption = await _optionRepository.GetByIdAsync(answerDto.SelectedOptionId);
                bool isCorrect = selectedOption?.IsCorrect ?? false;
                decimal marksAwarded = isCorrect ? question.Marks : 0;

                var answer = new Answer
                {
                    AttemptID = submitDto.AttemptId,
                    QuestionID = answerDto.QuestionId,
                    SelectedOptionID = answerDto.SelectedOptionId,
                    IsCorrect = isCorrect,
                    MarksAwarded = marksAwarded
                };

                await _answerRepository.CreateAsync(answer);

                totalMarks += question.Marks;
                totalScore += marksAwarded;
            }

            attempt.EndTime = DateTime.UtcNow;
            attempt.IsSubmitted = true;
            attempt.Score = totalMarks > 0 ? (totalScore / totalMarks) * 100 : 0;
            attempt.SystemScore = attempt.Score;
            attempt.TabSwitchCount = submitDto.TabSwitchCount;
            attempt.WindowFocusLossCount = submitDto.WindowFocusLossCount;
            attempt.CopyPasteCount = submitDto.CopyPasteCount;
            attempt.IsVerified = false;

            var updated = await _attemptRepository.UpdateAsync(attempt);
            return MapToAttemptDTO(updated);
        }

        public async Task<TestAttemptDTO> MarkAttemptVerifiedAsync(int attemptId)
        {
            var attempt = await _attemptRepository.GetByIdAsync(attemptId);
            if (attempt == null) throw new InvalidOperationException("Attempt not found");

            attempt.IsVerified = true;
            var updated = await _attemptRepository.UpdateAsync(attempt);
            return MapToAttemptDTO(updated);
        }

        public async Task<IEnumerable<TestAttemptDTO>> GetPendingSubmissionsByEvaluatorAsync(int evaluatorId)
        {
            var attempts = await _attemptRepository.GetPendingVerificationsByEvaluatorAsync(evaluatorId);
            return attempts.Select(MapToAttemptDTO);
        }

        public async Task<IEnumerable<TestAttemptDTO>> GetPendingHRVerificationsAsync()
        {
            var attempts = await _attemptRepository.GetPendingHRVerificationsAsync();
            return attempts.Select(MapToAttemptDTO);
        }

        #endregion

        #region Test Results

        public async Task<TestResultDTO?> GetTestResultAsync(int attemptId)
        {
            var attempt = await _attemptRepository.GetByIdAsync(attemptId);
            if (attempt == null)
                return null;

            var answers = await _answerRepository.GetByAttemptIdAsync(attemptId);
            var answerList = answers.ToList();

            var test = await _testRepository.GetByIdAsync(attempt.TestID);

            var testTitle = "";
            var subjectName = "";
            var totalQuestions = 0;
            if (test != null)
            {
                testTitle = test.Title;
                if (test.Template != null && test.Template.Subject != null)
                {
                    subjectName = test.Template.Subject.SubjectName;
                }
                if (test.Questions != null)
                {
                    totalQuestions = test.Questions.Sum(q => q.Marks);
                }
            }

            return new TestResultDTO
            {
                AttemptId = attempt.Id,
                TestId = attempt.TestID,
                TestTitle = testTitle,
                SubjectName = subjectName,
                TotalScore = totalQuestions,
                ObtainedScore = answerList.Sum(a => a.MarksAwarded),
                Percentage = attempt.Score,
                TotalQuestions = answerList.Count,
                CorrectAnswers = answerList.Count(a => a.IsCorrect),
                WrongAnswers = answerList.Count(a => !a.IsCorrect),
                StartTime = attempt.StartTime,
                EndTime = attempt.EndTime,
                Answers = answerList.Select(MapToAnswerDTO).ToList()
            };
        }

        public async Task<IEnumerable<InternTestDTO>> GetInternTestsAsync(int internId)
        {
            var allTests = await _testRepository.GetAllAsync();
            var attempts = await _attemptRepository.GetByInternIdAsync(internId);
            var attemptDict = attempts.ToDictionary(a => a.TestID);
            var now = DateTime.UtcNow;

            var result = new List<InternTestDTO>();
            foreach (var t in allTests)
            {
                var subjectName = "";
                if (t.Template != null && t.Template.Subject != null)
                {
                    subjectName = t.Template.Subject.SubjectName;
                }

                var isLive = t.StartTime <= now && t.EndTime >= now;
                var hasAttempted = attemptDict.ContainsKey(t.Id);
                decimal? obtainedScore = null;
                if (hasAttempted)
                {
                    obtainedScore = attemptDict[t.Id].Score;
                }

                result.Add(new InternTestDTO
                {
                    TestId = t.Id,
                    Title = t.Title,
                    SubjectName = subjectName,
                    StartTime = t.StartTime,
                    EndTime = t.EndTime,
                    DurationMinutes = t.DurationMinutes,
                    IsLive = isLive,
                    HasAttempted = hasAttempted,
                    ObtainedScore = obtainedScore,
                    TotalScore = 100
                });
            }

            return result.OrderByDescending(t => t.StartTime);
        }

        #endregion

        #region Private Mappers

        private TestDTO MapToTestDTO(Test test)
        {
            var templateName = "";
            var subjectName = "";
            var createdByName = "";
            var totalQuestions = 0;

            if (test.Template != null)
            {
                templateName = test.Template.Subject != null ? test.Template.Subject.SubjectName : "";
                subjectName = templateName;
            }

            if (test.CreatedByEvaluator != null)
            {
                createdByName = test.CreatedByEvaluator.FullName;
            }

            if (test.Questions != null)
            {
                totalQuestions = test.Questions.Count;
            }

            return new TestDTO
            {
                Id = test.Id,
                TemplateId = test.TemplateID,
                TemplateName = templateName,
                SubjectName = subjectName,
                Title = test.Title,
                StartTime = test.StartTime,
                EndTime = test.EndTime,
                DurationMinutes = test.DurationMinutes,
                CreatedBy = test.CreatedBy,
                CreatedByName = createdByName,
                CreatedAt = test.CreatedAt,
                IsDeleted = test.IsDeleted,
                IsLive = test.StartTime <= DateTime.UtcNow && test.EndTime >= DateTime.UtcNow,
                TotalQuestions = totalQuestions
            };
        }

        private QuestionDTO MapToQuestionDTO(Question question)
        {
            var options = new List<OptionDTO>();
            if (question.Options != null)
            {
                foreach (var opt in question.Options)
                {
                    options.Add(MapToOptionDTO(opt));
                }
            }

            return new QuestionDTO
            {
                Id = question.Id,
                TestId = question.TestID,
                QuestionText = question.QuestionText,
                Marks = question.Marks,
                CreatedAt = question.CreatedAt,
                IsDeleted = question.IsDeleted,
                Options = options
            };
        }

        private OptionDTO MapToOptionDTO(Option option)
        {
            return new OptionDTO
            {
                Id = option.OptionID,
                QuestionId = option.QuestionID,
                OptionText = option.OptionText,
                IsCorrect = option.IsCorrect
            };
        }

        private TestAttemptDTO MapToAttemptDTO(TestAttempt attempt)
        {
            var testTitle = "";
            var internName = "";
            var templateId = 0;
            var evaluatorId = 0;

            if (attempt.Test != null)
            {
                testTitle = attempt.Test.Title;
                if (attempt.Test.Template != null)
                {
                    templateId = attempt.Test.Template.Id;
                    evaluatorId = attempt.Test.Template.EvaluatorID;
                }
            }

            if (attempt.Intern != null)
            {
                internName = attempt.Intern.FullName;
            }

            return new TestAttemptDTO
            {
                Id = attempt.Id,
                TestId = attempt.TestID,
                TestTitle = testTitle,
                InternId = attempt.InternID,
                InternName = internName,
                TemplateId = templateId,
                EvaluatorId = evaluatorId,
                StartTime = attempt.StartTime,
                EndTime = attempt.EndTime,
                Score = attempt.Score,
                SystemScore = attempt.SystemScore,
                TabSwitchCount = attempt.TabSwitchCount,
                WindowFocusLossCount = attempt.WindowFocusLossCount,
                CopyPasteCount = attempt.CopyPasteCount,
                IsSubmitted = attempt.IsSubmitted,
                IsVerified = attempt.IsVerified,
                CreatedAt = attempt.CreatedAt,
                IsDeleted = attempt.IsDeleted
            };
        }

        private AnswerDTO MapToAnswerDTO(Answer answer)
        {
            var questionText = "";
            var selectedOptionText = "";

            if (answer.Question != null)
            {
                questionText = answer.Question.QuestionText;
            }

            if (answer.SelectedOption != null)
            {
                selectedOptionText = answer.SelectedOption.OptionText;
            }

            return new AnswerDTO
            {
                Id = answer.Id,
                AttemptId = answer.AttemptID,
                QuestionId = answer.QuestionID,
                QuestionText = questionText,
                SelectedOptionId = answer.SelectedOptionID,
                SelectedOptionText = selectedOptionText,
                IsCorrect = answer.IsCorrect,
                MarksAwarded = answer.MarksAwarded,
                CreatedAt = answer.CreatedAt
            };
        }

        #endregion
    }
}
