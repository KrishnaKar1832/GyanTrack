using Microsoft.EntityFrameworkCore;
using GyanTrack.Api.Data;
using GyanTrack.Api.Models.Evaluations;

namespace GyanTrack.Api.Repositories.Evaluations
{
    public class SubjectRepository : ISubjectRepository
    {
        private readonly GyanTrackDbContext _context;

        public SubjectRepository(GyanTrackDbContext context)
        {
            _context = context;
        }

        public async Task<Subject?> GetByIdAsync(int id)
        {
            return await _context.Subjects.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);
        }

        public async Task<Subject?> GetByNameAsync(string name)
        {
            return await _context.Subjects.FirstOrDefaultAsync(s => s.SubjectName == name && !s.IsDeleted);
        }

        public async Task<IEnumerable<Subject>> GetAllAsync()
        {
            return await _context.Subjects.Where(s => !s.IsDeleted).ToListAsync();
        }

        public async Task<Subject> CreateAsync(Subject subject)
        {
            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();
            return subject;
        }

        public async Task<Subject> UpdateAsync(Subject subject)
        {
            subject.UpdatedAt = DateTime.UtcNow;
            _context.Subjects.Update(subject);
            await _context.SaveChangesAsync();
            return subject;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null) return false;

            subject.IsDeleted = true;
            subject.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class AssignmentTemplateRepository : IAssignmentTemplateRepository
    {
        private readonly GyanTrackDbContext _context;

        public AssignmentTemplateRepository(GyanTrackDbContext context)
        {
            _context = context;
        }

        public async Task<AssignmentTemplate?> GetByIdAsync(int id)
        {
            return await _context.AssignmentTemplates
                .Include(at => at.Subject)
                .Include(at => at.Evaluator)
                    .ThenInclude(e => e.User)
                .Include(at => at.CreatedByAdmin)
                    .ThenInclude(a => a.User)
                .FirstOrDefaultAsync(at => at.Id == id && !at.IsDeleted);
        }

        public async Task<IEnumerable<AssignmentTemplate>> GetAllAsync()
        {
            return await _context.AssignmentTemplates
                .Include(at => at.Subject)
                .Include(at => at.Evaluator)
                    .ThenInclude(e => e.User)
                .Include(at => at.CreatedByAdmin)
                .Where(at => !at.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<AssignmentTemplate>> GetByEvaluatorIdAsync(int evaluatorId)
        {
            return await _context.AssignmentTemplates
                .Include(at => at.Subject)
                .Include(at => at.Evaluator)
                    .ThenInclude(e => e.User)
                .Where(at => at.EvaluatorID == evaluatorId && !at.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<AssignmentTemplate>> GetBySubjectIdAsync(int subjectId)
        {
            return await _context.AssignmentTemplates
                .Include(at => at.Subject)
                .Include(at => at.Evaluator)
                    .ThenInclude(e => e.User)
                .Where(at => at.SubjectID == subjectId && !at.IsDeleted)
                .ToListAsync();
        }

        public async Task<AssignmentTemplate> CreateAsync(AssignmentTemplate template)
        {
            _context.AssignmentTemplates.Add(template);
            await _context.SaveChangesAsync();
            return template;
        }

        public async Task<AssignmentTemplate> UpdateAsync(AssignmentTemplate template)
        {
            template.UpdatedAt = DateTime.UtcNow;
            _context.AssignmentTemplates.Update(template);
            await _context.SaveChangesAsync();
            return template;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var template = await _context.AssignmentTemplates.FindAsync(id);
            if (template == null) return false;

            template.IsDeleted = true;
            template.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class EvaluatorInternRepository : IEvaluatorInternRepository
    {
        private readonly GyanTrackDbContext _context;

        public EvaluatorInternRepository(GyanTrackDbContext context)
        {
            _context = context;
        }

        public async Task<EvaluatorIntern?> GetByIdAsync(int id)
        {
            return await _context.EvaluatorInterns
                .Include(ei => ei.Evaluator)
                    .ThenInclude(e => e.User)
                .Include(ei => ei.Intern)
                    .ThenInclude(i => i.User)
                .FirstOrDefaultAsync(ei => ei.Id == id && !ei.IsDeleted);
        }

        public async Task<IEnumerable<EvaluatorIntern>> GetAllAsync()
        {
            return await _context.EvaluatorInterns
                .Include(ei => ei.Evaluator)
                    .ThenInclude(e => e.User)
                .Include(ei => ei.Intern)
                    .ThenInclude(i => i.User)
                .Where(ei => !ei.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<EvaluatorIntern>> GetByEvaluatorIdAsync(int evaluatorId)
        {
            return await _context.EvaluatorInterns
                .Include(ei => ei.Evaluator)
                    .ThenInclude(e => e.User)
                .Include(ei => ei.Intern)
                    .ThenInclude(i => i.User)
                .Where(ei => ei.EvaluatorID == evaluatorId && !ei.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<EvaluatorIntern>> GetByInternIdAsync(int internId)
        {
            return await _context.EvaluatorInterns
                .Include(ei => ei.Evaluator)
                    .ThenInclude(e => e.User)
                .Include(ei => ei.Intern)
                    .ThenInclude(i => i.User)
                .Where(ei => ei.InternID == internId && !ei.IsDeleted)
                .ToListAsync();
        }

        public async Task<bool> ExistsAsync(int evaluatorId, int internId)
        {
            return await _context.EvaluatorInterns
                .AnyAsync(ei => ei.EvaluatorID == evaluatorId && ei.InternID == internId && !ei.IsDeleted);
        }

        public async Task<EvaluatorIntern> CreateAsync(EvaluatorIntern mapping)
        {
            _context.EvaluatorInterns.Add(mapping);
            await _context.SaveChangesAsync();
            return mapping;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var mapping = await _context.EvaluatorInterns.FindAsync(id);
            if (mapping == null) return false;

            mapping.IsDeleted = true;
            mapping.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class PerformanceScoreRepository : IPerformanceScoreRepository
    {
        private readonly GyanTrackDbContext _context;

        public PerformanceScoreRepository(GyanTrackDbContext context)
        {
            _context = context;
        }

        public async Task<PerformanceScore?> GetByIdAsync(int id)
        {
            return await _context.PerformanceScores
                .Include(ps => ps.Intern)
                    .ThenInclude(i => i.User)
                .Include(ps => ps.Template)
                    .ThenInclude(t => t.Subject)
                .Include(ps => ps.Evaluator)
                    .ThenInclude(e => e.User)
                .FirstOrDefaultAsync(ps => ps.Id == id && !ps.IsDeleted);
        }

        public async Task<IEnumerable<PerformanceScore>> GetAllAsync()
        {
            return await _context.PerformanceScores
                .Include(ps => ps.Intern)
                    .ThenInclude(i => i.User)
                .Include(ps => ps.Template)
                    .ThenInclude(t => t.Subject)
                .Include(ps => ps.Evaluator)
                    .ThenInclude(e => e.User)
                .Where(ps => !ps.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<PerformanceScore>> GetByInternIdAsync(int internId)
        {
            return await _context.PerformanceScores
                .Include(ps => ps.Intern)
                    .ThenInclude(i => i.User)
                .Include(ps => ps.Template)
                    .ThenInclude(t => t.Subject)
                .Include(ps => ps.Evaluator)
                    .ThenInclude(e => e.User)
                .Where(ps => ps.InternID == internId && !ps.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<PerformanceScore>> GetByTemplateIdAsync(int templateId)
        {
            return await _context.PerformanceScores
                .Include(ps => ps.Intern)
                    .ThenInclude(i => i.User)
                .Include(ps => ps.Template)
                    .ThenInclude(t => t.Subject)
                .Include(ps => ps.Evaluator)
                    .ThenInclude(e => e.User)
                .Where(ps => ps.TemplateID == templateId && !ps.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<PerformanceScore>> GetByEvaluatorIdAsync(int evaluatorId)
        {
            return await _context.PerformanceScores
                .Include(ps => ps.Intern)
                    .ThenInclude(i => i.User)
                .Include(ps => ps.Template)
                    .ThenInclude(t => t.Subject)
                .Include(ps => ps.Evaluator)
                    .ThenInclude(e => e.User)
                .Where(ps => ps.EvaluatorID == evaluatorId && !ps.IsDeleted)
                .ToListAsync();
        }

        public async Task<PerformanceScore> CreateAsync(PerformanceScore score)
        {
            _context.PerformanceScores.Add(score);
            await _context.SaveChangesAsync();
            return score;
        }

        public async Task<PerformanceScore> UpdateAsync(PerformanceScore score)
        {
            score.UpdatedAt = DateTime.UtcNow;
            _context.PerformanceScores.Update(score);
            await _context.SaveChangesAsync();
            return score;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var score = await _context.PerformanceScores.FindAsync(id);
            if (score == null) return false;

            score.IsDeleted = true;
            score.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class EvaluatorRemarkRepository : IEvaluatorRemarkRepository
    {
        private readonly GyanTrackDbContext _context;

        public EvaluatorRemarkRepository(GyanTrackDbContext context)
        {
            _context = context;
        }

        public async Task<EvaluatorRemark?> GetByIdAsync(int id)
        {
            return await _context.EvaluatorRemarks
                .Include(er => er.TestAttempt)
                .Include(er => er.Evaluator)
                    .ThenInclude(e => e.User)
                .FirstOrDefaultAsync(er => er.Id == id && !er.IsDeleted);
        }

        public async Task<IEnumerable<EvaluatorRemark>> GetAllAsync()
        {
            return await _context.EvaluatorRemarks
                .Include(er => er.TestAttempt)
                .Include(er => er.Evaluator)
                    .ThenInclude(e => e.User)
                .Where(er => !er.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<EvaluatorRemark>> GetByAttemptIdAsync(int attemptId)
        {
            return await _context.EvaluatorRemarks
                .Include(er => er.TestAttempt)
                .Include(er => er.Evaluator)
                    .ThenInclude(e => e.User)
                .Where(er => er.AttemptID == attemptId && !er.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<EvaluatorRemark>> GetByEvaluatorIdAsync(int evaluatorId)
        {
            return await _context.EvaluatorRemarks
                .Include(er => er.TestAttempt)
                .Include(er => er.Evaluator)
                    .ThenInclude(e => e.User)
                .Where(er => er.EvaluatorID == evaluatorId && !er.IsDeleted)
                .ToListAsync();
        }

        public async Task<EvaluatorRemark> CreateAsync(EvaluatorRemark remark)
        {
            _context.EvaluatorRemarks.Add(remark);
            await _context.SaveChangesAsync();
            return remark;
        }

        public async Task<EvaluatorRemark> UpdateAsync(EvaluatorRemark remark)
        {
            remark.UpdatedAt = DateTime.UtcNow;
            _context.EvaluatorRemarks.Update(remark);
            await _context.SaveChangesAsync();
            return remark;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var remark = await _context.EvaluatorRemarks.FindAsync(id);
            if (remark == null) return false;

            remark.IsDeleted = true;
            remark.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
