using Microsoft.EntityFrameworkCore;
using GyanTrack.Api.Data;
using GyanTrack.Api.Models.Assessments;

namespace GyanTrack.Api.Repositories.Assessments
{
    public class TestRepository : ITestRepository
    {
        private readonly GyanTrackDbContext _context;

        public TestRepository(GyanTrackDbContext context)
        {
            _context = context;
        }

        public async Task<Test?> GetByIdAsync(int id)
        {
            return await _context.Tests
                .Include(t => t.Template)
                    .ThenInclude(t => t.Subject)
                .Include(t => t.CreatedByEvaluator)
                    .ThenInclude(e => e.User)
                .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);
        }

        public async Task<IEnumerable<Test>> GetAllAsync()
        {
            return await _context.Tests
                .Include(t => t.Template)
                    .ThenInclude(t => t.Subject)
                .Include(t => t.CreatedByEvaluator)
                    .ThenInclude(e => e.User)
                .Where(t => !t.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<Test>> GetByTemplateIdAsync(int templateId)
        {
            return await _context.Tests
                .Include(t => t.Template)
                    .ThenInclude(t => t.Subject)
                .Include(t => t.CreatedByEvaluator)
                    .ThenInclude(e => e.User)
                .Where(t => t.TemplateID == templateId && !t.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<Test>> GetByEvaluatorIdAsync(int evaluatorId)
        {
            return await _context.Tests
                .Include(t => t.Template)
                    .ThenInclude(t => t.Subject)
                .Include(t => t.CreatedByEvaluator)
                    .ThenInclude(e => e.User)
                .Where(t => t.CreatedBy == evaluatorId && !t.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<Test>> GetLiveTestsAsync()
        {
            var now = DateTime.UtcNow;
            return await _context.Tests
                .Include(t => t.Template)
                    .ThenInclude(t => t.Subject)
                .Include(t => t.CreatedByEvaluator)
                    .ThenInclude(e => e.User)
                .Where(t => t.StartTime <= now && t.EndTime >= now && !t.IsDeleted)
                .ToListAsync();
        }

        public async Task<Test> CreateAsync(Test test)
        {
            _context.Tests.Add(test);
            await _context.SaveChangesAsync();
            return test;
        }

        public async Task<Test> UpdateAsync(Test test)
        {
            test.UpdatedAt = DateTime.UtcNow;
            _context.Tests.Update(test);
            await _context.SaveChangesAsync();
            return test;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var test = await _context.Tests.FindAsync(id);
            if (test == null) return false;

            test.IsDeleted = true;
            test.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class QuestionRepository : IQuestionRepository
    {
        private readonly GyanTrackDbContext _context;

        public QuestionRepository(GyanTrackDbContext context)
        {
            _context = context;
        }

        public async Task<Question?> GetByIdAsync(int id)
        {
            return await _context.Questions
                .Include(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == id && !q.IsDeleted);
        }

        public async Task<IEnumerable<Question>> GetAllAsync()
        {
            return await _context.Questions
                .Include(q => q.Options)
                .Where(q => !q.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<Question>> GetByTestIdAsync(int testId)
        {
            return await _context.Questions
                .Include(q => q.Options)
                .Where(q => q.TestID == testId && !q.IsDeleted)
                .ToListAsync();
        }

        public async Task<Question> CreateAsync(Question question)
        {
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();
            return question;
        }

        public async Task<Question> UpdateAsync(Question question)
        {
            question.UpdatedAt = DateTime.UtcNow;
            _context.Questions.Update(question);
            await _context.SaveChangesAsync();
            return question;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null) return false;

            question.IsDeleted = true;
            question.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class OptionRepository : IOptionRepository
    {
        private readonly GyanTrackDbContext _context;

        public OptionRepository(GyanTrackDbContext context)
        {
            _context = context;
        }

        public async Task<Option?> GetByIdAsync(int id)
        {
            return await _context.Options.FindAsync(id);
        }

        public async Task<IEnumerable<Option>> GetAllAsync()
        {
            return await _context.Options.ToListAsync();
        }

        public async Task<IEnumerable<Option>> GetByQuestionIdAsync(int questionId)
        {
            return await _context.Options
                .Where(o => o.QuestionID == questionId)
                .ToListAsync();
        }

        public async Task<Option> CreateAsync(Option option)
        {
            _context.Options.Add(option);
            await _context.SaveChangesAsync();
            return option;
        }

        public async Task<Option> UpdateAsync(Option option)
        {
            _context.Options.Update(option);
            await _context.SaveChangesAsync();
            return option;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var option = await _context.Options.FindAsync(id);
            if (option == null) return false;

            _context.Options.Remove(option);
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class TestAttemptRepository : ITestAttemptRepository
    {
        private readonly GyanTrackDbContext _context;

        public TestAttemptRepository(GyanTrackDbContext context)
        {
            _context = context;
        }

        public async Task<TestAttempt?> GetByIdAsync(int id)
        {
            return await _context.TestAttempts
                .Include(ta => ta.Test)
                    .ThenInclude(t => t.Template)
                .Include(ta => ta.Intern)
                    .ThenInclude(i => i.User)
                .FirstOrDefaultAsync(ta => ta.Id == id && !ta.IsDeleted);
        }

        public async Task<IEnumerable<TestAttempt>> GetAllAsync()
        {
            return await _context.TestAttempts
                .Include(ta => ta.Test)
                    .ThenInclude(t => t.Template)
                .Include(ta => ta.Intern)
                    .ThenInclude(i => i.User)
                .Where(ta => !ta.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<TestAttempt>> GetByTestIdAsync(int testId)
        {
            return await _context.TestAttempts
                .Include(ta => ta.Test)
                    .ThenInclude(t => t.Template)
                .Include(ta => ta.Intern)
                    .ThenInclude(i => i.User)
                .Where(ta => ta.TestID == testId && !ta.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<TestAttempt>> GetByInternIdAsync(int internId)
        {
            return await _context.TestAttempts
                .Include(ta => ta.Test)
                    .ThenInclude(t => t.Template)
                .Include(ta => ta.Intern)
                    .ThenInclude(i => i.User)
                .Where(ta => ta.InternID == internId && !ta.IsDeleted)
                .ToListAsync();
        }

        public async Task<TestAttempt?> GetActiveAttemptAsync(int internId, int testId)
        {
            return await _context.TestAttempts
                .FirstOrDefaultAsync(ta => ta.InternID == internId && ta.TestID == testId && !ta.IsSubmitted && !ta.IsDeleted);
        }

        public async Task<IEnumerable<TestAttempt>> GetPendingVerificationsByEvaluatorAsync(int evaluatorId)
        {
            return await _context.TestAttempts
                .Include(a => a.Test)
                    .ThenInclude(t => t!.Template)
                 .Include(a => a.Intern)
                 .Where(a => a.IsSubmitted && !a.IsVerified && a.Test != null && a.Test.Template != null && a.Test.Template.EvaluatorID == evaluatorId)
                 .ToListAsync();
        }

        public async Task<IEnumerable<TestAttempt>> GetPendingHRVerificationsAsync()
        {
            return await _context.TestAttempts
                .Include(a => a.Test)
                    .ThenInclude(t => t!.Template)
                 .Include(a => a.Intern)
                 .Where(a => a.IsSubmitted && a.IsVerified)
                 .ToListAsync();
        }

        public async Task<TestAttempt> CreateAsync(TestAttempt attempt)
        {
            _context.TestAttempts.Add(attempt);
            await _context.SaveChangesAsync();
            return attempt;
        }

        public async Task<TestAttempt> UpdateAsync(TestAttempt attempt)
        {
            attempt.UpdatedAt = DateTime.UtcNow;
            _context.TestAttempts.Update(attempt);
            await _context.SaveChangesAsync();
            return attempt;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var attempt = await _context.TestAttempts.FindAsync(id);
            if (attempt == null) return false;

            attempt.IsDeleted = true;
            attempt.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class AnswerRepository : IAnswerRepository
    {
        private readonly GyanTrackDbContext _context;

        public AnswerRepository(GyanTrackDbContext context)
        {
            _context = context;
        }

        public async Task<Answer?> GetByIdAsync(int id)
        {
            return await _context.Answers
                .Include(a => a.Question)
                .Include(a => a.SelectedOption)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<IEnumerable<Answer>> GetAllAsync()
        {
            return await _context.Answers
                .Include(a => a.Question)
                .Include(a => a.SelectedOption)
                .ToListAsync();
        }

        public async Task<IEnumerable<Answer>> GetByAttemptIdAsync(int attemptId)
        {
            return await _context.Answers
                .Include(a => a.Question)
                .Include(a => a.SelectedOption)
                .Where(a => a.AttemptID == attemptId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Answer>> GetByQuestionIdAsync(int questionId)
        {
            return await _context.Answers
                .Where(a => a.QuestionID == questionId)
                .ToListAsync();
        }

        public async Task<Answer> CreateAsync(Answer answer)
        {
            _context.Answers.Add(answer);
            await _context.SaveChangesAsync();
            return answer;
        }

        public async Task<Answer> UpdateAsync(Answer answer)
        {
            _context.Answers.Update(answer);
            await _context.SaveChangesAsync();
            return answer;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var answer = await _context.Answers.FindAsync(id);
            if (answer == null) return false;

            _context.Answers.Remove(answer);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
