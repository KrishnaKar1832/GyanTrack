using Microsoft.EntityFrameworkCore;
using GyanTrack.Api.Data;
using GyanTrack.Api.Models.Users;

namespace GyanTrack.Api.Repositories.Users
{
    public class UserRepository : IUserRepository
    {
        private readonly GyanTrackDbContext _context;

        public UserRepository(GyanTrackDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted);
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users.Where(u => !u.IsDeleted).ToListAsync();
        }

        public async Task<User> CreateAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateAsync(User user)
        {
            user.UpdatedAt = DateTime.UtcNow;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            user.IsDeleted = true;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class AdminRepository : IAdminRepository
    {
        private readonly GyanTrackDbContext _context;

        public AdminRepository(GyanTrackDbContext context)
        {
            _context = context;
        }

        public async Task<Admin?> GetByIdAsync(int id)
        {
            return await _context.Admins
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.AdminID == id);
        }

        public async Task<Admin?> GetByUserIdAsync(int userId)
        {
            return await _context.Admins
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.AdminID == userId);
        }

        public async Task<IEnumerable<Admin>> GetAllAsync()
        {
            return await _context.Admins
                .Include(a => a.User)
                .ToListAsync();
        }

        public async Task<Admin> CreateAsync(Admin admin)
        {
            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();
            return admin;
        }

        public async Task<Admin> UpdateAsync(Admin admin)
        {
            _context.Admins.Update(admin);
            await _context.SaveChangesAsync();
            return admin;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null) return false;

            _context.Admins.Remove(admin);
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class EvaluatorRepository : IEvaluatorRepository
    {
        private readonly GyanTrackDbContext _context;

        public EvaluatorRepository(GyanTrackDbContext context)
        {
            _context = context;
        }

        public async Task<Evaluator?> GetByIdAsync(int id)
        {
            return await _context.Evaluators
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.EvaluatorID == id);
        }

        public async Task<Evaluator?> GetByUserIdAsync(int userId)
        {
            return await _context.Evaluators
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.EvaluatorID == userId);
        }

        public async Task<IEnumerable<Evaluator>> GetAllAsync()
        {
            return await _context.Evaluators
                .Include(e => e.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<Evaluator>> GetByDepartmentAsync(string department)
        {
            return await _context.Evaluators
                .Include(e => e.User)
                .Where(e => e.Department == department)
                .ToListAsync();
        }

        public async Task<Evaluator> CreateAsync(Evaluator evaluator)
        {
            _context.Evaluators.Add(evaluator);
            await _context.SaveChangesAsync();
            return evaluator;
        }

        public async Task<Evaluator> UpdateAsync(Evaluator evaluator)
        {
            _context.Evaluators.Update(evaluator);
            await _context.SaveChangesAsync();
            return evaluator;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var evaluator = await _context.Evaluators.FindAsync(id);
            if (evaluator == null) return false;

            _context.Evaluators.Remove(evaluator);
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class InternRepository : IInternRepository
    {
        private readonly GyanTrackDbContext _context;

        public InternRepository(GyanTrackDbContext context)
        {
            _context = context;
        }

        public async Task<Intern?> GetByIdAsync(int id)
        {
            return await _context.Interns
                .Include(i => i.User)
                .FirstOrDefaultAsync(i => i.InternID == id);
        }

        public async Task<Intern?> GetByUserIdAsync(int userId)
        {
            return await _context.Interns
                .Include(i => i.User)
                .FirstOrDefaultAsync(i => i.InternID == userId);
        }

        public async Task<Intern?> GetByInternWithUserAsync(int internId)
        {
            return await _context.Interns
                .Include(i => i.User)
                .FirstOrDefaultAsync(i => i.InternID == internId);
        }

        public async Task<IEnumerable<Intern>> GetAllAsync()
        {
            return await _context.Interns
                .Include(i => i.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<Intern>> GetByDepartmentAsync(string department)
        {
            return await _context.Interns
                .Include(i => i.User)
                .Where(i => i.Department == department)
                .ToListAsync();
        }

        public async Task<IEnumerable<Intern>> GetByBatchAsync(string batch)
        {
            return await _context.Interns
                .Include(i => i.User)
                .Where(i => i.Batch == batch)
                .ToListAsync();
        }

        public async Task<Intern> CreateAsync(Intern intern)
        {
            _context.Interns.Add(intern);
            await _context.SaveChangesAsync();
            return intern;
        }

        public async Task<Intern> UpdateAsync(Intern intern)
        {
            _context.Interns.Update(intern);
            await _context.SaveChangesAsync();
            return intern;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var intern = await _context.Interns.FindAsync(id);
            if (intern == null) return false;

            _context.Interns.Remove(intern);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
